import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Home from './pages/Home'
import Footer from './components/Footer/Footer'
import FloatingSocials from './components/FloatingSocials/FloatingSocials'

// Route-level code splitting: Home stays in the main bundle (fastest LCP for
// the most-visited page); secondary routes load on demand.
const Inventory = lazy(() => import('./pages/Inventory'))
const CarDetails = lazy(() => import('./pages/CarDetails'))
const Contact = lazy(() => import('./pages/Contact'))
const ServicesPage = lazy(() => import('./pages/Services'))
const AboutPage = lazy(() => import('./pages/About'))

export default function App() {
  return (
    <div className="min-h-screen font-outfit bg-brand-bg">
      <Header />
      <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Inventory />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
      <Footer />
      <FloatingSocials />
    </div>
  )
}
