import { Link } from "react-router-dom";
import {
  MdCalendarToday,
  MdBuild,
  MdLocalGasStation,
  MdSettings,
  MdArrowForward,
} from "react-icons/md";

const formatPrice = (price) => `KSh ${price.toLocaleString("en-KE")}`;

export default function VehicleCard({ car, view = "grid" }) {
  if (view === "list") {
    return (
      <Link
        to={`/cars/${car.id}`}
        className="group flex flex-col sm:flex-row bg-white border border-brand-border hover:shadow-card-hover transition-all duration-300 overflow-hidden"
      >
        <div className="relative w-full sm:w-56 h-44 sm:h-auto shrink-0 overflow-hidden bg-brand-low">
          <img
            src={car.image}
            alt={`${car.year} ${car.make} ${car.model} ${car.trim || ""} for sale at Riri Cars Nairobi`.trim()}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
          {car.status === "New" ? (
            <span className="badge-new absolute top-3 left-3">
              {car.status}
            </span>
          ) : (
            <span className="badge-used absolute top-3 left-3">
              {car.status}
            </span>
          )}
        </div>
        <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-dark text-lg leading-tight group-hover:text-primary transition-colors">
              {car.year} {car.make} {car.model}
            </h3>
            <p className="text-muted text-sm mb-2">{car.trim}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
              <span className="flex items-center gap-1">
                <MdBuild className="text-primary" /> {car.engine || "N/A"}
              </span>
              <span className="flex items-center gap-1">
                <MdLocalGasStation className="text-primary" /> {car.fuel}
              </span>
              <span className="flex items-center gap-1">
                <MdSettings className="text-primary" />{" "}
                {car.transmission.split(" ")[0]}
              </span>
            </div>
          </div>
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
            <p className="price-tag text-xl">{formatPrice(car.price)}</p>
            <span className="flex items-center gap-1 text-primary text-sm font-semibold">
              View Details <MdArrowForward />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/cars/${car.id}`}
      className="group bg-white border border-brand-border hover:shadow-card-hover transition-all duration-300 relative flex flex-col"
    >
      {car.status === "New" ? (
        <span className="badge-new absolute top-4 left-4 z-10">
          {car.status}
        </span>
      ) : (
        <span className="badge-used absolute top-4 left-4 z-10">
          {car.status}
        </span>
      )}
      <div className="h-48 overflow-hidden bg-brand-low">
        <img
          src={car.image}
          alt={`${car.year} ${car.make} ${car.model} ${car.trim || ""} for sale at Riri Cars Nairobi`.trim()}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="p-5 text-center">
        <h3 className="font-bold text-primary leading-tight mb-1">
          {car.year} {car.make} {car.model}
        </h3>
        <div className="w-12 h-0.5 bg-brand-border mx-auto mb-2" />
        <p className="font-bold text-dark text-lg">{formatPrice(car.price)}</p>
      </div>
      <div className="grid grid-cols-2 border-t border-brand-border bg-brand-low text-muted text-xs font-medium mt-auto">
        <div className="flex items-center justify-center gap-1.5 py-3 border-r border-brand-border">
          <MdCalendarToday size={14} className="text-primary" /> {car.year}
        </div>
        <div className="flex items-center justify-center gap-1.5 py-3">
          <MdBuild size={14} className="text-primary" /> {car.engine || "N/A"}
        </div>
      </div>
    </Link>
  );
}
