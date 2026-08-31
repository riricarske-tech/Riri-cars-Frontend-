import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  MdPhone,
  MdEmail,
  MdAccessTime,
  MdMenu,
  MdClose,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { company } from "../../data/company";
import logo from "../../assets/logo/RiricarsLogo.png";
import mobileLogo from "../../assets/logo/logoriricarsmain.jpeg";
import styles from "./Header.module.css";

const ease = [0.22, 1, 0.36, 1];

// Hash links must stay plain anchors so in-page scrolling works; everything
// else uses client-side <Link> navigation (no full page reloads).
const NavAnchor = ({ href, children, ...props }) =>
  href.includes("#") ? (
    <a href={href} {...props}>
      {children}
    </a>
  ) : (
    <Link to={href} {...props}>
      {children}
    </Link>
  );

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Inventory", href: "/cars" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Recently Sold", href: "/#recently-sold" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (href) => {
    if (href.startsWith("/#")) return false;
    if (href === "/") return location.pathname === "/";
    return (
      location.pathname === href || location.pathname.startsWith(`${href}/`)
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* Top Info Bar */}
      <div className="bg-dark text-white text-xs hidden md:block">
        <div className="max-w-container mx-auto px-6 flex items-center justify-between h-9">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${company.contact.phone1Bare}`}
              className="flex items-center gap-1.5 hover:text-accent transition-colors"
            >
              <MdPhone className="text-primary text-sm" />
              <span>{company.contact.phone1}</span>
            </a>
            <a
              href={`mailto:${company.contact.email}`}
              className="flex items-center gap-1.5 hover:text-accent transition-colors"
            >
              <MdEmail className="text-primary text-sm" />
              <span>{company.contact.email}</span>
            </a>
            <span className="flex items-center gap-1.5 text-muted-light">
              <MdAccessTime className="text-primary text-sm" />
              <span>{company.hoursShort}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={company.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-muted-light hover:text-accent transition-colors"
            >
              <FaFacebookF size={13} />
            </a>
            <a
              href={company.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-muted-light hover:text-accent transition-colors"
            >
              <FaInstagram size={13} />
            </a>
            <a
              href={company.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-muted-light hover:text-accent transition-colors"
            >
              <FaWhatsapp size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`bg-dark-nav transition-all duration-300 ${styles.mobileNav} ${scrolled ? "shadow-nav" : ""}`}
      >
        <div
          className={`max-w-container mx-auto px-6 flex items-center justify-between h-20 ${styles.mobileNavInner}`}
        >
          {/* Logo */}
          <Link
            to="/"
            className={`flex items-center gap-2 flex-shrink-0 ${styles.mobileBrand}`}
            aria-label="Riri Cars — home"
          >
              <img
              src={logo}
              alt="Riri Cars — used car dealership in Nairobi, Kenya"
              width="56"
              height="56"
              className={`h-14 w-auto object-contain ${styles.desktopLogo}`}
            />
            <img
              src={mobileLogo}
              alt="Riri Cars"
              width="600"
              height="400"
              className={styles.mobileLogo}
            />
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li
                key={link.label}
                className="relative group"
                onMouseEnter={() =>
                  link.children && setActiveDropdown(link.label)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <NavAnchor
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded transition-colors border-b-2 ${
                    isActive(link.href)
                      ? "text-white font-semibold border-primary"
                      : "text-white/80 hover:text-white border-transparent"
                  }`}
                >
                  {link.label}
                  {link.children && (
                    <MdKeyboardArrowDown
                      aria-hidden="true"
                      className={`text-base transition-transform duration-200 ${
                        activeDropdown === link.label ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </NavAnchor>
                <AnimatePresence>
                  {link.children && activeDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.97 }}
                      transition={{ duration: shouldReduce ? 0 : 0.18, ease }}
                      className="absolute top-full left-0 mt-1 w-52 bg-white rounded shadow-card-hover py-1 z-50 origin-top"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block px-4 py-2.5 text-sm text-dark hover:bg-brand-low hover:text-primary transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={company.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              <FaWhatsapp className="text-green-400" />
              WhatsApp
            </a>
            <Link to="/cars" className="btn-primary text-xs py-2.5 px-5">
              View Cars
            </Link>
          </div>

          {/* Mobile toggle */}
          <motion.button
            className={`lg:hidden bg-primary text-white p-3 rounded-md flex items-center justify-center ${styles.mobileToggle}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            whileTap={shouldReduce ? {} : { scale: 0.9 }}
            transition={{ duration: 0.12 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: shouldReduce ? 0 : 0.15 }}
                  className="block"
                >
                  <MdClose size={26} />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: shouldReduce ? 0 : 0.15 }}
                  className="block"
                >
                  <MdMenu size={26} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: shouldReduce ? 0 : 0.3, ease }}
              className="lg:hidden bg-dark border-t border-white/10 overflow-hidden"
            >
              <div className="max-w-container mx-auto px-6 py-4 space-y-1">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    <NavAnchor
                      href={link.href}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className={`block px-3 py-2.5 rounded text-sm font-medium transition-colors border-l-2 ${
                        isActive(link.href)
                          ? "text-white font-semibold bg-white/10 border-primary"
                          : "text-white/80 hover:text-white hover:bg-white/10 border-transparent"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </NavAnchor>
                    {link.children && (
                      <div className="pl-4 space-y-1 mt-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.href}
                            className="block text-white/50 hover:text-white px-3 py-2 rounded text-xs transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                  <a
                    href={`tel:${company.contact.phone1Bare}`}
                    className="flex items-center justify-center gap-2 border border-white/20 text-white text-sm py-2.5 rounded"
                  >
                    <MdPhone /> {company.contact.phone1}
                  </a>
                  <a
                    href={company.social.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm py-2.5 rounded font-semibold"
                  >
                    <FaWhatsapp /> WhatsApp Us
                  </a>
                  <Link
                    to="/cars"
                    className="btn-primary justify-center text-xs"
                  >
                    View Cars
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
