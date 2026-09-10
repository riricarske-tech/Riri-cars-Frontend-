import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header/Header'
import Home from './pages/Home'
import Footer from './components/Footer/Footer'
import FloatingSocials from './components/FloatingSocials/FloatingSocials'
import ProtectedAdminRoute from './auth/ProtectedAdminRoute'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminVehicleForm from './pages/AdminVehicleForm'

// Route-level code splitting: Home stays in the main bundle (fastest LCP for
// the most-visited page); secondary routes load on demand.
const Inventory = lazy(() => import('./pages/Inventory'))
const CarDetails = lazy(() => import('./pages/CarDetails'))
const Contact = lazy(() => import('./pages/Contact'))
const ServicesPage = lazy(() => import('./pages/Services'))
const AboutPage = lazy(() => import('./pages/About'))

export default function App() {
  const { pathname } = useLocation()
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-brand-bg" aria-hidden="true" />}>
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/vehicles/new"
            element={
              <ProtectedAdminRoute>
                <AdminVehicleForm />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/vehicles/:id/edit"
            element={
              <ProtectedAdminRoute>
                <AdminVehicleForm />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </Suspense>
    )
  }

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
