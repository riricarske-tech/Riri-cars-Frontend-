import BrandScroll from '../components/BrandScroll/BrandScroll'
import FeaturedCars from '../components/FeaturedCars/FeaturedCars'
import Stats from '../components/Stats/Stats'
import Services from '../components/Services/Services'
import About from '../components/About/About'
import Testimonials from '../components/Testimonials/Testimonials'
import RecentlySold from '../components/RecentlySold/RecentlySold'
import Newsletter from '../components/Newsletter/Newsletter'
import CTA from '../components/CTA/CTA'
import FAQ from '../components/FAQ/FAQ'
import SEO from '../components/SEO'
import { faqSchema, breadcrumbSchema } from '../lib/seo'
import { faqs } from '../data/faqs'

export default function Home() {
  return (
    <main>
      <SEO
        title="Riri Cars — Quality Used Import Cars for Sale in Nairobi, Kenya"
        description="Riri Cars is a trusted car dealership on Kiambu Road, Nairobi, selling quality used import vehicles — Toyota, Mazda, Subaru, Honda, Nissan & more. Asset financing, trade-ins, and direct imports. Est. 2010."
        path="/"
        jsonLd={[faqSchema(faqs), breadcrumbSchema([{ name: 'Home', path: '/' }])]}
      />
      <h1 className="sr-only">
        Riri Cars — Used Import Cars for Sale in Nairobi, Kenya: Toyota, Mazda,
        Subaru, Honda & Nissan with Asset Financing
      </h1>
      <FeaturedCars />
      <BrandScroll />
      <Stats />
      <Services />
      <About />
      <Testimonials />
      <RecentlySold />
      <FAQ />
      <Newsletter />
      <CTA />
    </main>
  )
}
