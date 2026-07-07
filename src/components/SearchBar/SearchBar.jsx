import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdSearch, MdKeyboardArrowDown } from 'react-icons/md'
import { makes, models, years, priceRanges, bodyTypes } from '../../data/cars'

const SelectField = ({ label, options, value, onChange }) => (
  <div className="relative flex-1 min-w-0">
    <label className="block text-xs font-bold text-muted-dark uppercase tracking-wider mb-1.5">
      {label}
    </label>
    <div className="relative">
      <select
        className="select-field pr-8"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      >
        <option value="">All {label}s</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <MdKeyboardArrowDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none text-lg" />
    </div>
  </div>
)

export default function SearchBar() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    bodyType: '',
  })

  const setFilter = (key) => (val) => setFilters((f) => ({ ...f, [key]: val }))

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (filters.make) params.set('make', filters.make)
    if (filters.model) params.set('model', filters.model)
    if (filters.year) params.set('year', filters.year)
    if (filters.bodyType) params.set('bodyType', filters.bodyType)
    if (activeTab === 'new') params.set('status', 'New')
    if (activeTab === 'used') params.set('status', 'Used')
    navigate(`/cars?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded shadow-card-hover border border-brand-border overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-brand-border">
        {[
          { key: 'all', label: 'All Vehicles' },
          { key: 'new', label: 'New Cars' },
          { key: 'used', label: 'Used Cars' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 sm:flex-none px-6 py-3.5 text-sm font-semibold uppercase tracking-wide transition-colors border-b-2 ${
              activeTab === key
                ? 'border-primary text-primary bg-primary-subtle'
                : 'border-transparent text-muted hover:text-dark hover:border-brand-border'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-3 items-end">
          <SelectField
            label="Make"
            options={makes}
            value={filters.make}
            onChange={setFilter('make')}
          />
          <SelectField
            label="Model"
            options={models}
            value={filters.model}
            onChange={setFilter('model')}
          />
          <SelectField
            label="Year"
            options={years}
            value={filters.year}
            onChange={setFilter('year')}
          />
          <SelectField
            label="Price Range"
            options={priceRanges}
            value={filters.price}
            onChange={setFilter('price')}
          />
          <SelectField
            label="Body Type"
            options={bodyTypes}
            value={filters.bodyType}
            onChange={setFilter('bodyType')}
          />
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 lg:flex-shrink-0">
            <label className="hidden lg:block text-xs font-bold text-muted-dark uppercase tracking-wider mb-1.5 opacity-0 select-none">
              Search
            </label>
            <button
              onClick={handleSearch}
              className="btn-primary w-full lg:w-auto h-[46px] px-8 gap-2 justify-center"
            >
              <MdSearch size={18} />
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
