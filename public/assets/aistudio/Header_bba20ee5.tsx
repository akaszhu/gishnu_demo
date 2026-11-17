import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count } = useCart();
  const { ids } = useWishlist();
  const links = [["Shop all", "/shop"], ["Men", "/shop?category=Men"], ["Women", "/shop?category=Women"], ["Lab coats", "/shop?category=Lab%20Coats"], ["Accessories", "/shop?category=Accessories"]];
  return <>
    <div className="announcement">A little more comfort for every shift <span> · </span> Free shipping on orders over ₹1,999</div>
    <header className="site-header">
      <button className="icon-button mobile-menu" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
      <Link to="/" className="brand"><span className="brand-mark">T</span><span>TRADE <b>MEDS</b><small>CARE IN EVERY DETAIL</small></span></Link>
      <nav className={menuOpen ? "main-nav open" : "main-nav"}>
        {links.map(([label, path]) => <NavLink key={label} to={path} onClick={() => setMenuOpen(false)}>{label}</NavLink>)}
      </nav>
      <div className="header-actions">
        <button className="icon-button" aria-label="Search" onClick={() => setSearchOpen(!searchOpen)}><Search/></button>
        <Link className="icon-button account-link" to="/account" aria-label="Account"><UserRound/></Link>
        <Link className="icon-button" to="/wishlist" aria-label="Wishlist"><Heart/><span className="count">{ids.length}</span></Link>
        <Link className="icon-button" to="/cart" aria-label="Shopping bag"><ShoppingBag/><span className="count">{count}</span></Link>
      </div>
    </header>
    {searchOpen && <form className="search-panel" action="/shop"><input name="q" placeholder="Search scrubs, lab coats and more..." autoFocus/><button className="button button-dark">Search</button></form>}
  </>;
}