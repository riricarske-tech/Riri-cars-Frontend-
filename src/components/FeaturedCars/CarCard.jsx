import {
  MdFavorite,
  MdFavoriteBorder,
  MdBuild,
  MdLocalGasStation,
  MdSettings,
  MdVerified,
} from "react-icons/md";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1];

const formatPrice = (price) => `KSh ${price.toLocaleString("en-KE")}`;

export default function CarCard({ car }) {
  const [liked, setLiked] = useState(false);
  const shouldReduce = useReducedMotion();

  return (
    <motion.article
      className="card-base group rounded overflow-hidden flex flex-col"
      whileHover={shouldReduce ? {} : { y: -6 }}
      whileTap={shouldReduce ? {} : { y: -2, scale: 0.99 }}
      transition={{ duration: 0.25, ease }}
    >
      {/* Image */}
      <Link
        to={`/cars/${car.id}`}
        className="relative overflow-hidden aspect-[4/3] bg-brand-low flex-shrink-0 block"
      >
        <img
          src={car.image}
          alt={`${car.year} ${car.make} ${car.model} ${car.trim || ""} in ${car.exteriorColor} — used ${car.bodyType} for sale in Nairobi`.trim()}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        {/* Condition badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {car.status === "New" ? (
            <span className="badge-new">{car.status}</span>
          ) : (
            <span className="badge-used">{car.status}</span>
          )}
          {car.condition && (
            <span className="bg-dark-nav/90 text-white/80 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <MdVerified size={10} className="text-accent" />
              {car.condition}
            </span>
          )}
        </div>
        {/* Wishlist */}
        <motion.button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow transition-all"
          aria-label={`${liked ? "Remove" : "Add"} ${car.year} ${car.make} ${car.model} ${liked ? "from" : "to"} wishlist`}
          aria-pressed={liked}
          whileTap={shouldReduce ? {} : { scale: 0.85 }}
          transition={{ duration: 0.12 }}
        >
          {liked ? (
            <motion.span
              key="liked"
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{
                duration: shouldReduce ? 0 : 0.2,
                ease: [0.34, 1.2, 0.64, 1],
              }}
            >
              <MdFavorite className="text-primary text-base" />
            </motion.span>
          ) : (
            <MdFavoriteBorder className="text-muted text-base" />
          )}
        </motion.button>
        {/* Price on hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-3 px-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white font-bold text-lg">
            {formatPrice(car.price)}
          </p>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-bold text-dark text-base leading-tight mb-0.5">
          <Link
            to={`/cars/${car.id}`}
            className="hover:text-primary transition-colors"
          >
            {car.year} {car.make} {car.model}
          </Link>
        </h3>
        <p className="text-muted text-xs mb-1 font-medium">{car.trim}</p>
        <p className="text-muted-light text-xs mb-3">{car.exteriorColor}</p>

        {/* Specs grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center gap-1 bg-brand-low rounded p-2">
            <MdBuild className="text-primary text-base" />
            <span className="text-xs text-muted text-center leading-tight font-medium">
              {car.engine || "N/A"}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 bg-brand-low rounded p-2">
            <MdLocalGasStation className="text-primary text-base" />
            <span className="text-xs text-muted text-center leading-tight font-medium">
              {car.fuel}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 bg-brand-low rounded p-2">
            <MdSettings className="text-primary text-base" />
            <span className="text-xs text-muted text-center leading-tight font-medium">
              {car.transmission.split(" ")[0]}
            </span>
          </div>
        </div>

        {/* Engine + Drive */}
        <p className="text-muted-light text-xs mb-3">
          {car.engine} · {car.drive}
        </p>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-brand-border">
          <div>
            <p className="text-xs text-muted uppercase tracking-wider font-semibold mb-0.5">
              Price
            </p>
            <p className="price-tag">{formatPrice(car.price)}</p>
          </div>
          <Link
            to={`/cars/${car.id}`}
            className="btn-primary text-xs py-2 px-4"
            aria-label={`View details for ${car.year} ${car.make} ${car.model}`}
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
