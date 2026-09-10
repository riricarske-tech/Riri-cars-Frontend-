import { useEffect, useMemo, useState } from 'react'
import { MdAdd, MdChevronLeft, MdChevronRight, MdDeleteOutline, MdDirectionsCar, MdEdit, MdKeyboardArrowDown, MdRefresh, MdSearch } from 'react-icons/md'
import { useLocation, useNavigate } from 'react-router-dom'
import AdminLayout from '../components/Admin/AdminLayout'
import { deleteVehicle, fetchAdminVehicles, updateVehicleAvailability } from '../lib/adminApi'

const formatPrice = (price) => `KSh ${Number(price || 0).toLocaleString('en-KE')}`
const getImage = (vehicle) => vehicle.image || vehicle.images?.[0]?.url || vehicle.images?.[0] || ''
const PAGE_SIZE_OPTIONS = [10, 25, 50]
const formatStatus = (status) => status === 'NEW' || status === 'New' ? 'New' : status === 'USED' || status === 'Used' ? 'Used' : status

export default function AdminDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(location.state?.notice || '')
  const [deletingId, setDeletingId] = useState(null)
  const [availabilityId, setAvailabilityId] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])

  useEffect(() => {
    if (!location.state?.notice) return
    navigate(location.pathname, { replace: true, state: null })
  }, [location.pathname, location.state?.notice, navigate])

  useEffect(() => {
    if (!notice) return
    const timeoutId = window.setTimeout(() => setNotice(''), 5000)
    return () => window.clearTimeout(timeoutId)
  }, [notice])

  const statusOptions = useMemo(() => [...new Set(['New', 'Used', ...vehicles.map((vehicle) => formatStatus(vehicle.status)).filter(Boolean)])].sort(), [vehicles])

  const filteredVehicles = useMemo(() => {
    const query = search.trim().toLowerCase()

    return vehicles.filter((vehicle) => {
      const searchableText = [vehicle.year, vehicle.make, vehicle.model, vehicle.trim, vehicle.stockNumber]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      if (query && !searchableText.includes(query)) return false
      if (statusFilter && formatStatus(vehicle.status) !== statusFilter) return false
      if (availabilityFilter === 'available' && vehicle.available === false) return false
      if (availabilityFilter === 'unavailable' && vehicle.available !== false) return false
      return true
    })
  }, [vehicles, search, statusFilter, availabilityFilter])

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter, availabilityFilter, pageSize])

  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageVehicles = filteredVehicles.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  async function loadVehicles() {
    setLoading(true)
    setError('')
    try {
      setVehicles(await fetchAdminVehicles())
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadVehicles() }, [])

  async function handleDelete(vehicle) {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return
    setDeletingId(vehicle.id)
    setError('')
    try {
      await deleteVehicle(vehicle.id)
      setVehicles((current) => current.filter((item) => item.id !== vehicle.id))
      setNotice(`${vehicle.year} ${vehicle.make} ${vehicle.model} was deleted.`)
    } catch (deleteError) {
      setError(deleteError.message)
    } finally {
      setDeletingId(null)
    }
  }

  async function handleAvailabilityToggle(vehicle) {
    const nextAvailable = vehicle.available === false
    setAvailabilityId(vehicle.id)
    setError('')
    try {
      await updateVehicleAvailability(vehicle.id, nextAvailable)
      setVehicles((current) => current.map((item) => item.id === vehicle.id ? { ...item, available: nextAvailable } : item))
      setNotice(`${vehicle.year} ${vehicle.make} ${vehicle.model} is now ${nextAvailable ? 'available' : 'unavailable'}.`)
    } catch (toggleError) {
      setError(toggleError.message)
    } finally {
      setAvailabilityId(null)
    }
  }

  return (
    <AdminLayout
      title="Vehicle inventory"
      description="Add, update, and remove the vehicles currently visible to buyers."
      action={<button type="button" onClick={() => navigate('/admin/vehicles/new')} className="btn-primary"><MdAdd aria-hidden="true" /> Add vehicle</button>}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-dark">{loading ? 'Loading inventory...' : `${filteredVehicles.length} of ${vehicles.length} vehicle${vehicles.length === 1 ? '' : 's'} shown`}</p>
        <button type="button" onClick={loadVehicles} disabled={loading} className="inline-flex min-h-10 items-center gap-2 rounded border border-brand-border bg-white px-3 text-sm font-semibold text-muted transition hover:border-dark-nav hover:text-dark disabled:opacity-50"><MdRefresh className={loading ? 'animate-spin' : ''} /> Refresh</button>
      </div>
      {notice && <p role="status" className="mb-5 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{notice}</p>}
      {error && <p role="alert" className="mb-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-800">{error}</p>}

      {!loading && vehicles.length > 0 && <div className="mb-5 grid gap-3 rounded border border-brand-border bg-white p-4 shadow-card md:grid-cols-[minmax(0,1fr)_180px_180px_150px]">
        <label className="relative block">
          <span className="sr-only">Search vehicles</span>
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search make, model, year, or stock number" className="input-field pr-10" />
          <MdSearch aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
        </label>
        <label className="relative block">
          <span className="sr-only">Filter by status</span>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="select-field pr-8">
            <option value="">All statuses</option>
            {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <MdKeyboardArrowDown aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-lg text-muted" />
        </label>
        <label className="relative block">
          <span className="sr-only">Filter by availability</span>
          <select value={availabilityFilter} onChange={(event) => setAvailabilityFilter(event.target.value)} className="select-field pr-8">
            <option value="">All availability</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
          <MdKeyboardArrowDown aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-lg text-muted" />
        </label>
        <label className="relative block">
          <span className="sr-only">Vehicles per page</span>
          <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))} className="select-field pr-8">
            {PAGE_SIZE_OPTIONS.map((size) => <option key={size} value={size}>{size} per page</option>)}
          </select>
          <MdKeyboardArrowDown aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-lg text-muted" />
        </label>
      </div>}

      {loading ? <div className="space-y-3" aria-label="Loading vehicles"><div className="h-20 animate-pulse rounded bg-white" /><div className="h-20 animate-pulse rounded bg-white" /><div className="h-20 animate-pulse rounded bg-white" /></div> : vehicles.length === 0 ? (
        <div className="border border-dashed border-brand-border bg-white px-6 py-16 text-center"><MdDirectionsCar className="mx-auto mb-3 text-4xl text-primary" /><h2 className="text-lg font-bold text-dark">No vehicles yet</h2><p className="mx-auto mt-2 max-w-sm text-sm text-muted">Add the first vehicle to start building the live showroom inventory.</p><button type="button" onClick={() => navigate('/admin/vehicles/new')} className="btn-primary mt-6"><MdAdd /> Add your first vehicle</button></div>
      ) : pageVehicles.length === 0 ? (
        <div className="border border-dashed border-brand-border bg-white px-6 py-16 text-center"><MdSearch className="mx-auto mb-3 text-4xl text-muted-light" /><h2 className="text-lg font-bold text-dark">No vehicles match</h2><p className="mx-auto mt-2 max-w-sm text-sm text-muted">Try a different search term or clear one of the filters.</p><button type="button" onClick={() => { setSearch(''); setStatusFilter(''); setAvailabilityFilter('') }} className="btn-primary mt-6">Clear filters</button></div>
      ) : (
        <div className="overflow-hidden border border-brand-border bg-white shadow-card">
          <div className="hidden grid-cols-[minmax(0,1fr)_140px_140px_180px] gap-4 border-b border-brand-border bg-brand-low px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted md:grid"><span>Vehicle</span><span>Price</span><span>Status</span><span className="text-right">Actions</span></div>
          <div className="divide-y divide-brand-border">
            {pageVehicles.map((vehicle) => <div key={vehicle.id} className="grid gap-4 px-4 py-4 sm:px-5 md:grid-cols-[minmax(0,1fr)_140px_140px_180px] md:items-center">
              <div className="flex min-w-0 items-center gap-3"><div className="h-16 w-20 shrink-0 overflow-hidden rounded bg-brand-low">{getImage(vehicle) ? <img src={getImage(vehicle)} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} className="h-full w-full object-cover" /> : <MdDirectionsCar className="m-auto h-full text-2xl text-muted-light" />}</div><div className="min-w-0"><h2 className="truncate font-bold text-dark">{vehicle.year} {vehicle.make} {vehicle.model}</h2><p className="truncate text-sm text-muted">{vehicle.trim || 'No trim'} · Stock {vehicle.stockNumber || '—'}</p></div></div>
              <p className="text-sm font-bold text-dark">{formatPrice(vehicle.price)}</p>
              <p><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${vehicle.available === false ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-800'}`}>{vehicle.available === false ? 'Unavailable' : vehicle.status || 'Active'}</span></p>
              <div className="flex flex-wrap justify-start gap-2 md:justify-end"><button type="button" onClick={() => handleAvailabilityToggle(vehicle)} disabled={availabilityId === vehicle.id} className="inline-flex min-h-10 items-center gap-1.5 rounded border border-brand-border px-3 text-sm font-semibold text-dark transition hover:border-primary hover:text-primary disabled:opacity-50">{availabilityId === vehicle.id ? 'Updating...' : vehicle.available === false ? 'Mark available' : 'Mark unavailable'}</button><button type="button" onClick={() => navigate(`/admin/vehicles/${vehicle.id}/edit`)} className="inline-flex min-h-10 items-center gap-1.5 rounded border border-brand-border px-3 text-sm font-semibold text-dark transition hover:border-primary hover:text-primary"><MdEdit /> Edit</button><button type="button" onClick={() => handleDelete(vehicle)} disabled={deletingId === vehicle.id} className="inline-flex min-h-10 items-center gap-1.5 rounded border border-red-200 px-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50"><MdDeleteOutline /> {deletingId === vehicle.id ? 'Deleting...' : 'Delete'}</button></div>
            </div>)}
          </div>
        </div>
      )}
      {!loading && filteredVehicles.length > 0 && totalPages > 1 && <nav aria-label="Admin inventory pages" className="mt-5 flex items-center justify-center gap-3 text-sm font-semibold">
        <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={currentPage === 1} className="inline-flex min-h-10 items-center gap-1 rounded border border-brand-border px-3 text-dark transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"><MdChevronLeft aria-hidden="true" /> Previous</button>
        <span aria-live="polite" className="text-muted">Page {currentPage} of {totalPages}</span>
        <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={currentPage === totalPages} className="inline-flex min-h-10 items-center gap-1 rounded border border-brand-border px-3 text-dark transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40">Next <MdChevronRight aria-hidden="true" /></button>
      </nav>}
    </AdminLayout>
  )
}