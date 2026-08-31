import { Link } from 'react-router-dom'
import {
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdArrowForward,
  MdAccessTime,
  MdMap,
} from 'react-icons/md'
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { company } from '../../data/company'

// Hash links stay plain anchors for in-page scrolling; the rest use SPA navigation.
const FooterAnchor = ({ href, className, children }) =>
  href.includes('#') ? (
    <a href={href} className={className}>
      {children}
    </a>
  ) : (
    <Link to={href} className={className}>
      {children}
    </Link>
  )

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'All Vehicles', href: '/cars' },
  { label: 'Hatchbacks', href: '/cars?bodyType=Hatchback' },
  { label: 'Sedans & Saloons', href: '/cars?bodyType=Sedan' },
  { label: 'SUVs & 4x4s', href: '/cars?bodyType=SUV' },
  { label: 'Hybrid Cars', href: '/cars?fuel=Hybrid' },
  { label: 'About Us', href: '/about' },
  { label: 'Recently Sold', href: '/#recently-sold' },
]

const serviceLinks = [
  'Quality Used Imports',
  'Asset Financing',
  'Trade-In / Exchange',
  'Direct Import Service',
  'Insurance Assistance',
  'After-Sales Support',
]

export default function Footer() {
  return (
    <footer id="footer" className="bg-dark">
      <div className="w-full h-1 bg-red-shine" />

      <div className="container-main py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex flex-col leading-none">
                <span className="text-white font-black text-2xl tracking-tight">RIRI</span>
                <span className="text-primary font-black text-2xl tracking-tight -mt-1">CARS</span>
              </div>
              <div className="w-px h-10 bg-white/20 mx-1" />
              <span className="text-white/40 text-xs font-medium leading-tight">
                Where Excellence<br />Meets Affordability
              </span>
            </div>

            <p className="text-white/50 text-sm leading-relaxed mb-3">
              Riri Cars is a trusted importer and dealer of quality imported vehicles,
              located along Kiambu Road in Nairobi.
            </p>
            <p className="text-white/30 text-xs italic mb-5">
              "{company.slogan}"
            </p>

            {/* Social media — only verified platforms */}
            <div className="flex items-center gap-2.5">
              <a
                href={company.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook (54K+ followers — Verified)"
                className="w-9 h-9 bg-white/5 hover:bg-primary border border-white/10 hover:border-primary rounded flex items-center justify-center text-white/60 hover:text-white transition-all duration-200"
              >
                <FaFacebookF size={14} />
              </a>
              <a
                href={company.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 bg-white/5 hover:bg-primary border border-white/10 hover:border-primary rounded flex items-center justify-center text-white/60 hover:text-white transition-all duration-200"
              >
                <FaInstagram size={14} />
              </a>
              <a
                href={company.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 bg-white/5 hover:bg-green-600 border border-white/10 hover:border-green-600 rounded flex items-center justify-center text-white/60 hover:text-white transition-all duration-200"
              >
                <FaWhatsapp size={14} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-1">
              Quick Links
            </h3>
            <div className="w-8 h-0.5 bg-primary mb-5" />
            <ul className="space-y-2.5">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <FooterAnchor
                    href={href}
                    className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors group"
                  >
                    <MdArrowForward className="text-primary text-xs opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {label}
                  </FooterAnchor>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-1">
              Our Services
            </h3>
            <div className="w-8 h-0.5 bg-primary mb-5" />
            <ul className="space-y-2.5">
              {serviceLinks.map((label) => (
                <li key={label}>
                  <Link
                    to="/services"
                    className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors group"
                  >
                    <MdArrowForward className="text-primary text-xs opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — all verified */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-1">
              Contact Us
            </h3>
            <div className="w-8 h-0.5 bg-primary mb-5" />
            <ul className="space-y-4">
              {/* Address */}
              <li className="flex items-start gap-3">
                <MdLocationOn className="text-primary text-lg flex-shrink-0 mt-0.5" />
                <address className="not-italic">
                  <p className="text-white/70 text-sm leading-relaxed">
                    {company.location.street}
                  </p>
                  <p className="text-white/50 text-xs mt-0.5">
                    {company.location.landmark}
                  </p>
                  <p className="text-white/50 text-xs">{company.location.area}</p>
                  <a
                    href={company.location.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-accent hover:text-accent-light text-xs mt-1 transition-colors"
                  >
                    <MdMap size={12} /> Get Directions
                  </a>
                </address>
              </li>

              {/* Phone — official number */}
              <li>
                <a
                  href={`tel:${company.contact.phone1Bare}`}
                  className="flex items-center gap-3 text-white/50 hover:text-white text-sm transition-colors"
                >
                  <MdPhone className="text-primary text-lg flex-shrink-0" />
                  {company.contact.phone1}
                </a>
              </li>

              {/* WhatsApp — verified from Facebook */}
              <li>
                <a
                  href={company.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/50 hover:text-white text-sm transition-colors"
                >
                  <FaWhatsapp className="text-green-400 text-lg flex-shrink-0" />
                  {company.contact.whatsapp} (WhatsApp)
                </a>
              </li>

              {/* Email */}
              <li>
                <a
                  href={`mailto:${company.contact.email}`}
                  className="flex items-center gap-3 text-white/50 hover:text-white text-sm transition-colors"
                >
                  <MdEmail className="text-primary text-lg flex-shrink-0" />
                  {company.contact.email}
                </a>
              </li>

              {/* Hours */}
              <li className="flex items-start gap-3">
                <MdAccessTime className="text-primary text-lg flex-shrink-0 mt-0.5" />
                <div className="text-white/50 text-xs space-y-1">
                  <p>Mon – Fri: 7:00 AM – 10:00 PM</p>
                  <p>Saturday: 8:00 AM – 5:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container-main py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} {company.name}. All rights reserved. · {company.location.poBox}
          </p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="text-white/30 hover:text-white/60 text-xs transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-white/30 hover:text-white/60 text-xs transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
