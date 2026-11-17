export interface StoreLocation {
  id: string;
  city: string;
  name: string;
  badge: string;
  address: string;
  landmark: string;
  pinCode: string;
  phone: string;
  hours: string;
  services: string[];
  popularFor: string;
}

export const OFFLINE_STORES: StoreLocation[] = [
  {
    id: 'mum-parel',
    city: 'Mumbai',
    name: 'Trade Meds Flagship — Parel Medical Hub',
    badge: 'Flagship Experience Centre',
    address: 'Ground Floor, Emerald Plaza, Dr. Ernest Borges Road, Parel',
    landmark: '200m from KEM Hospital & Tata Memorial Centre',
    pinCode: '400012',
    phone: '+91 22 4890 3110',
    hours: 'Mon–Sun · 10:00 AM – 9:00 PM',
    services: [
      'Full XS–3XL Scrub Trial Room',
      'Same-Day Chest Embroidery',
      '6sense Stethoscope Acoustic Booth',
      'Instant Exchange Counter',
    ],
    popularFor: 'ecoflex™ Scrubs, Chief Lab Coats & Resident Kits',
  },
  {
    id: 'blr-bannerghatta',
    city: 'Bengaluru',
    name: 'Trade Meds Studio — Bannerghatta Road',
    badge: 'Express Embroidery',
    address: 'Shop 14, MedSquare Arcade, Bannerghatta Main Road',
    landmark: 'Opposite Apollo Specialty Hospital Gate 2',
    pinCode: '560076',
    phone: '+91 80 4120 7788',
    hours: 'Mon–Sun · 10:00 AM – 8:30 PM',
    services: [
      'Full XS–3XL Scrub Trial Room',
      '2-Hour Express Embroidery',
      'Hospital Bulk Sizing Desk',
      'AeroStep Footwear Trial',
    ],
    popularFor: 'ICU Teams, Clinical Clogs & 6sense Stethoscopes',
  },
  {
    id: 'del-aiims',
    city: 'Delhi NCR',
    name: 'Trade Meds Lounge — Ansari Nagar / South Ex',
    badge: 'Campus Favourite',
    address: 'G-7, Medico Arcade, Ring Road, South Extension Part I',
    landmark: '5 mins from AIIMS New Delhi & Safdarjung Hospital',
    pinCode: '110049',
    phone: '+91 11 4602 9940',
    hours: 'Mon–Sun · 10:00 AM – 8:30 PM',
    services: [
      'Student Apron & Scrub Trial',
      'Same-Day Chest Embroidery',
      '6sense Acoustic Comparison',
      'Free Alterations',
    ],
    popularFor: 'Chief Lab Coats, Campus Aprons & 6sense Lite',
  },
  {
    id: 'che-greams',
    city: 'Chennai',
    name: 'Trade Meds Store — Greams Road',
    badge: 'Clinical Hub',
    address: 'No. 42, Greams Lane, Thousand Lights',
    landmark: 'Adjacent to Apollo Main Hospital',
    pinCode: '600006',
    phone: '+91 44 4310 5521',
    hours: 'Mon–Sun · 10:00 AM – 8:30 PM',
    services: [
      'Full XS–3XL Scrub Trial Room',
      '48-Hour Custom Embroidery',
      'DRIFT Ward Jacket Fitting',
    ],
    popularFor: 'ecoflex™ Lite Cooling Scrubs & Footwear',
  },
  {
    id: 'hyd-banjara',
    city: 'Hyderabad',
    name: 'Trade Meds Studio — Banjara Hills',
    badge: 'Experience Centre',
    address: 'Unit 3, Care Tower, Road No. 12, Banjara Hills',
    landmark: 'Near Virinchi & Care Hospitals',
    pinCode: '500034',
    phone: '+91 40 4855 1900',
    hours: 'Mon–Sun · 10:30 AM – 8:30 PM',
    services: [
      'Full XS–3XL Scrub Trial Room',
      'Same-Day Chest Embroidery',
      'Hospital Bulk Sizing Desk',
    ],
    popularFor: 'ecoflex™ 4-Way Stretch & Surgical Caps',
  },
  {
    id: 'pun-shivajinagar',
    city: 'Pune',
    name: 'Trade Meds Store — Shivajinagar',
    badge: 'Student & Resident Hub',
    address: 'Shop 6, Fergusson Medical Arcade, FC Road',
    landmark: '10 mins from B.J. Medical College & Sassoon Hospital',
    pinCode: '411004',
    phone: '+91 20 4128 6430',
    hours: 'Tue–Sun · 10:30 AM – 8:30 PM',
    services: [
      'Campus Apron & Scrub Fitting',
      '6sense Stethoscope Acoustic Booth',
      'Instant Exchange Counter',
    ],
    popularFor: 'MBBS Student Kits & Classic V-Neck Scrubs',
  },
  {
    id: 'kol-parkcircus',
    city: 'Kolkata',
    name: 'Trade Meds Store — Park Circus',
    badge: 'East Flagship',
    address: '28B, Syed Amir Ali Avenue, Park Circus',
    landmark: 'Near Institute of Child Health & Medical College',
    pinCode: '700017',
    phone: '+91 33 4062 8810',
    hours: 'Mon–Sun · 10:30 AM – 8:30 PM',
    services: [
      'Full XS–3XL Scrub Trial Room',
      '48-Hour Custom Embroidery',
      'AeroStep Footwear Trial',
    ],
    popularFor: 'Lab Coats, Underscrubs & Classic Scrub Sets',
  },
  {
    id: 'ahm-navrangpura',
    city: 'Ahmedabad',
    name: 'Trade Meds Studio — Navrangpura',
    badge: 'West Hub',
    address: '104, MedLink Complex, Near Sardar Patel Stadium Road',
    landmark: 'Near Civil Hospital & NHL Medical College',
    pinCode: '380009',
    phone: '+91 79 4008 7122',
    hours: 'Mon–Sun · 10:30 AM – 8:30 PM',
    services: [
      'Full XS–3XL Scrub Trial Room',
      'Same-Day Chest Embroidery',
      'Hospital Bulk Sizing Desk',
    ],
    popularFor: 'ecoflex™ Lite Scrubs & 6sense Stethoscopes',
  },
];
