import { motion, useReducedMotion } from 'motion/react'
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { SiTiktok } from 'react-icons/si'
import { company } from '../../data/company'

const ease = [0.22, 1, 0.36, 1]

const socials = [
  {
    label: 'TikTok',
    href: company.social.tiktok,
    Icon: SiTiktok,
    hoverBg: 'hover:bg-black hover:border-black',
    tooltip: 'TikTok',
  },
  {
    label: 'Facebook',
    href: company.social.facebook,
    Icon: FaFacebookF,
    hoverBg: 'hover:bg-[#1877F2] hover:border-[#1877F2]',
    tooltip: 'Facebook',
  },
    {
    label: 'Instagram',
    href: company.social.instagram,
    Icon: FaInstagram,
    hoverBg: 'hover:bg-[#E1306C] hover:border-[#E1306C]',
    tooltip: 'Instagram',
  },
  {
    label: 'WhatsApp',
    href: company.social.whatsapp,
    Icon: FaWhatsapp,
    hoverBg: 'hover:bg-[#25D366] hover:border-[#25D366]',
    tooltip: 'WhatsApp',
  },
]

export default function FloatingSocials() {
  const shouldReduce = useReducedMotion()

  return (
    <div className="
      fixed z-50 flex flex-col gap-2
      bottom-5 right-3
      md:bottom-auto md:top-1/2 md:right-4 md:-translate-y-1/2
    ">
      {socials.map(({ label, href, Icon, hoverBg, tooltip }, i) => (
        <motion.a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          initial={shouldReduce ? false : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: shouldReduce ? 0 : 0.4,
            delay: shouldReduce ? 0 : 0.9 + i * 0.1,
            ease,
          }}
          whileHover={shouldReduce ? {} : { scale: 1.12, x: -2 }}
          whileTap={shouldReduce ? {} : { scale: 0.92 }}
          className={`
            group relative flex items-center justify-center
            w-9 h-9 md:w-11 md:h-11 rounded-full
            bg-dark-nav/90 backdrop-blur-sm
            border border-white/15 ${hoverBg}
            text-white/70 hover:text-white
            shadow-lg hover:shadow-xl
            transition-colors duration-300
          `}
        >
          <Icon size={15} className="md:hidden" />
          <Icon size={17} className="hidden md:block" />

          {/* Tooltip — desktop only */}
          <span className="
            hidden md:block
            pointer-events-none absolute right-[calc(100%+10px)]
            bg-dark-nav text-white text-xs font-semibold
            px-2.5 py-1.5 rounded whitespace-nowrap
            opacity-0 translate-x-1
            group-hover:opacity-100 group-hover:translate-x-0
            transition-all duration-200
            after:content-[''] after:absolute after:left-full after:top-1/2 after:-translate-y-1/2
            after:border-4 after:border-transparent after:border-l-dark-nav
          ">
            {tooltip}
          </span>
        </motion.a>
      ))}
    </div>
  )
}
