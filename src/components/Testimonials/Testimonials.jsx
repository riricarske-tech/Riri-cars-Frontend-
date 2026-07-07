import { motion, useReducedMotion } from 'motion/react'
import { MdFormatQuote, MdStar, MdStarBorder } from 'react-icons/md'
import { testimonials, trustStats } from '../../data/testimonials'

const ease = [0.22, 1, 0.36, 1]

// Initials avatar — replaces stock profile photos so no real-person imagery
// is implied for sample testimonials, and no third-party image requests are made.
const AVATAR_BGS = ['bg-primary text-white', 'bg-accent text-dark-nav', 'bg-white/15 text-white']

const initials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

const Avatar = ({ name, index }) => (
  <span
    aria-hidden="true"
    className={`w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center font-bold text-sm flex-shrink-0 ${
      AVATAR_BGS[index % AVATAR_BGS.length]
    }`}
  >
    {initials(name)}
  </span>
)

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }, (_, i) =>
      i < rating ? (
        <MdStar key={i} className="star-filled text-lg" />
      ) : (
        <MdStarBorder key={i} className="star-empty text-lg" />
      )
    )}
  </div>
)

export default function Testimonials() {
  const shouldReduce = useReducedMotion()

  return (
    <section className="section-gap bg-dark-nav relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container-main relative z-10">
        {/* Header */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-5% 0px' }}
          transition={{ duration: shouldReduce ? 0 : 0.5, ease }}
          className="text-center mb-12"
        >
          <span className="text-accent font-bold text-xs uppercase tracking-widest">
            Client Reviews
          </span>
          <h2 className="text-white font-bold text-3xl mt-1">
            What Our Clients Say
          </h2>
          <div className="w-12 h-1 bg-primary mt-3 mb-1 mx-auto" />
          <p className="text-white/60 text-sm mt-3 max-w-lg mx-auto">
            Riri Cars holds a <strong className="text-accent">90% recommendation rate</strong> on
            Facebook based on 31 verified reviews.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={shouldReduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5% 0px' }}
              transition={{
                duration: shouldReduce ? 0 : 0.5,
                delay: shouldReduce ? 0 : i * 0.1,
                ease,
              }}
              className="bg-white/5 border border-white/10 rounded p-6 hover:bg-white/10 hover:border-primary/30 transition-colors duration-300 group"
            >
              <MdFormatQuote className="text-primary text-4xl mb-4 opacity-80" />
              <StarRating rating={t.rating} />
              <p className="text-white/80 text-sm leading-relaxed mt-4 mb-6">
                "{t.text}"
              </p>
              <div className="w-full h-px bg-white/10 mb-4" />
              <div className="flex items-center gap-3">
                <Avatar name={t.name} index={i} />
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/50 text-xs">{t.role}</p>
                </div>
              </div>
              {!t.verified && (
                <p className="text-white/20 text-xs mt-3 italic">
                  * Sample testimonial representative of customer experience
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Verified Trust Stats */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-5% 0px' }}
          transition={{ duration: shouldReduce ? 0 : 0.5, delay: shouldReduce ? 0 : 0.3, ease }}
          className="flex flex-wrap justify-center gap-8 mt-12 pt-10 border-t border-white/10"
        >
          {trustStats.map(({ value, label, source }) => (
            <div key={label} className="text-center">
              <p className="text-accent font-black text-2xl">{value}</p>
              <p className="text-white/70 text-sm mt-1 font-semibold">{label}</p>
              <p className="text-white/30 text-xs mt-0.5 italic">{source}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
