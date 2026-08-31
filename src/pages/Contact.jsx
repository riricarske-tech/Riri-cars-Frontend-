import { useState } from 'react'
import {
  MdLocationOn,
  MdEmail,
  MdCall,
  MdSchedule,
  MdSupportAgent,
  MdInfoOutline,
  MdDirectionsCar,
  MdSend,
} from 'react-icons/md'
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { SiTiktok } from 'react-icons/si'
import { company } from '../data/company'
import SEO from '../components/SEO'
import { breadcrumbSchema, absoluteUrl } from '../lib/seo'

const infoCards = [
  {
    icon: MdSchedule,
    title: 'Opening Hours',
    text: company.hoursShort,
  },
  {
    icon: MdSupportAgent,
    title: 'Our Support Center',
    text: 'Reach us on call or WhatsApp for quick answers on stock, financing, and trade-ins — real people, no call centers.',
  },
  {
    icon: MdInfoOutline,
    title: 'Some Information',
    text: 'Asset financing, fair trade-in valuations, and direct Japan import service are available on every vehicle we sell.',
  },
]

const socialLinks = [
  { Icon: FaFacebookF, href: company.social.facebook, label: 'Facebook' },
  { Icon: FaInstagram, href: company.social.instagram, label: 'Instagram' },
  { Icon: FaWhatsapp, href: company.social.whatsapp, label: 'WhatsApp' },
  { Icon: SiTiktok, href: company.social.tiktok, label: 'TikTok' },
]

const EMPTY_FORM = { name: '', email: '', phone: '', subject: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM)

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(form.subject || `Website enquiry from ${form.name}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`
    )
    window.location.href = `mailto:${company.contact.email}?subject=${subject}&body=${body}`
  }

  const mapSrc = `https://maps.google.com/maps?q=${company.location.lat},${company.location.lng}&z=15&output=embed`

  return (
    <main className="pt-24 md:pt-28 bg-brand-bg">
      <SEO
        title="Contact Riri Cars — Car Dealership on Kiambu Road, Nairobi | +254 729 003 333"
        description="Visit Riri Cars at Kiambu Road, Fourways Junction, Nairobi. Call or WhatsApp +254 729 003 333, email info@riricars.co.ke. Open Mon–Fri 7 AM–10 PM, Sat 8 AM–5 PM."
        path="/contact"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact Riri Cars',
            url: absoluteUrl('/contact'),
            mainEntity: { '@id': `${absoluteUrl('/')}#dealer` },
          },
          breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact' }]),
        ]}
      />
      {/* Heading */}
      <section className="container-main py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase italic tracking-tight text-dark leading-none">
              Have Questions?
              <br />
              Get In Touch!
            </h1>
          </div>
          <div className="lg:col-span-4 pb-1">
            <p className="text-muted border-l-4 border-primary pl-5">
              We'd love to hear from you — call, message, or drop by our Kiambu Road showroom. Our team responds fast.
            </p>
          </div>
        </div>
      </section>

      {/* Form + Contact details */}
      <section className="container-main pb-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="h-0.5 w-10 bg-primary" />
                <span className="text-primary font-bold text-xs uppercase tracking-widest">Get in touch</span>
              </div>
              <h2 className="text-2xl font-bold uppercase text-dark mb-3">Send a Message</h2>
              <p className="text-muted max-w-2xl">
                Tell us what you're looking for — a specific model, financing options, or a trade-in valuation — and
                we'll get back to you promptly.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  required
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Your Name*"
                  aria-label="Your name"
                  value={form.name}
                  onChange={setField('name')}
                  className="input-field"
                />
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Email Address*"
                  aria-label="Email address"
                  value={form.email}
                  onChange={setField('email')}
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  required
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder="Phone Number*"
                  aria-label="Phone number"
                  value={form.phone}
                  onChange={setField('phone')}
                  className="input-field"
                />
                <input
                  required
                  type="text"
                  name="subject"
                  placeholder="Subject*"
                  aria-label="Subject"
                  value={form.subject}
                  onChange={setField('subject')}
                  className="input-field"
                />
              </div>
              <textarea
                rows={6}
                name="message"
                placeholder="Write a Message"
                aria-label="Your message"
                value={form.message}
                onChange={setField('message')}
                className="input-field resize-none"
              />
              <div className="flex flex-wrap items-center gap-4">
                <button type="submit" className="btn-primary">
                  Send Message <MdSend size={16} />
                </button>
                <a
                  href={company.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-primary transition-colors"
                >
                  <FaWhatsapp className="text-green-600" size={18} /> or message us on WhatsApp
                </a>
              </div>
            </form>
          </div>

          {/* Contact details */}
          <div className="lg:col-span-1">
            <div className="bg-brand-low h-full p-8 relative overflow-hidden border-t-4 border-primary shadow-card">
              <MdDirectionsCar
                size={200}
                className="absolute -right-8 -bottom-8 text-dark opacity-5 pointer-events-none"
              />
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-dark mb-6 border-b border-brand-border pb-4">
                  Contact Details
                </h3>
                <div className="space-y-6">
                  <div className="flex gap-3">
                    <MdLocationOn className="text-primary text-xl flex-shrink-0 mt-0.5" />
                    <address className="text-muted leading-relaxed not-italic">
                      {company.location.street}
                      <br />
                      {company.location.landmark}
                      <br />
                      {company.location.area}
                    </address>
                  </div>
                  <div className="flex gap-3">
                    <MdEmail className="text-primary text-xl flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-primary text-xs font-bold uppercase tracking-widest mb-1">
                        Send Email
                      </span>
                      <a href={`mailto:${company.contact.email}`} className="text-dark font-semibold hover:text-primary transition-colors">
                        {company.contact.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MdCall className="text-primary text-xl flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-primary text-xs font-bold uppercase tracking-widest mb-1">
                        Call Anytime
                      </span>
                      <a href={`tel:${company.contact.phone1Bare}`} className="text-dark font-semibold hover:text-primary transition-colors">
                        {company.contact.phone1}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-10 flex gap-3">
                  {socialLinks.map(({ Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-10 h-10 bg-primary hover:bg-primary-dark flex items-center justify-center rounded transition-all hover:scale-110"
                    >
                      <Icon className="text-white" size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info cards */}
      <section className="bg-white py-14 md:py-20">
        <div className="container-main grid grid-cols-1 md:grid-cols-3 gap-6">
          {infoCards.map(({ icon: Icon, title, text }) => (
            <div key={title} className="text-center group p-6 hover:bg-brand-low transition-colors duration-300 rounded">
              <div className="w-20 h-20 border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <Icon className="text-primary" size={36} />
              </div>
              <h4 className="text-lg font-bold text-dark mb-3">{title}</h4>
              <p className="text-muted text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Map */}
      <section className="w-full h-[420px] md:h-[500px] relative">
        <iframe
          title="Riri Cars location"
          src={mapSrc}
          className="w-full h-full border-0 grayscale-[0.3] hover:grayscale-0 transition-all duration-700"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 pointer-events-none">
          <div className="bg-primary p-3 rounded-full shadow-lg inline-block animate-bounce">
            <MdLocationOn className="text-white" size={28} />
          </div>
          <div className="mt-3 bg-white/95 px-4 py-2 rounded border border-primary backdrop-blur-sm">
            <p className="text-dark text-xs font-bold uppercase tracking-widest">Kiambu Road, Fourways Junction</p>
          </div>
        </div>
      </section>
    </main>
  )
}
