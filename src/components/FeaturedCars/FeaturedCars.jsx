import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { MdArrowForward } from 'react-icons/md'
import useVehicles from '../../hooks/useVehicles'
import SearchBar from '../SearchBar/SearchBar'
import CarCard from './CarCard'
import CarCardSkeleton from './CarCardSkeleton'

const ease = [0.22, 1, 0.36, 1]

const tabs = [
  { key: 'all', label: 'All Vehicles' },
  { key: 'hatch', label: 'Hatchbacks', bodyType: 'Hatchback' },
  { key: 'sedan', label: 'Sedans', bodyType: 'Sedan' },
  { key: 'suv', label: 'SUVs', bodyType: 'SUV' },
  { key: 'hybrid', label: 'Hybrid', fuel: 'Hybrid' },
]

export default function FeaturedCars() {
  const [activeTab, setActiveTab] = useState('all')
  const shouldReduce = useReducedMotion()
  const { vehicles, loading, error } = useVehicles()

  const filtered = vehicles.filter((c) => {
    if (activeTab === 'all') return true
    const tab = tabs.find((t) => t.key === activeTab)
    if (!tab) return true
    if (tab.bodyType) return c.bodyType === tab.bodyType
    if (tab.fuel) return c.fuel.toLowerCase().includes('hybrid')
    return true
  })

  return (
    <section id="featured" className="section-gap pt-28 md:pt-36 bg-brand-bg">
      <div className="container-main">
        {/* Search bar */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduce ? 0 : 0.5, ease }}
          className="mb-10"
        >
          <SearchBar />
        </motion.div>

        {/* Section header */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-5% 0px' }}
          transition={{ duration: shouldReduce ? 0 : 0.5, ease }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
        >
          <div>
            <span className="text-primary font-bold text-xs uppercase tracking-widest">
              Current Stock
            </span>
            <h2 className="section-title mt-1">Available Vehicles</h2>
            <div className="divider-red" />
            <p className="section-subtitle mt-3">
              Handpicked quality vehicles from trusted markets globally to bring you the best value for your money.
            </p>
          </div>
          <Link
            to="/cars"
            className="hidden sm:flex items-center gap-2 text-primary hover:text-primary-dark font-semibold text-sm transition-colors flex-shrink-0"
          >
            View Full Inventory <MdArrowForward />
          </Link>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-5% 0px' }}
          transition={{ duration: shouldReduce ? 0 : 0.4, delay: shouldReduce ? 0 : 0.1, ease }}
          className="w-full overflow-x-auto scrollbar-hide mb-8"
        >
          <div className="flex gap-1 bg-white border border-brand-border rounded p-1 w-max min-w-full">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`relative flex-1 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded whitespace-nowrap transition-colors duration-150 ${
                  activeTab === key
                    ? 'text-primary'
                    : 'text-muted hover:text-dark'
                }`}
              >
                {activeTab === key && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute inset-0 bg-primary-subtle rounded"
                    transition={{ duration: shouldReduce ? 0 : 0.22, ease }}
                    style={{ zIndex: -1 }}
                  />
                )}
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Cars Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <CarCardSkeleton key={i} />
              ))}
            </motion.div>
          ) : error ? (
            <motion.div key="error" className="text-center py-16 text-muted">
              <p className="text-lg font-semibold mb-2">Couldn't load vehicles right now.</p>
              <p className="text-sm">Please try again shortly, or contact us directly.</p>
            </motion.div>
          ) : filtered.length > 0 ? (
            <motion.div
              key={activeTab}
              initial={shouldReduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduce ? 0 : 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {filtered.map((car, i) => (
                <motion.div
                  key={car.id}
                  initial={shouldReduce ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: shouldReduce ? 0 : 0.4,
                    delay: shouldReduce ? 0 : i * 0.06,
                    ease,
                  }}
                >
                  <CarCard car={car} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={shouldReduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduce ? 0 : 0.2 }}
              className="text-center py-16 text-muted"
            >
              <p className="text-lg font-semibold mb-2">No vehicles in this category right now.</p>
              <p className="text-sm">Contact us — we can source any vehicle directly from overseas.</p>
              <Link to="/contact" className="btn-primary mt-4 inline-flex">
                Contact Us <MdArrowForward />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View All CTA */}
        <div className="flex justify-center mt-12">
          <Link to="/cars" className="btn-outline-primary">
            View Full Inventory
            <MdArrowForward />
          </Link>
        </div>
      </div>
    </section>
  )
}
