import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  MdChevronRight,
  MdSearch,
  MdKeyboardArrowDown,
  MdGridView,
  MdViewList,
} from 'react-icons/md'
import useVehicles from '../hooks/useVehicles'
import VehicleCard from '../components/Inventory/VehicleCard'
import VehicleCardSkeleton from '../components/Inventory/VehicleCardSkeleton'
import SEO from '../components/SEO'
import { breadcrumbSchema, vehicleListSchema } from '../lib/seo'

const formatPrice = (price) => `KSh ${price.toLocaleString('en-KE')}`

const uniqueSorted = (values) => [...new Set(values)].sort((a, b) => (a > b ? 1 : -1))

const MILEAGE_OPTIONS = [
  { label: 'Any Mileage', value: '' },
  { label: 'Under 30,000 km', value: '30000' },
  { label: 'Under 40,000 km', value: '40000' },
  { label: 'Under 50,000 km', value: '50000' },
  { label: 'Under 65,000 km', value: '65000' },
]

const DEFAULT_FILTERS = {
  q: '',
  year: '',
  make: '',
  model: '',
  bodyType: '',
  status: '',
  fuel: '',
  transmission: '',
  drive: '',
  maxMileage: '',
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="select-field pr-8">
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <MdKeyboardArrowDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none text-lg" />
    </div>
  )
}

export default function Inventory() {
  const [searchParams] = useSearchParams()
  const { vehicles, loading, error } = useVehicles()

  const YEARS = useMemo(() => uniqueSorted(vehicles.map((c) => c.year)).reverse(), [vehicles])
  const MAKES = useMemo(() => uniqueSorted(vehicles.map((c) => c.make)), [vehicles])
  const MODELS = useMemo(() => uniqueSorted(vehicles.map((c) => c.model)), [vehicles])
  const BODY_TYPES = useMemo(() => uniqueSorted(vehicles.map((c) => c.bodyType)), [vehicles])
  const CONDITIONS = useMemo(() => uniqueSorted(vehicles.map((c) => c.status)), [vehicles])
  const TRANSMISSIONS = useMemo(() => uniqueSorted(vehicles.map((c) => c.transmission)), [vehicles])
  const DRIVETRAINS = useMemo(() => uniqueSorted(vehicles.map((c) => c.drive)), [vehicles])
  const PRICE_MIN = useMemo(() => (vehicles.length ? Math.min(...vehicles.map((c) => c.price)) : 0), [vehicles])
  const PRICE_MAX = useMemo(() => (vehicles.length ? Math.max(...vehicles.map((c) => c.price)) : 0), [vehicles])

  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS,
    q: searchParams.get('q') || '',
    year: searchParams.get('year') || '',
    make: searchParams.get('make') || '',
    model: searchParams.get('model') || '',
    bodyType: searchParams.get('bodyType') || '',
    status: searchParams.get('status') || '',
    fuel: searchParams.get('fuel') || '',
  }))
  const [maxPrice, setMaxPrice] = useState(0)
  const [sort, setSort] = useState('default')
  const [perPage, setPerPage] = useState(9)
  const [view, setView] = useState('grid')
  const [page, setPage] = useState(1)

  const [loanAmount, setLoanAmount] = useState('')
  const [downPayment, setDownPayment] = useState('')
  const [interestRate, setInterestRate] = useState('13')
  const [periodMonths, setPeriodMonths] = useState('48')
  const [monthlyPayment, setMonthlyPayment] = useState(null)

  // Seed the price slider once vehicles load (PRICE_MAX starts at 0 pre-fetch).
  useEffect(() => {
    if (PRICE_MAX > 0 && maxPrice === 0) setMaxPrice(PRICE_MAX)
  }, [PRICE_MAX])

  const setFilter = (key) => (value) => setFilters((f) => ({ ...f, [key]: value }))

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS)
    setMaxPrice(PRICE_MAX)
  }

  const filtered = useMemo(() => {
    return vehicles.filter((c) => {
      if (filters.q) {
        const haystack = `${c.year} ${c.make} ${c.model} ${c.trim}`.toLowerCase()
        if (!haystack.includes(filters.q.toLowerCase())) return false
      }
      if (filters.year && String(c.year) !== filters.year) return false
      if (filters.make && c.make !== filters.make) return false
      if (filters.model && !c.model.toLowerCase().startsWith(filters.model.toLowerCase())) return false
      if (filters.bodyType && c.bodyType !== filters.bodyType) return false
      if (filters.status && c.status !== filters.status) return false
      if (filters.fuel && !c.fuel.toLowerCase().includes(filters.fuel.toLowerCase())) return false
      if (filters.transmission && c.transmission !== filters.transmission) return false
      if (filters.drive && c.drive !== filters.drive) return false
      if (filters.maxMileage && c.mileage > Number(filters.maxMileage)) return false
      if (c.price > maxPrice) return false
      return true
    })
  }, [vehicles, filters, maxPrice])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    if (sort === 'price-asc') arr.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') arr.sort((a, b) => b.price - a.price)
    else if (sort === 'newest') arr.sort((a, b) => b.year - a.year)
    else arr.sort((a, b) => a.id - b.id)
    return arr
  }, [filtered, sort])

  useEffect(() => {
    setPage(1)
  }, [filters, maxPrice, sort, perPage])

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage))
  const currentPage = Math.min(page, totalPages)
  const pageItems = sorted.slice((currentPage - 1) * perPage, currentPage * perPage)

  const estimatePayment = () => {
    const principal = Math.max(0, Number(loanAmount) - Number(downPayment || 0))
    const n = Number(periodMonths)
    const monthlyRate = Number(interestRate) / 100 / 12
    if (!principal || !n) {
      setMonthlyPayment(null)
      return
    }
    const payment =
      monthlyRate > 0
        ? (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
        : principal / n
    setMonthlyPayment(payment)
  }

  return (
    <main className="pt-20 md:pt-24 bg-brand-bg">
      <SEO
        title="Used Cars for Sale in Nairobi, Kenya — Browse Inventory | Riri Cars Ltd"
        description="Browse quality used Japanese import cars for sale in Nairobi at Riri Cars, Kiambu Road. Toyota, Mazda, Subaru, Honda, Nissan hatchbacks, sedans & SUVs with asset financing and trade-in options."
        path="/cars"
        jsonLd={[
          breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Inventory' }]),
          ...(vehicles.length ? [vehicleListSchema(vehicles)] : []),
        ]}
      />
      {/* Banner */}
      <section
        className="relative h-[260px] md:h-[300px] flex items-end overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(11,26,49,0.55) 60%, rgba(0,0,0,0.35) 100%),
            url('https://images.unsplash.com/photo-1669691101370-9ee9ee0782dc?w=1600&q=85&auto=format&fit=crop')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-red-shine" />
        <div className="container-main pb-8 md:pb-10 relative z-10">
          <h1 className="text-white font-black text-4xl md:text-5xl tracking-tight mb-2">
            Cars for Sale in Nairobi
          </h1>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-white/60 text-xs uppercase tracking-wider">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <MdChevronRight size={14} aria-hidden="true" />
            <span className="text-white" aria-current="page">Inventory</span>
          </nav>
        </div>
      </section>

      {loading ? (
        <div className="container-main py-10 md:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <VehicleCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="container-main py-24 text-center text-muted">
          <p className="text-lg font-semibold mb-2">Couldn't load vehicles right now.</p>
          <p className="text-sm">Please try again shortly, or contact us directly.</p>
        </div>
      ) : (
      <div className="container-main py-10 md:py-14 flex flex-col md:flex-row gap-8 items-start">
        {/* ── Sidebar filters ─────────────────────────────────────────── */}
        <aside className="w-full md:w-80 shrink-0 flex flex-col gap-6">
          {/* Search */}
          <div className="bg-brand-low p-5 rounded">
            <h3 className="font-bold text-primary mb-3">Search Vehicles</h3>
            <div className="relative">
              <input
                type="text"
                value={filters.q}
                onChange={(e) => setFilter('q')(e.target.value)}
                placeholder="Year, make, model..."
                aria-label="Search vehicles by year, make, or model"
                className="input-field pr-10"
              />
              <MdSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
            </div>
          </div>

          {/* Price filter */}
          <div className="bg-brand-low p-5 rounded border-l-4 border-primary">
            <h3 className="font-bold text-dark mb-3">Filter By Price</h3>
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={50000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              aria-label="Maximum price in Kenyan Shillings"
              className="w-full accent-primary"
            />
            <p className="text-xs font-semibold text-muted mt-2">
              {formatPrice(PRICE_MIN)} – <span className="text-primary">{formatPrice(maxPrice)}</span>
            </p>
          </div>

          {/* Inventory filters */}
          <div className="bg-brand-low p-5 rounded flex flex-col gap-3">
            <div>
              <h3 className="font-bold text-dark">Inventory Filters</h3>
              <p className="text-muted text-sm">{filtered.length} Vehicles Matching</p>
            </div>
            <Select label="Year" value={filters.year} onChange={setFilter('year')} options={YEARS} />
            <Select label="Make" value={filters.make} onChange={setFilter('make')} options={MAKES} />
            <Select label="Model" value={filters.model} onChange={setFilter('model')} options={MODELS} />
            <Select label="Body Style" value={filters.bodyType} onChange={setFilter('bodyType')} options={BODY_TYPES} />
            <Select label="Condition" value={filters.status} onChange={setFilter('status')} options={CONDITIONS} />
            <div className="relative">
              <select
                value={filters.maxMileage}
                onChange={(e) => setFilter('maxMileage')(e.target.value)}
                className="select-field pr-8"
              >
                {MILEAGE_OPTIONS.map((opt) => (
                  <option key={opt.label} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <MdKeyboardArrowDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none text-lg" />
            </div>
            <Select
              label="Transmission"
              value={filters.transmission}
              onChange={setFilter('transmission')}
              options={TRANSMISSIONS}
            />
            <Select label="Drivetrain" value={filters.drive} onChange={setFilter('drive')} options={DRIVETRAINS} />
            <button onClick={resetFilters} className="btn-primary w-full justify-center mt-1">
              Reset Filters
            </button>
          </div>

          {/* Financing calculator */}
          <div className="bg-brand-low p-5 rounded">
            <h3 className="font-bold text-dark mb-3">Financing Calculator</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-muted-dark uppercase tracking-wider mb-1">
                  Vehicle Price (KSh)
                </label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="e.g. 1500000"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-dark uppercase tracking-wider mb-1">
                  Down Payment (KSh)
                </label>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  placeholder="e.g. 300000"
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-muted-dark uppercase tracking-wider mb-1">
                    Interest (%)
                  </label>
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-dark uppercase tracking-wider mb-1">
                    Period (mo)
                  </label>
                  <input
                    type="number"
                    value={periodMonths}
                    onChange={(e) => setPeriodMonths(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
              <button onClick={estimatePayment} className="btn-secondary w-full justify-center">
                Estimate Payment
              </button>
              {monthlyPayment !== null && (
                <p className="text-center text-sm text-dark bg-white rounded p-3 border border-brand-border">
                  Est. monthly payment
                  <br />
                  <span className="price-tag text-xl">{formatPrice(Math.round(monthlyPayment))}</span>
                </p>
              )}
            </div>
          </div>
        </aside>

        {/* ── Main grid ───────────────────────────────────────────────── */}
        <section className="flex-1 w-full">
          {/* Grid controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded shadow-card mb-6">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={perPage}
                  onChange={(e) => setPerPage(Number(e.target.value))}
                  className="select-field pr-8 min-w-[130px]"
                >
                  <option value={6}>6 Per Page</option>
                  <option value={9}>9 Per Page</option>
                  <option value={12}>12 Per Page</option>
                </select>
                <MdKeyboardArrowDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none text-lg" />
              </div>
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="select-field pr-8 min-w-[170px]"
                >
                  <option value="default">Sort by Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
                <MdKeyboardArrowDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none text-lg" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('grid')}
                aria-label="Grid view"
                className={`p-2 rounded border transition-colors ${
                  view === 'grid' ? 'border-primary text-primary bg-primary-subtle' : 'border-brand-border text-muted hover:border-primary'
                }`}
              >
                <MdGridView size={20} />
              </button>
              <button
                onClick={() => setView('list')}
                aria-label="List view"
                className={`p-2 rounded border transition-colors ${
                  view === 'list' ? 'border-primary text-primary bg-primary-subtle' : 'border-brand-border text-muted hover:border-primary'
                }`}
              >
                <MdViewList size={20} />
              </button>
            </div>
          </div>

          {/* Grid / list */}
          {pageItems.length > 0 ? (
            <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'flex flex-col gap-4'}>
              {pageItems.map((car) => (
                <VehicleCard key={car.id} car={car} view={view} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted bg-white rounded border border-brand-border">
              <p className="text-lg font-semibold mb-2">No vehicles match your filters.</p>
              <p className="text-sm mb-4">Contact us — we can source any vehicle directly from Japan.</p>
              <button onClick={resetFilters} className="btn-primary mx-auto">
                Reset Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Inventory pages" className="mt-10 flex justify-center items-center gap-2 text-sm font-semibold">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  aria-label={`Go to page ${p}`}
                  aria-current={currentPage === p ? 'page' : undefined}
                  className={`w-10 h-10 flex items-center justify-center border transition-all ${
                    currentPage === p
                      ? 'bg-primary text-white border-primary'
                      : 'border-brand-border hover:border-primary hover:text-primary'
                  }`}
                >
                  {p}
                </button>
              ))}
            </nav>
          )}
        </section>
      </div>
      )}
    </main>
  )
}
