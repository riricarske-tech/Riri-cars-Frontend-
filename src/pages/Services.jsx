import { Link } from 'react-router-dom'
import {
  MdChevronRight,
  MdDirectionsCar,
  MdAccountBalance,
  MdVerifiedUser,
  MdSwapHoriz,
  MdFlightTakeoff,
  MdSupportAgent,
  MdCheckCircle,
  MdFormatQuote,
} from 'react-icons/md'
import { services } from '../data/services'
import Stats from '../components/Stats/Stats'
import CTA from '../components/CTA/CTA'
import SEO from '../components/SEO'
import { breadcrumbSchema, absoluteUrl, dealerRef } from '../lib/seo'

const servicesListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Riri Cars Ltd — Automotive Services in Nairobi',
  itemListElement: services.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Service',
      name: s.title,
      description: s.description,
      url: absoluteUrl('/services'),
      provider: dealerRef,
      areaServed: { '@type': 'Country', name: 'Kenya' },
    },
  })),
}

const iconMap = {
  MdDirectionsCar,
  MdAccountBalance,
  MdVerifiedUser,
  MdSwapHoriz,
  MdFlightTakeoff,
  MdSupportAgent,
}

export default function Services() {
  return (
    <main className="pt-20 md:pt-24 bg-brand-bg">
      <SEO
        title="Car Financing, Trade-In & Japan Import Services in Nairobi | Riri Cars Ltd"
        description="Riri Cars offers asset financing through Dream Credit Limited, same-day trade-in valuations, direct car imports from Japan, insurance assistance, and after-sales support — all from our Kiambu Road showroom in Nairobi, Kenya."
        path="/services"
        jsonLd={[
          servicesListSchema,
          breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Services' }]),
        ]}
      />
      {/* Banner */}
      <section
        className="relative h-[260px] md:h-[300px] flex items-end overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(11,26,49,0.55) 60%, rgba(0,0,0,0.35) 100%),
            url('https://images.unsplash.com/photo-1669691101370-9ee9ee0782dc?w=1600&q=85&auto=format&fit=crop')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-red-shine" />
        <div className="container-main pb-8 md:pb-10 relative z-10">
          <h1 className="text-white font-black text-4xl md:text-5xl tracking-tight mb-2">Our Services</h1>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-white/60 text-xs uppercase tracking-wider">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <MdChevronRight size={14} aria-hidden="true" />
            <span className="text-white" aria-current="page">Services</span>
          </nav>
        </div>
      </section>

      {/* Intro */}
      <section className="container-main py-12 md:py-16 text-center">
        <span className="text-primary font-bold text-xs uppercase tracking-widest">What We Offer</span>
        <h2 className="section-title mt-1 mx-auto">Your Complete Automotive Partner</h2>
        <div className="divider-red mx-auto" />
        <p className="text-muted max-w-2xl mx-auto mt-3">
          From sourcing and importing quality Japanese vehicles to financing, trade-ins, insurance, and after-sales
          care — Riri Cars handles every step of the journey from Kiambu Road, Nairobi.
        </p>
      </section>

      {/* Detailed services */}
      <section className="container-main pb-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {services.map((service) => {
            const Icon = iconMap[service.icon]
            return (
              <div
                key={service.id}
                className="bg-white border border-brand-border rounded p-7 hover:shadow-card-hover hover:border-primary/40 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-primary-subtle border border-primary/20 rounded flex items-center justify-center flex-shrink-0">
                    {Icon && <Icon className="text-primary text-2xl" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-dark text-xl mb-1">{service.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{service.description}</p>
                  </div>
                </div>

                <div className="border-t border-brand-border pt-4 mt-4">
                  <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3">How It Works</p>
                  <ul className="space-y-2.5">
                    {service.steps.map((step) => (
                      <li key={step} className="flex items-start gap-2.5 text-sm text-dark">
                        <MdCheckCircle className="text-primary flex-shrink-0 mt-0.5" size={16} />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                {service.partner && (
                  <div className="mt-5 bg-brand-low border-l-4 border-primary rounded p-4 flex gap-3">
                    <MdFormatQuote className="text-primary flex-shrink-0" size={22} />
                    <div>
                      <p className="text-dark text-sm italic leading-relaxed">"{service.quote}"</p>
                      <p className="text-muted text-xs mt-1 font-semibold uppercase tracking-wide">
                        Financing partner: {service.partner}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <Stats />
      <CTA />
    </main>
  )
}
