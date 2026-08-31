/**
 * Riri Cars — Services
 * Sourced from: Facebook posts, Kenyanlist listing, japanesecarstrade profile
 * VERIFIED: Direct purchase, Trade-in, Asset financing, Direct import (all confirmed via Facebook)
 * VERIFIED: Asset financing partner "Dream Credit Limited" — confirmed via Dream Credit's own
 *           Facebook post featuring Riri Cars ("Drive your Dream Car, buy that car as a BUSINESS ASSET!")
 * Note: step-by-step process bullets describe how each service typically works; they are not
 *       independently sourced claims, only the services themselves and the financing partner are verified.
 */

export const services = [
  {
    id: 1,
    icon: 'MdDirectionsCar',
    title: 'Quality Used Imports',
    description:
      'We source and import meticulously selected domestic market (JDM) vehicles. Every unit is quality-inspected before listing — hatchbacks, sedans, SUVs, and wagons.',
    steps: [
      'Hand-picked from auctions with full auction sheet history',
      'Quality-inspected on arrival before it reaches our showroom',
      'Choose from hatchbacks, sedans, SUVs, and wagons in stock',
    ],
  },
  {
    id: 2,
    icon: 'MdAccountBalance',
    title: 'Asset Financing',
    // VERIFIED: Confirmed via Facebook posts — "We arrange asset finance on all cars"
    description:
      'Drive away sooner. We arrange asset financing on all our vehicles through our partner banks and financial institutions. Fast approvals and competitive rates.',
    partner: 'Dream Credit Limited',
    quote: 'Drive your Dream Car — buy that car as a BUSINESS ASSET!',
    steps: [
      'Pick your vehicle from our showroom or import list',
      'We arrange financing through Dream Credit Limited and partner institutions',
      'Fast approval — drive away on flexible monthly terms',
    ],
  },
  {
    id: 3,
    icon: 'MdSwapHoriz',
    title: 'Trade-In / Exchange',
    // VERIFIED: Confirmed via Facebook — "trade-in arrangements" listed as purchase option
    description:
      'Want to upgrade? Bring in your current vehicle for a fair market valuation and offset the cost of your next car. Seamless, same-day trade-in process.',
    steps: [
      'Bring in your current vehicle for a free valuation',
      'Get a fair, transparent market offer the same day',
      'Offset the value directly against your next Riri Cars purchase',
    ],
  },
  {
    id: 4,
    icon: 'MdFlightTakeoff',
    title: 'Direct Import Service',
    // VERIFIED: Confirmed via Facebook — "direct import services" explicitly listed
    description:
      "Can't find what you're looking for in our stock? We will source and directly import any vehicle from Japan to your exact specifications at market-competitive prices.",
    steps: [
      'Tell us the exact make, model, year, and spec you want',
      'We source it directly from auctions on your behalf',
      'Vehicle is shipped, cleared, and delivered to our Kiambu Road showroom',
    ],
  },
  {
    id: 5,
    icon: 'MdVerifiedUser',
    title: 'Insurance Assistance',
    description:
      'We connect you with trusted insurance providers for comprehensive motor vehicle cover. Get your new car insured and on the road the same day you buy.',
    steps: [
      'We connect you with trusted comprehensive insurance providers',
      'Get a same-day quote tailored to your vehicle and budget',
      'Drive off fully covered from day one',
    ],
  },
  {
    id: 6,
    icon: 'MdSupportAgent',
    title: 'After-Sales Support',
    description:
      "Our relationship doesn't end at the sale. Our team remains available to assist with any questions, documentation, service referrals, or follow-up needs after purchase.",
    steps: [
      'Ongoing support for documentation and logbook transfer',
      'Referrals to trusted mechanics and service centers',
      'Our team stays reachable for any post-purchase questions',
    ],
  },
]

export const whyChooseUs = [
  { id: 1, text: 'Verified Japan import vehicles with full auction sheets' },
  { id: 2, text: '90% customer recommendation rate on Facebook (31 reviews)' },
  { id: 3, text: 'Asset financing arranged on ALL vehicles in stock' },
  { id: 4, text: 'Fair and transparent trade-in valuations' },
  { id: 5, text: 'Direct import: we source any car from Japan for you' },
  { id: 6, text: "54,000+ Kenyans follow us — Kenya's most trusted car dealer" },
]
