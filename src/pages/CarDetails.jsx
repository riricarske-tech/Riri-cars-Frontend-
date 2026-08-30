import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MdChevronRight,
  MdChevronLeft,
  MdCall,
  MdEmail,
  MdCheckCircle,
  MdVerified,
  MdLocationOn,
  MdMap,
  MdDirectionsCar,
  MdInfoOutline,
  MdChecklist,
} from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import useVehicle from "../hooks/useVehicle";
import useVehicles from "../hooks/useVehicles";
import { company } from "../data/company";
import CarCard from "../components/FeaturedCars/CarCard";
import Skeleton from "../components/ui/Skeleton";
import SEO from "../components/SEO";
import { breadcrumbSchema, vehicleSchema } from "../lib/seo";

const formatPrice = (price) => `KSh ${price.toLocaleString("en-KE")}`;

const TABS = [
  { label: "Overview", icon: MdInfoOutline },
  { label: "Features & Options", icon: MdChecklist },
  { label: "Location", icon: MdLocationOn },
];

export default function CarDetails() {
  const { id } = useParams();
  const { vehicle: car, loading, error } = useVehicle(id);
  const { vehicles } = useVehicles();
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveTab(TABS[0].label);
    setActiveImage(0);
  }, [id]);

  if (loading) {
    return (
      <main className="pt-28 md:pt-32 pb-8 bg-brand-bg">
        <div className="container-main">
          <Skeleton className="h-4 w-64 my-5" />
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-7/12 lg:w-8/12 space-y-8">
              <div className="card-base rounded overflow-hidden">
                <Skeleton className="aspect-[16/10] w-full rounded-none" />
                <div className="grid grid-cols-5 gap-2 p-2 bg-brand-low">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-[4/3]" />
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3 py-6 border-y border-brand-border">
                <Skeleton className="h-11 w-32" />
                <Skeleton className="h-11 w-40" />
                <Skeleton className="h-11 w-36" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            <aside className="w-full md:w-5/12 lg:w-4/12 space-y-6">
              <div className="hidden md:block space-y-3">
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-9 w-1/2" />
              </div>
              <Skeleton className="h-12 w-full" />
              <div className="bg-white rounded p-6 border border-brand-border space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </aside>
          </div>
        </div>
      </main>
    );
  }

  if (!car || error) {
    return (
      <main className="container-main pt-28 md:pt-32 pb-24 text-center min-h-[60vh]">
        <SEO
          title="Vehicle Not Found | Riri Cars Ltd Nairobi"
          description="This vehicle may have been sold or removed from stock. Browse our current inventory of used Japanese import cars for sale in Nairobi."
          path={`/cars/${id}`}
          noindex
        />
        <h1 className="section-title mb-4">Vehicle Not Found</h1>
        <p className="text-muted mb-8">
          We couldn't find that vehicle — it may have been sold or removed from
          stock.
        </p>
        <Link to="/cars" className="btn-primary inline-flex">
          Browse Available Vehicles
        </Link>
      </main>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hi Riri Cars, I'm interested in the ${car.year} ${car.make} ${car.model} (${car.trim}) — Stock #${car.stockNumber}, listed at ${formatPrice(car.price)}.`,
  );
  const whatsappHref = `https://wa.me/${company.contact.whatsappBare.replace("+", "")}?text=${whatsappMessage}`;

  const related = vehicles.filter(
    (c) => c.id !== car.id && c.bodyType === car.bodyType,
  );
  const relatedFinal = (
    related.length > 0 ? related : vehicles.filter((c) => c.id !== car.id)
  ).slice(0, 4);

  const specs = [
    { label: "Year", value: car.year },
    { label: "Make", value: car.make },
    { label: "Model", value: car.model },
    { label: "Trim", value: car.trim },
    ...(car.mileage !== null &&
    car.mileage !== undefined &&
    car.mileage !== "" &&
    Number(car.mileage) > 0
      ? [
          {
            label: "Mileage",
            value: `${Number(car.mileage).toLocaleString()} km`,
          },
        ]
      : []),
    { label: "Transmission", value: car.transmission },
    { label: "Engine", value: car.engine },
    { label: "Drivetrain", value: car.drive },
    { label: "Body Type", value: car.bodyType },
    { label: "Exterior Color", value: car.exteriorColor },
    { label: "Interior Color", value: car.interiorColor },
    { label: "Stock Number", value: car.stockNumber },
  ];

  const carName = `${car.year} ${car.make} ${car.model}`;

  return (
    <main className="pt-28 md:pt-32 pb-8 bg-brand-bg">
      <SEO
        title={`${carName} ${car.trim ? `${car.trim} ` : ""}for Sale in Nairobi — ${formatPrice(car.price)} | Riri Cars`}
        description={`Buy this ${car.status.toLowerCase()} ${carName} (${car.trim}) at Riri Cars, Kiambu Road, Nairobi. ${car.mileage.toLocaleString()} km, ${car.fuel}, ${car.transmission}, ${car.drive}. ${formatPrice(car.price)} — asset financing and trade-in available.`}
        path={`/cars/${car.id}`}
        image={car.gallery?.[0] || car.image}
        imageAlt={`${carName} for sale at Riri Cars Ltd in Nairobi`}
        type="product"
        jsonLd={[
          vehicleSchema(car),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Inventory", path: "/cars" },
            { name: carName },
          ]),
        ]}
      />
      <div className="container-main">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 py-5 text-xs text-muted uppercase tracking-wider"
        >
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <MdChevronRight size={14} aria-hidden="true" />
          <Link to="/cars" className="hover:text-primary transition-colors">
            Inventory
          </Link>
          <MdChevronRight size={14} aria-hidden="true" />
          <span
            className="text-dark font-semibold normal-case"
            aria-current="page"
          >
            {carName}
          </span>
        </nav>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* ── Left column: gallery + narrative ─────────────────────── */}
          <div className="w-full md:w-7/12 lg:w-8/12 space-y-8">
            {/* Mobile title/price */}
            <div className="md:hidden">
              <div className="flex items-center gap-2 mb-2">
                {car.status === "New" ? (
                  <span className="badge-new">{car.status}</span>
                ) : (
                  <span className="badge-used">{car.status}</span>
                )}
                {car.condition && (
                  <span className="bg-dark-nav text-white/80 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <MdVerified size={11} className="text-accent" />{" "}
                    {car.condition}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-dark leading-tight">
                {car.year} {car.make} {car.model}
              </h1>
              <p className="text-muted text-sm mb-2">{car.trim}</p>
              <p className="price-tag text-3xl">{formatPrice(car.price)}</p>
            </div>

            {/* Gallery */}
            <div className="card-base rounded overflow-hidden">
              <div className="relative aspect-[16/10] bg-brand-low group">
                <img
                  src={car.gallery[activeImage]}
                  alt={`${car.year} ${car.make} ${car.model} ${car.trim || ""} in ${car.exteriorColor} for sale at Riri Cars Nairobi — photo ${activeImage + 1} of ${car.gallery.length}`}
                  className="w-full h-full object-cover"
                  fetchPriority="high"
                  decoding="async"
                />
                {car.gallery.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImage(
                          (i) =>
                            (i - 1 + car.gallery.length) % car.gallery.length,
                        )
                      }
                      aria-label="Previous image"
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark/40 hover:bg-dark/70 backdrop-blur-sm text-white flex items-center justify-center transition-colors"
                    >
                      <MdChevronLeft size={24} />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImage((i) => (i + 1) % car.gallery.length)
                      }
                      aria-label="Next image"
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark/40 hover:bg-dark/70 backdrop-blur-sm text-white flex items-center justify-center transition-colors"
                    >
                      <MdChevronRight size={24} />
                    </button>
                    <span className="absolute bottom-3 right-3 bg-dark/60 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
                      {activeImage + 1} / {car.gallery.length}
                    </span>
                  </>
                )}
              </div>
              {car.gallery.length > 1 && (
                <div className="grid grid-cols-5 gap-2 p-2 bg-brand-low">
                  {car.gallery.map((src, i) => (
                    <button
                      key={src + i}
                      onClick={() => setActiveImage(i)}
                      className={`aspect-[4/3] rounded overflow-hidden border-2 transition-colors ${
                        activeImage === i
                          ? "border-primary"
                          : "border-transparent hover:border-brand-border"
                      }`}
                    >
                      <img
                        src={src}
                        alt={`${car.year} ${car.make} ${car.model} — thumbnail view ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action toolbar */}
            <div className="flex flex-wrap gap-3 py-6 border-y border-brand-border">
              <a
                href={`tel:${company.contact.phone1Bare}`}
                className="flex items-center gap-2 px-5 py-3 border border-brand-border rounded hover:border-primary hover:text-primary transition-colors text-sm font-semibold"
              >
                <MdCall /> Call Now
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 border border-brand-border rounded hover:border-green-600 hover:text-green-600 transition-colors text-sm font-semibold"
              >
                <FaWhatsapp /> WhatsApp Enquiry
              </a>
              <a
                href={`mailto:${company.contact.email}?subject=${encodeURIComponent(
                  `Enquiry: ${car.year} ${car.make} ${car.model}`,
                )}`}
                className="flex items-center gap-2 px-5 py-3 border border-brand-border rounded hover:border-primary hover:text-primary transition-colors text-sm font-semibold"
              >
                <MdEmail /> Email Enquiry
              </a>
            </div>

            {/* Tabs */}
            <section>
              <div className="flex gap-8 border-b border-brand-border overflow-x-auto scrollbar-hide">
                {TABS.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => setActiveTab(label)}
                    className={`flex items-center gap-1.5 pb-4 whitespace-nowrap text-sm sm:text-base font-semibold transition-colors ${
                      activeTab === label
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted hover:text-dark"
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                ))}
              </div>

              <div className="pt-6">
                {activeTab === "Overview" && (
                  <div className="space-y-5">
                    <p className="text-dark leading-relaxed">
                      {car.description}
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                      {car.features.slice(0, 6).map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-sm text-muted"
                        >
                          <MdCheckCircle className="text-primary flex-shrink-0" />{" "}
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === "Features & Options" && (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                    {car.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-sm text-muted"
                      >
                        <MdCheckCircle className="text-primary flex-shrink-0" />{" "}
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === "Location" && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MdLocationOn className="text-primary text-xl flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-dark font-medium">
                          {company.location.street}
                        </p>
                        <p className="text-muted text-sm">
                          {company.location.landmark}
                        </p>
                        <p className="text-muted text-sm">
                          {company.location.area}
                        </p>
                      </div>
                    </div>
                    <p className="text-muted text-sm">
                      {company.location.directions}
                    </p>
                    <a
                      href={company.location.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline-primary inline-flex"
                    >
                      <MdMap /> Get Directions
                    </a>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* ── Right column: specs + contact ────────────────────────── */}
          <aside className="w-full md:w-5/12 lg:w-4/12 space-y-6 md:sticky md:top-28">
            <div className="hidden md:block">
              <div className="flex items-center gap-2 mb-3">
                {car.status === "New" ? (
                  <span className="badge-new">{car.status}</span>
                ) : (
                  <span className="badge-used">{car.status}</span>
                )}
                {car.condition && (
                  <span className="bg-dark-nav text-white/80 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <MdVerified size={11} className="text-accent" />{" "}
                    {car.condition}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-dark leading-tight">
                {car.year} {car.make} {car.model}
              </h1>
              <p className="text-muted text-sm mt-1 mb-3">{car.trim}</p>
              <p className="price-tag text-4xl">{formatPrice(car.price)}</p>
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full justify-center py-4"
            >
              Request More Info
            </a>

            {/* Spec bento */}
            <div className="bg-white rounded p-6 border border-brand-border">
              <h3 className="font-bold text-dark border-b border-brand-border pb-3 mb-3">
                Description
              </h3>
              <div className="space-y-3">
                {specs.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-muted uppercase tracking-wide text-xs">
                      {label}
                    </span>
                    <span className="text-dark font-semibold text-right">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlight card */}
            <div className="bg-red-shine text-white p-6 rounded flex items-center justify-between">
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest opacity-80 mb-1">
                  Fuel
                </p>
                <p className="font-black text-base leading-tight">{car.fuel}</p>
              </div>
              <div className="flex flex-col items-center">
                <MdDirectionsCar size={36} />
                <p className="text-[10px] uppercase tracking-widest mt-1 text-center leading-tight">
                  Asset Financing
                  <br />
                  Available
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest opacity-80 mb-1">
                  Drive
                </p>
                <p className="font-black text-base leading-tight">
                  {car.drive.split(" ")[0]}
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* ── Related vehicles ────────────────────────────────────────── */}
        <section className="section-gap">
          <div className="mb-8">
            <span className="text-primary font-bold text-xs uppercase tracking-widest">
              You Might Also Like
            </span>
            <h2 className="section-title mt-1">Related Vehicles</h2>
            <div className="divider-red" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedFinal.map((c) => (
              <CarCard key={c.id} car={c} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
