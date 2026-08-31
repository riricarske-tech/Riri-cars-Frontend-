import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { MdDirectionsCar, MdPeople, MdThumbUp, MdImportExport } from 'react-icons/md'

const ease = [0.22, 1, 0.36, 1]

const stats = [
  {
    icon: MdDirectionsCar,
    value: '8+',
    label: 'Popular Brands',
    desc: 'Toyota, Honda, Nissan & more',
  },
  {
    icon: MdPeople,
    value: '54K+',
    label: 'Facebook Followers',
    desc: "Kenya's most-followed dealer",
  },
  {
    icon: MdThumbUp,
    value: '90%',
    label: 'Recommendation Rate',
    desc: 'Verified Facebook reviews',
  },
  {
    icon: MdImportExport,
    value: '10+',
    label: 'Years in Business',
    desc: 'Serving Kenya since 2010',
  },
]

function AnimatedValue({ value, animate, delay = 0 }) {
  const shouldReduce = useReducedMotion()
  const match = value.match(/^(\d+)(.*)$/)
  const target = match ? parseInt(match[1], 10) : 0
  const suffix = match ? match[2] : value
  const [count, setCount] = useState(shouldReduce ? target : 0)

  useEffect(() => {
    if (!animate || !target || shouldReduce) {
      if (animate) setCount(target)
      return
    }
    let raf
    let timeout
    const duration = 1200

    const tick = (start) => (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(target * eased))
      if (progress < 1) raf = requestAnimationFrame(tick(start))
    }

    timeout = setTimeout(() => {
      raf = requestAnimationFrame((now) => tick(now)(now))
    }, delay)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(raf)
    }
  }, [animate, target, delay, shouldReduce])

  return (
    <>{count}{suffix}</>
  )
}

export default function Stats() {
  const sectionRef = useRef(null)
  const shouldReduce = useReducedMotion()
  const inView = useInView(sectionRef, { once: true, amount: 0.3 })

  return (
    <section ref={sectionRef} className="bg-dark-nav py-14">
      <div className="container-main">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ icon: Icon, value, label, desc }, i) => (
            <motion.div
              key={label}
              initial={shouldReduce ? false : { opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: shouldReduce ? 0 : 0.55,
                delay: shouldReduce ? 0 : i * 0.1,
                ease,
              }}
              className="flex flex-col items-center text-center group"
            >
              <motion.div
                className="w-14 h-14 bg-primary/10 border border-primary/20 rounded flex items-center justify-center mb-4"
                whileHover={shouldReduce ? {} : { backgroundColor: 'rgb(204, 0, 0)', borderColor: 'rgb(204, 0, 0)' }}
                transition={{ duration: 0.25 }}
              >
                <Icon className="text-primary group-hover:text-white text-2xl transition-colors" />
              </motion.div>
              <p className="text-white font-black text-3xl leading-none mb-1 tabular-nums">
                <AnimatedValue value={value} animate={inView} delay={i * 120} />
              </p>
              <p className="text-accent font-semibold text-sm mb-1">{label}</p>
              <p className="text-white/40 text-xs">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
