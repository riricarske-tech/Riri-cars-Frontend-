import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { MdArrowForward, MdSell } from 'react-icons/md'
import useRecentlySold from '../../hooks/useRecentlySold'
import Skeleton from '../ui/Skeleton'

const ease = [0.22, 1, 0.36, 1]

const formatPrice = (price) => `KSh ${price.toLocaleString('en-KE')}`

export default function RecentlySold() {
  const shouldReduce = useReducedMotion()
  const { items: recentlySold, loading, error } = useRecentlySold(10)

  if (!loading && (error || recentlySold.length === 0)) return null

  return (
    <section id="recently-sold" className="section-gap bg-white">
      <div className="container-main">
        {/* Header */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-5% 0px' }}
          transition={{ duration: shouldReduce ? 0 : 0.5, ease }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
        >
          <div>
            <span className="text-primary font-bold text-xs uppercase tracking-widest">
              Moving Fast
            </span>
            <h2 className="section-title mt-1">Recently Sold</h2>
            <div className="divider-red" />
            <p className="section-subtitle mt-3">
              A snapshot of the variety and pace of vehicles that move through Riri Cars —
              new stock arrives just as quickly.
            </p>
          </div>
          <Link
            to="/cars"
            className="hidden sm:flex items-center gap-2 text-primary hover:text-primary-dark font-semibold text-sm transition-colors flex-shrink-0"
          >
            View Available Stock <MdArrowForward />
          </Link>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card-base rounded overflow-hidden flex flex-col">
                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                <div className="p-4 flex flex-col flex-1 gap-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-5 w-1/2 mt-auto pt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {recentlySold.map((car, i) => (
            <motion.article
              key={car.id}
              initial={shouldReduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5% 0px' }}
              transition={{
                duration: shouldReduce ? 0 : 0.4,
                delay: shouldReduce ? 0 : i * 0.07,
                ease,
              }}
              className="card-base rounded overflow-hidden flex flex-col"
            >
              <div className="relative overflow-hidden aspect-[4/3] bg-brand-low flex-shrink-0">
                <img
                  src={car.image}
                  alt={`${car.year} ${car.make} ${car.model} — recently sold by Riri Cars Nairobi`}
                  className="w-full h-full object-cover grayscale-[30%]"
                  loading="lazy"
                  decoding="async"
                />
                <span className="absolute top-3 left-3 bg-dark text-white text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow">
                  <MdSell size={12} className="text-primary" />
                  Sold
                </span>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-dark text-sm leading-tight mb-0.5">
                  {car.year} {car.make} {car.model}
                </h3>
                <p className="text-muted text-xs mb-1">{car.trim}</p>
                <p className="text-muted-light text-xs mb-3">{car.bodyType}</p>
                <p className="price-tag text-base mt-auto pt-3 border-t border-brand-border">
                  {formatPrice(car.price)}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
        )}

        <p className="text-muted-light text-xs text-center mt-6 italic">
          Representative of typical turnover — not tied to specific dated transactions.
        </p>

        {/* Mobile CTA */}
        <div className="sm:hidden flex justify-center mt-8">
          <Link to="/cars" className="btn-outline-primary">
            View Available Stock <MdArrowForward />
          </Link>
        </div>
      </div>
    </section>
  )
}
