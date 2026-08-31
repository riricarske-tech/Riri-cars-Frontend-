import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  MdCheckCircle,
  MdArrowForward,
  MdPhone,
  MdLocationOn,
} from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { whyChooseUs } from "../../data/services";
import { company } from "../../data/company";

const ease = [0.22, 1, 0.36, 1];

export default function About() {
  const shouldReduce = useReducedMotion();

  return (
    <section id="about" className="section-gap bg-brand-bg">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image column */}
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5% 0px" }}
            transition={{ duration: shouldReduce ? 0 : 0.6, ease }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded overflow-hidden shadow-card-hover">
              <img
                src="https://images.unsplash.com/photo-1668415759930-5a9dbe80c488?w=800&q=85&auto=format&fit=crop"
                alt="Riri Cars Showroom on Kiambu Road, Nairobi"
                className="w-full h-[260px] sm:h-[360px] lg:h-[420px] object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute top-0 left-0 w-1 h-full bg-red-shine" />
            </div>

            {/* Years badge */}
            <div className="absolute -bottom-6 -right-4 lg:-right-8 bg-primary rounded p-5 shadow-red-glow text-center hidden sm:block">
              <p className="text-white font-black text-4xl leading-none">10+</p>
              <p className="text-white/80 text-xs font-semibold mt-1 uppercase tracking-wider">
                Years
                <br />
                Serving Kenya
              </p>
            </div>

            {/* Location badge */}
            <div className="absolute -top-4 -left-4 lg:-left-8 bg-white rounded shadow-card-hover border border-brand-border p-3 hidden sm:flex items-center gap-2 max-w-[200px]">
              <MdLocationOn className="text-primary text-xl flex-shrink-0" />
              <div>
                <p className="font-bold text-dark text-xs leading-tight">
                  Kiambu Road
                </p>
                <p className="text-muted text-xs">Fourways Junction, Nairobi</p>
              </div>
            </div>
          </motion.div>

          {/* Text column */}
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5% 0px" }}
            transition={{
              duration: shouldReduce ? 0 : 0.6,
              delay: shouldReduce ? 0 : 0.12,
              ease,
            }}
            className="order-1 lg:order-2"
          >
            <span className="text-primary font-bold text-xs uppercase tracking-widest">
              About Riri Cars
            </span>
            <h2 className="section-title mt-1 text-3xl lg:text-4xl">
              Nairobi's Trusted
              <br />
              <span className="text-primary">Imported Car Dealer</span>
            </h2>
            <div className="divider-red mt-3 mb-5" />

            <p className="text-muted leading-relaxed mb-3">
              Riri Cars is a premier importer and dealer of quality used
              imported vehicles, conveniently located along{" "}
              <strong className="text-dark">
                Kiambu Road at Fourways Junction
              </strong>
              , Nairobi — easily accessible from Ridgeways, Runda, Ruaka, Garden
              Estate, and Gigiri.
            </p>
            <p className="text-muted leading-relaxed mb-7">
              We stock a carefully selected range of JDM (Domestic Market)
              vehicles including hatchbacks, sedans, station wagons, and
              SUVs from trusted brands. Every vehicle comes with full
              auction documentation, and we arrange asset financing on every car
              in our showroom.
            </p>

            {/* Why Choose Us List */}
            <ul className="space-y-3 mb-8">
              {whyChooseUs.map(({ id, text }) => (
                <li key={id} className="flex items-start gap-3">
                  <MdCheckCircle className="text-primary text-xl flex-shrink-0 mt-0.5" />
                  <span className="text-dark text-sm font-medium">{text}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link to="/cars" className="btn-primary">
                Browse Inventory <MdArrowForward />
              </Link>
              <a
                href={company.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm uppercase tracking-wide px-6 py-3 rounded transition-all duration-200"
              >
                <FaWhatsapp />
                WhatsApp Us
              </a>
              <a
                href={`tel:${company.contact.phone1Bare}`}
                className="btn-secondary flex items-center gap-2"
              >
                <MdPhone />
                {company.contact.phone1}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
