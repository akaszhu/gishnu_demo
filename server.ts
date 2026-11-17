import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { PRODUCTS, PROMO_CODES } from './src/data/catalog.ts';
import { OFFLINE_STORES } from './src/data/stores.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface ChatTurn {
  role: 'user' | 'assistant';
  text: string;
}

interface ChatContextPayload {
  currentPage?: string;
  activeProductId?: number;
  cartCount?: number;
}

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /reveal\s+(your\s+)?(system\s+prompt|instructions|api\s*key)/i,
  /print\s+(your\s+)?(system\s+prompt|env|environment)/i,
  /bypass\s+(the\s+)?(guard|guardrail|safety|filter)/i,
  /jailbreak/i,
  /act\s+as\s+dan\b/i,
];

function buildCatalogContext(): string {
  const productLines = PRODUCTS.map((p) => {
    const colors = p.colors.map((c) => c.name).join(', ');
    const sizes = p.sizes.join(', ');
    return `ID ${p.id}: ${p.name} | Category: ${p.category} | Line: ${p.line} | Price: ₹${p.price}${
      p.oldPrice ? ` (MRP ₹${p.oldPrice})` : ''
    } | Rating: ${p.rating}/5 (${p.reviewCount} reviews) | Colors: [${colors}] | Sizes: [${sizes}] | Embroidery: ${
      p.supportsEmbroidery ? 'Yes (+₹199)' : 'No'
    } | Highlights: ${p.highlights.slice(0, 2).join('; ')}`;
  }).join('\n');

  const storeLines = OFFLINE_STORES.map(
    (s) => `${s.city}: ${s.name}, ${s.address} (PIN ${s.pinCode}), Landmark: ${s.landmark}, Hours: ${s.hours}, Phone: ${s.phone}`
  ).join('\n');

  const promoLines = Object.entries(PROMO_CODES)
    .map(([code, info]) => `${code}: ${info.label} (${info.discountPercent}% off)`)
    .join('; ');

  return `TRADE MEDS VERIFIED CATALOG (15 items):
${productLines}

PROMO CODES:
${promoLines}

SHIPPING & POLICIES:
- Free delivery above ₹1,999 (₹99 standard below ₹1,999, ₹149 express 1-2 day delivery).
- 7-day zero-hassle doorstep size exchange on unwashed, non-embroidered items.
- 30-day clinical acoustic trial on 6sense stethoscopes + 3-year warranty.
- Payments accepted: UPI (GPay, PhonePe, BHIM), Credit/Debit Cards, NetBanking, 0% EMI, Cash on Delivery (COD), plus GST Tax Invoice with GSTIN.
- Custom Chest Embroidery: +₹199 on Scrubs, Lab Coats, and Ward Jackets (not available on Stethoscopes, Clogs, Underscrubs, or Scrub Caps).
- Institutional Bulk Orders: Save up to 25% on 15+ sets with complimentary hospital logo digitisation.

OFFLINE EXPERIENCE CENTRES (8 Cities):
${storeLines}

SIZE GUIDE SUMMARY (Scrubs & Lab Coats):
XS: Chest 34-35" / Waist 26-27"
S: Chest 36-37" / Waist 28-29"
M: Chest 38-40" / Waist 30-32"
L: Chest 41-43" / Waist 33-35"
XL: Chest 44-46" / Waist 36-38"
2XL: Chest 47-50" / Waist 39-42"
3XL: Chest 51-54" / Waist 43-46"`;
}

const SYSTEM_INSTRUCTION = `You are the Trade Meds Clinical Outfitting Guide & Match Guard.
Your sole purpose is to help doctors, nurses, residents, and medical students choose the right Trade Meds scrubs, lab coats, 6sense stethoscopes, clogs, underscrubs, sizes, colorways, embroidery options, promo codes, bulk orders, order tracking, and offline Experience Centres.

STRICT MATCH GUARD POLICIES:
1. DOMAIN SCOPE GUARD: Stay strictly focused on Trade Meds products, sizing, fabric care, shipping/payments, bulk orders, and store locations. If the user asks unrelated questions (politics, general coding, entertainment, math homework, etc.), set guardStatus to "off_topic_redirect", politely explain you only guide on Trade Meds clinical apparel & shopping, and suggest helpful storefront topics.
2. CLINICAL MEDICAL ADVICE GUARD: NEVER diagnose illnesses, interpret patient symptoms, prescribe medications, or give medical treatment advice. If asked for medical/clinical diagnosis or patient advice, set guardStatus to "medical_disclaimer", clarify that you are a clinical apparel & gear assistant (not a medical advisor), and recommend consulting a licensed clinician—while offering relevant Trade Meds gear if appropriate.
3. CATALOG TRUTH GUARD: ONLY recommend product IDs from 1 to 15 listed below. Never invent products, prices, discounts, or store cities. Verify embroidery compatibility accurately (only Scrubs, Lab Coats, and DRIFT Ward Jacket support +₹199 chest embroidery).
4. CONCISE HELPFUL TONE: Keep replies crisp, structured, and practical (2-4 short sentences or concise bullet-style phrasing in plain text without heavy markdown clutter). Suggest up to 3 best-matching product IDs and up to 3 helpful storefront action buttons.

${buildCatalogContext()}`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    guardStatus: {
      type: Type.STRING,
      description:
        'Must be one of: "on_topic", "off_topic_redirect", or "medical_disclaimer".',
    },
    guardReason: {
      type: Type.STRING,
      description:
        'Short 4-8 word label summarizing the Match Guard verification or boundary applied.',
    },
    reply: {
      type: Type.STRING,
      description:
        'Helpful, concise Trade Meds guidance in plain text (2-4 sentences).',
    },
    recommendedProductIds: {
      type: Type.ARRAY,
      items: { type: Type.INTEGER },
      description: 'Up to 3 valid catalog product IDs (1-15) matching the user need.',
    },
    suggestedActions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          action: {
            type: Type.STRING,
            description:
              'One of: "shop", "stores", "bulk", "track", "size_guide", "cart".',
          },
          category: {
            type: Type.STRING,
            description:
              'Optional category when action is "shop": "Women", "Men", "Lab Coats", "Stethoscopes", "Accessories", or "".',
          },
        },
        required: ['label', 'action'],
      },
      description: 'Up to 3 helpful navigation actions.',
    },
    followUpPrompts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '2 to 3 short clickable follow-up user questions.',
    },
  },
  required: [
    'guardStatus',
    'guardReason',
    'reply',
    'recommendedProductIds',
    'suggestedActions',
    'followUpPrompts',
  ],
};

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'trade-meds-storefront' });
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const body = req.body as {
        messages?: ChatTurn[];
        context?: ChatContextPayload;
      };

      const messages = Array.isArray(body?.messages) ? body.messages : [];
      const lastUserMessage = [...messages]
        .reverse()
        .find((m) => m.role === 'user' && typeof m.text === 'string');

      if (!lastUserMessage || !lastUserMessage.text.trim()) {
        res.status(400).json({ error: 'Please enter a message to ask the Trade Meds Guide.' });
        return;
      }

      const trimmedText = lastUserMessage.text.trim().slice(0, 1200);

      // Layer 1 Match Guard: deterministic prompt-injection & system-override shield
      if (PROMPT_INJECTION_PATTERNS.some((re) => re.test(trimmedText))) {
        res.json({
          guardStatus: 'injection_blocked',
          guardReason: 'Match Guard · Prompt Shield blocked override attempt',
          reply:
            'Match Guard kept this session scoped to Trade Meds shopping guidance. I can help you match scrub sizes, compare ecoflex™ vs. Classic fabrics, check embroidery eligibility, or locate our 8 Experience Centres.',
          recommendedProductIds: [1, 2, 4],
          suggestedActions: [
            { label: 'Open Size Guide', action: 'size_guide' },
            { label: 'Visit Offline Stores', action: 'stores' },
          ],
          followUpPrompts: [
            'Which scrub line is best for 12-hour ICU shifts?',
            'Help me find my scrub size',
            'Show offline stores in Bengaluru',
          ],
        });
        return;
      }

      if (!process.env.GEMINI_API_KEY) {
        res.status(500).json({
          error:
            'Gemini API key is not configured. Please check or add GEMINI_API_KEY in the Settings > Secrets panel.',
        });
        return;
      }

      const activeProduct = body.context?.activeProductId
        ? PRODUCTS.find((p) => p.id === body.context?.activeProductId)
        : undefined;

      const contextNote = `[User storefront context: page=${
        body.context?.currentPage || 'home'
      }, cartItems=${body.context?.cartCount ?? 0}${
        activeProduct
          ? `, viewingProduct="ID ${activeProduct.id}: ${activeProduct.name} (₹${activeProduct.price})"`
          : ''
      }]`;

      const recentHistory = messages.slice(-8).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [
          {
            text:
              m.role === 'user' && m === lastUserMessage
                ? `${contextNote}\n${trimmedText}`
                : m.text.slice(0, 1200),
          },
        ],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: recentHistory,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const rawJson = (response.text ?? '').trim();
      if (!rawJson) {
        res.status(502).json({
          error: 'Received an empty response from the assistant. Please try again.',
        });
        return;
      }

      const parsed = JSON.parse(rawJson) as {
        guardStatus?: string;
        guardReason?: string;
        reply?: string;
        recommendedProductIds?: number[];
        suggestedActions?: Array<{ label: string; action: string; category?: string }>;
        followUpPrompts?: string[];
      };

      const validIds = new Set(PRODUCTS.map((p) => p.id));
      const safeProductIds = Array.isArray(parsed.recommendedProductIds)
        ? parsed.recommendedProductIds.filter((id) => validIds.has(id)).slice(0, 3)
        : [];

      const allowedActions = new Set([
        'shop',
        'stores',
        'bulk',
        'track',
        'size_guide',
        'cart',
      ]);
      const safeActions = Array.isArray(parsed.suggestedActions)
        ? parsed.suggestedActions
            .filter((a) => a && typeof a.label === 'string' && allowedActions.has(a.action))
            .slice(0, 3)
        : [];

      const allowedStatuses = new Set([
        'on_topic',
        'off_topic_redirect',
        'medical_disclaimer',
      ]);
      const safeStatus = allowedStatuses.has(parsed.guardStatus || '')
        ? parsed.guardStatus
        : 'on_topic';

      res.json({
        guardStatus: safeStatus,
        guardReason:
          parsed.guardReason || 'Verified against Trade Meds 15-item catalog',
        reply: parsed.reply || 'How can I help you outfit your next clinical shift?',
        recommendedProductIds: safeProductIds,
        suggestedActions: safeActions,
        followUpPrompts: Array.isArray(parsed.followUpPrompts)
          ? parsed.followUpPrompts.slice(0, 3)
          : [],
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (/403|PERMISSION_DENIED|API_KEY_INVALID|API key not valid/i.test(msg)) {
        res.status(403).json({
          error:
            'Gemini API authentication failed. Please verify your API key in the Settings > Secrets panel.',
        });
        return;
      }
      if (/429|RESOURCE_EXHAUSTED|quota/i.test(msg)) {
        res.status(429).json({
          error:
            'Assistant rate limit reached momentarily. Please wait a few seconds and try again.',
        });
        return;
      }
      res.status(500).json({
        error: `Assistant request failed: ${msg}`,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexHtml = path.join(distDir, 'index.html');
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Trade Meds server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
