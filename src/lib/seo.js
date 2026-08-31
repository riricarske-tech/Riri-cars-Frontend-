/**
 * Riri Cars — SEO configuration and schema.org JSON-LD builders.
 * All canonical URLs, meta defaults, and structured-data objects are
 * generated from the single verified source of truth in data/company.js.
 */

import { company } from '../data/company'

// Canonical production origin. Override with VITE_SITE_URL when deploying
// to a staging host so canonicals keep pointing at the real domain.
export const SITE_URL = (import.meta.env.VITE_SITE_URL || company.contact.website).replace(/\/$/, '')

export const absoluteUrl = (path = '/') =>
  `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`

export const DEFAULT_OG_IMAGE = absoluteUrl('/og-image.jpg')

export const SITE_NAME = company.name

// "7:00 AM" / "10:00 PM" → "07:00" / "22:00" (schema.org expects 24h time)
const to24h = (time) => {
  const [, h, m, period] = time.match(/(\d+):(\d+)\s*(AM|PM)/i)
  let hour = Number(h) % 12
  if (period.toUpperCase() === 'PM') hour += 12
  return `${String(hour).padStart(2, '0')}:${m}`
}

const openingHoursSpecification = company.hours
  .filter((h) => !h.closed)
  .map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.day,
    opens: to24h(h.open),
    closes: to24h(h.close),
  }))

/** AutoDealer / LocalBusiness entity — referenced by every page. */
export const autoDealerSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  '@id': `${SITE_URL}/#dealer`,
  name: company.name,
  alternateName: company.shortName,
  slogan: company.tagline,
  description: company.description,
  url: SITE_URL,
  logo: absoluteUrl('/favicon.png'),
  image: DEFAULT_OG_IMAGE,
  telephone: company.contact.phone1Bare,
  email: company.contact.email,
  foundingDate: String(company.established),
  priceRange: 'KSh 800,000 – KSh 10,000,000+',
  currenciesAccepted: 'KES',
  paymentAccepted: 'Cash, Bank Transfer, Asset Financing, Trade-In',
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${company.location.street}, ${company.location.landmark}`,
    addressLocality: 'Nairobi',
    addressRegion: 'Nairobi County',
    postalCode: '00625',
    addressCountry: 'KE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: company.location.lat,
    longitude: company.location.lng,
  },
  hasMap: company.location.googleMapsUrl,
  openingHoursSpecification,
  areaServed: [
    { '@type': 'City', name: 'Nairobi' },
    { '@type': 'Country', name: 'Kenya' },
  ],
  sameAs: [company.social.facebook, company.social.instagram, company.social.tiktok],
}

/** Compact reference to the dealer entity for nesting inside offers. */
export const dealerRef = {
  '@type': 'AutoDealer',
  '@id': `${SITE_URL}/#dealer`,
  name: company.name,
  telephone: company.contact.phone1Bare,
  url: SITE_URL,
}

/** BreadcrumbList from [{ name, path }] — omit path on the final crumb. */
export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    ...(item.path ? { item: absoluteUrl(item.path) } : {}),
  })),
})

const CONDITION_MAP = {
  New: 'https://schema.org/NewCondition',
  Used: 'https://schema.org/UsedCondition',
  'Certified Pre-Owned': 'https://schema.org/RefurbishedCondition',
}

/** schema.org Car (Vehicle) with an Offer, for a vehicle detail page. */
export const vehicleSchema = (car) => ({
  '@context': 'https://schema.org',
  '@type': 'Car',
  name: `${car.year} ${car.make} ${car.model} ${car.trim || ''}`.trim(),
  description: car.description,
  url: absoluteUrl(`/cars/${car.id}`),
  image: car.gallery?.length ? car.gallery : [car.image],
  sku: car.stockNumber,
  brand: { '@type': 'Brand', name: car.make },
  model: car.model,
  vehicleConfiguration: car.trim,
  vehicleModelDate: String(car.year),
  productionDate: String(car.year),
  bodyType: car.bodyType,
  fuelType: car.fuel,
  vehicleTransmission: car.transmission,
  driveWheelConfiguration: car.drive,
  color: car.exteriorColor,
  vehicleInteriorColor: car.interiorColor,
  mileageFromOdometer: {
    '@type': 'QuantitativeValue',
    value: car.mileage,
    unitCode: 'KMT',
  },
  vehicleEngine: { '@type': 'EngineSpecification', name: car.engine },
  itemCondition: CONDITION_MAP[car.status] || 'https://schema.org/UsedCondition',
  offers: {
    '@type': 'Offer',
    price: car.price,
    priceCurrency: 'KES',
    availability: 'https://schema.org/InStock',
    itemCondition: CONDITION_MAP[car.status] || 'https://schema.org/UsedCondition',
    url: absoluteUrl(`/cars/${car.id}`),
    areaServed: { '@type': 'Country', name: 'Kenya' },
    seller: dealerRef,
  },
})

/** ItemList of vehicles for the inventory page. */
export const vehicleListSchema = (vehicles) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Used Cars for Sale in Nairobi, Kenya — Riri Cars Inventory',
  numberOfItems: vehicles.length,
  itemListElement: vehicles.map((car, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: absoluteUrl(`/cars/${car.id}`),
    name: `${car.year} ${car.make} ${car.model}`,
  })),
})

/** FAQPage from [{ question, answer }]. Must mirror visible on-page content. */
export const faqSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
})
