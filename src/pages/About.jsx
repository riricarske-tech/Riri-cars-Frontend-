import { Link } from 'react-router-dom'
import {
  MdChevronRight,
  MdSpeed,
  MdVerifiedUser,
  MdVisibility,
  MdAccountBalance,
  MdSupportAgent,
  MdArrowForward,
} from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'
import { company } from '../data/company'
import SEO from '../components/SEO'
import { breadcrumbSchema, absoluteUrl } from '../lib/seo'

const principles = [
  {
    icon: MdVerifiedUser,
    title: 'Quality',
    description: 'Every vehicle is sourced from trusted auctions and inspected before it reaches our showroom floor.',
  },
  {
    icon: MdVisibility,
    title: 'Transparency',
    description: 'Fair pricing, honest trade-in valuations, and no hidden costs — every deal is straightforward.',
  },
  {
    icon: MdAccountBalance,
    title: 'Affordability',
    description: 'Asset financing arranged on every vehicle, because a good car shouldn’t be out of reach.',
  },
  {
    icon: MdSupportAgent,
    title: 'Customer Care',
    description: 'Our relationship continues after the sale, with after-sales support and a 90% customer recommendation rate.',
  },
]

export default function About() {
  return (
    <main className="pt-20 md:pt-24 bg-brand-bg">
      <SEO
        title="About Riri Cars — Trusted New and Used Car Dealership in Nairobi Since 2010"
        description="Riri Cars has imported and sold quality new and used vehicles in Nairobi since 2010. Based on Kiambu Road at Fourways Junction, with 54K+ Facebook followers and a 90% customer recommendation rate."
        path="/about"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About Riri Cars',
            url: absoluteUrl('/about'),
            mainEntity: { '@id': `${absoluteUrl('/')}#dealer` },
          },
          breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About' }]),
        ]}
      />
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <MdSpeed className="absolute inset-0 m-auto text-brand-low pointer-events-none" size={900} />
        <div className="container-main py-14 md:py-20 relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-muted text-xs uppercase tracking-wider mb-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <MdChevronRight size={14} aria-hidden="true" />
            <span className="text-dark font-semibold" aria-current="page">About</span>
          </nav>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
            <div>
              <span className="inline-block bg-primary text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 mb-4 rounded-sm">
                Established {company.established}
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-dark leading-tight mb-5">
                Driving Excellence
                <br />
                Since <span className="text-primary">{company.established}</span>
              </h1>
              <p className="text-muted text-lg leading-relaxed max-w-lg">{company.description}</p>
            </div>
            <div className="relative">
              <div className="absolute -inset-3 bg-primary/5 rounded-xl" />
              <img
                src="https://images.unsplash.com/photo-1669691101370-9ee9ee0782dc?w=1200&q=85&auto=format&fit=crop"
                alt="Quality new and used vehicle at the Riri Cars showroom, Kiambu Road, Nairobi"
                className="relative z-10 w-full h-[380px] md:h-[460px] object-cover rounded-lg shadow-card-hover"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-14 md:py-20 bg-brand-bg">
        <div className="container-main grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1668415759930-5a9dbe80c488?w=800&q=85&auto=format&fit=crop"
              alt="Riri Cars showroom on Kiambu Road at Fourways Junction, Nairobi"
              className="w-full aspect-[4/5] object-cover rounded shadow-card"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute -bottom-6 -right-4 lg:-right-6 bg-primary rounded p-5 shadow-red-glow text-center hidden sm:block">
              <p className="text-white font-black text-4xl leading-none">10+</p>
              <p className="text-white/80 text-xs font-semibold mt-1 uppercase tracking-wider">
                Years
                <br />
                Serving Kenya
              </p>
            </div>
          </div>
          <div>
            <span className="text-primary font-bold text-xs uppercase tracking-widest">Our Heritage</span>
            <h2 className="section-title mt-1">From Kiambu Road to Kenya's Most-Followed Dealer</h2>
            <div className="divider-red mb-5" />
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                Riri Cars was established in {company.established} with a simple mission: make quality imported
                vehicles accessible and affordable to everyday Kenyans. What started as a dedicated Kiambu
                Road dealership has grown into one of Nairobi's most recognized names in new and used car sales.
              </p>
              <p>
                Every vehicle that reaches our Fourways Junction showroom is sourced directly from auctions
                and carefully inspected before it's offered for sale. We arrange asset financing on every car in
                stock — through partners like Dream Credit Limited — and back every sale with fair trade-in
                valuations and genuine after-sales support.
              </p>
              <p>
                Today, over {company.facebookFollowers} Kenyans follow Riri Cars on Facebook, and{' '}
                {company.recommendationRate} of our customers recommend us to others. That trust is the foundation
                everything else at Riri Cars is built on.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container-main">
          <div className="text-center mb-10">
            <h2 className="section-title mx-auto">Our Core Principles</h2>
            <p className="text-muted mt-2">The standards that guide every decision we make.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-brand-bg p-6 border border-brand-border rounded hover:border-primary hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary-subtle rounded-full flex items-center justify-center mb-4">
                  <Icon className="text-primary text-xl" />
                </div>
                <h3 className="font-bold text-dark text-lg mb-2">{title}</h3>
                <p className="text-muted text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20 bg-brand-low">
        <div className="container-main max-w-3xl mx-auto text-center space-y-5">
          <h2 className="text-3xl md:text-4xl font-black text-dark">Experience the Riri Cars Difference</h2>
          <p className="text-muted text-lg">
            Discover a new standard of automotive excellence. Our inventory is curated for Kenyans who demand more
            from their next car.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
            <Link to="/cars" className="btn-primary">
              View Our Inventory <MdArrowForward />
            </Link>
            <a
              href={company.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm uppercase tracking-wide px-6 py-3 rounded transition-all duration-200"
            >
              <FaWhatsapp />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
