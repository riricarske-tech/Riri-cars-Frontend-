import { useEffect, useMemo, useState } from 'react'
import { MdArrowBack, MdCloudUpload, MdDeleteOutline, MdImage, MdKeyboardArrowDown, MdKeyboardArrowUp, MdSave } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../components/Admin/AdminLayout'
import { createVehicle, fetchAdminVehicle, updateVehicle, updateVehicleAvailability } from '../lib/adminApi'

const MAX_IMAGES = 15
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const BODY_TYPES = ['Hatchback', 'Sedan', 'Station Wagon', 'SUV', 'Van', 'Pickup', 'MPV']
const FUEL_TYPES = [['PETROL', 'Petrol'], ['DIESEL', 'Diesel'], ['HYBRID', 'Hybrid'], ['ELECTRIC', 'Electric']]
const DRIVE_TYPES = [['TWO_WD', '2WD'], ['FOUR_WD', '4WD'], ['AWD', 'AWD']]
const STATUS_TYPES = [['NEW', 'New'], ['USED', 'Used'], ['CERTIFIED_PRE_OWNED', 'Certified Pre-Owned']]
const CONDITION_TYPES = [['JAPAN_IMPORT', 'Japan Import'], ['LOCAL_USED', 'Local Used'], ['BRAND_NEW', 'Brand New']]
const ADD_VEHICLE_DRAFT_KEY = 'riri-cars-admin-add-vehicle-draft'

const STATUS_VALUES = { NEW: 'NEW', New: 'NEW', USED: 'USED', Used: 'USED', CERTIFIED_PRE_OWNED: 'CERTIFIED_PRE_OWNED', 'Certified Pre-Owned': 'CERTIFIED_PRE_OWNED' }
const CONDITION_VALUES = { JAPAN_IMPORT: 'JAPAN_IMPORT', 'Japan Import': 'JAPAN_IMPORT', LOCAL_USED: 'LOCAL_USED', 'Local Used': 'LOCAL_USED', BRAND_NEW: 'BRAND_NEW', 'Brand New': 'BRAND_NEW' }
const toBoolean = (value) => value === true || value === 'true'

function generateStockNumber() {
  return `RIRI-${Date.now().toString(36).toUpperCase()}`
}

const createEmptyVehicle = () => ({
  stockNumber: generateStockNumber(), year: '', make: '', model: '', trim: '', price: '', mileage: '', fuel: 'PETROL', transmission: '', engine: '', drive: 'TWO_WD', bodyType: 'SUV', status: 'USED', condition: 'JAPAN_IMPORT', exteriorColor: '', interiorColor: '', description: '', available: true, features: [],
})

const emptyVehicle = {
  stockNumber: '', year: '', make: '', model: '', trim: '', price: '', mileage: '', fuel: 'PETROL', transmission: '', engine: '', drive: 'TWO_WD', bodyType: 'SUV', status: 'USED', condition: 'JAPAN_IMPORT', exteriorColor: '', interiorColor: '', description: '', available: true, features: [],
}

function loadAddVehicleDraft() {
  try {
    const savedDraft = window.localStorage.getItem(ADD_VEHICLE_DRAFT_KEY)
    if (!savedDraft) return createEmptyVehicle()
    return { ...createEmptyVehicle(), ...JSON.parse(savedDraft) }
  } catch {
    return createEmptyVehicle()
  }
}

function toFormVehicle(vehicle) {
  return {
    ...emptyVehicle,
    ...vehicle,
    status: STATUS_VALUES[vehicle.status] || 'USED',
    condition: CONDITION_VALUES[vehicle.condition] || 'JAPAN_IMPORT',
    available: vehicle.available === undefined ? true : toBoolean(vehicle.available),
    year: vehicle.year ?? '',
    price: vehicle.price ?? '',
    mileage: vehicle.mileage ?? '',
    features: Array.isArray(vehicle.features) ? vehicle.features : [],
  }
}

function existingImageUrls(vehicle) {
  const images = vehicle.images || []
  const urls = images.map((image) => typeof image === 'string' ? image : image.url).filter(Boolean)
  if (vehicle.image && !urls.includes(vehicle.image)) urls.unshift(vehicle.image)
  return urls
}

function Field({ label, required, error, children, className = '' }) {
  return <label className={`block text-sm font-semibold text-dark ${className}`}><span>{label}{required && <span className="ml-1 text-primary">*</span>}</span>{children}{error && <span className="mt-1 block text-xs font-medium text-red-700">{error}</span>}</label>
}

export default function AdminVehicleForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editing = Boolean(id)
  const [vehicle, setVehicle] = useState(() => (editing ? emptyVehicle : loadAddVehicleDraft()))
  const [previews, setPreviews] = useState([])
  const [imageFiles, setImageFiles] = useState([])
  const [loading, setLoading] = useState(editing)
  const [submitting, setSubmitting] = useState(false)
  const [availabilitySaving, setAvailabilitySaving] = useState(false)
  const [submissionStage, setSubmissionStage] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    if (!editing) return undefined
    let active = true
    fetchAdminVehicle(id).then((data) => {
      if (!active) return
      const nextVehicle = toFormVehicle(data)
      setVehicle(nextVehicle)
      setPreviews(existingImageUrls(data).map((url) => ({ url, existing: true })))
    }).catch((loadError) => {
      if (active) setError(loadError.message)
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [editing, id])

  const imageCount = previews.length
  const canAddImages = imageCount < MAX_IMAGES
  const imageHint = useMemo(() => `${imageCount}/${MAX_IMAGES} selected · max 5 MB each`, [imageCount])

  useEffect(() => {
    if (editing) return
    try {
      window.localStorage.setItem(ADD_VEHICLE_DRAFT_KEY, JSON.stringify(vehicle))
    } catch {
      // Draft persistence is best effort when browser storage is unavailable.
    }
  }, [editing, vehicle])

  function setField(field, value) {
    setVehicle((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: '' }))
  }

  async function handleAvailabilityChange(event) {
    const nextAvailable = event.target.checked
    const previousAvailable = vehicle.available
    setField('available', nextAvailable)
    if (!editing) return

    setAvailabilitySaving(true)
    setError('')
    try {
      await updateVehicleAvailability(id, nextAvailable)
    } catch (availabilityError) {
      setField('available', previousAvailable)
      setError(availabilityError.message)
    } finally {
      setAvailabilitySaving(false)
    }
  }

  function handleImageSelection(event) {
    const selected = Array.from(event.target.files || [])
    const imageError = selected.find((file) => !file.type.startsWith('image/') || file.size > MAX_IMAGE_SIZE)
    if (imageError) {
      setError(`${imageError.name} must be an image no larger than 5 MB.`)
      event.target.value = ''
      return
    }
    if (selected.length + imageCount > MAX_IMAGES) {
      setError(`You can select up to ${MAX_IMAGES} images.`)
      event.target.value = ''
      return
    }
    setError('')
    setImageFiles((current) => [...current, ...selected])
    setPreviews((current) => [...current, ...selected.map((file) => ({ url: URL.createObjectURL(file), file }))])
    event.target.value = ''
  }

  function removeImage(index) {
    const removed = previews[index]
    if (removed?.file) {
      URL.revokeObjectURL(removed.url)
      setImageFiles((current) => current.filter((file) => file !== removed.file))
    }
    setPreviews((current) => current.filter((_, currentIndex) => currentIndex !== index))
  }

  function moveImage(index, direction) {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= previews.length) return
    const nextPreviews = [...previews]
    ;[nextPreviews[index], nextPreviews[nextIndex]] = [nextPreviews[nextIndex], nextPreviews[index]]
    setPreviews(nextPreviews)
    setImageFiles(nextPreviews.filter((preview) => preview.file).map((preview) => preview.file))
  }

  function validate() {
    const requiredFields = ['stockNumber', 'year', 'make', 'model', 'price', 'mileage', 'fuel', 'transmission', 'engine', 'drive', 'bodyType', 'exteriorColor', 'interiorColor', 'description']
    const errors = Object.fromEntries(requiredFields.filter((field) => !String(vehicle[field] ?? '').trim()).map((field) => [field, 'Required']))
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (!validate()) {
      setError('Complete the required vehicle details before saving.')
      return
    }
    setSubmitting(true)
    setSubmissionStage(editing ? 'Preparing your vehicle changes...' : 'Preparing your new vehicle...')
    try {
      const payload = { ...vehicle, features: vehicle.features.filter(Boolean) }
      setSubmissionStage(!editing && imageFiles.length > 0 ? 'Uploading vehicle images to secure cloud storage...' : 'Saving vehicle information...')
      if (editing) await updateVehicle(id, payload)
      else await createVehicle(payload, imageFiles)
      setSubmissionStage('Almost there, finishing your listing...')
      await new Promise((resolve) => window.setTimeout(resolve, 600))
      if (!editing) window.localStorage.removeItem(ADD_VEHICLE_DRAFT_KEY)
      navigate('/admin/dashboard', { replace: true, state: { notice: editing ? 'Vehicle updated successfully.' : 'Vehicle added successfully.' } })
    } catch (submitError) {
      setSubmissionStage('')
      setError(submitError.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <AdminLayout title="Edit vehicle"><div className="h-64 animate-pulse bg-white" /></AdminLayout>

  return (
    <AdminLayout title={editing ? 'Edit vehicle' : 'Add vehicle'} description="Keep the listing details precise so buyers can make a confident decision." action={<button type="button" onClick={() => navigate('/admin/dashboard')} className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-muted hover:text-dark"><MdArrowBack /> Back to inventory</button>}>
      <form onSubmit={handleSubmit} noValidate>
        {submitting && <div className="fixed inset-0 z-[60] grid place-items-center bg-black/55 px-4" role="status" aria-live="polite" aria-label="Saving vehicle">
          <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-primary-subtle text-4xl text-primary">
              {submissionStage.includes('Uploading') ? <MdCloudUpload className="animate-pulse" aria-hidden="true" /> : <MdSave className="animate-pulse" aria-hidden="true" />}
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Riri Cars Admin</p>
            <h2 className="mt-2 text-xl font-bold text-dark">{submissionStage}</h2>
            <div className="mx-auto mt-6 h-1.5 max-w-xs overflow-hidden rounded-full bg-brand-low">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
            </div>
            <p className="mt-4 text-sm text-muted">Please keep this window open while we secure your listing.</p>
          </div>
        </div>}
        {error && <p role="alert" className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-800">{error}</p>}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <section className="border border-brand-border bg-white p-5 shadow-card sm:p-6"><h2 className="mb-5 text-lg font-bold text-dark">Vehicle details</h2><div className="grid gap-4 sm:grid-cols-2">
              <Field label="Stock number (automatic)" required error={fieldErrors.stockNumber}><input className="input-field mt-2 bg-brand-low" value={vehicle.stockNumber} readOnly /></Field>
              <Field label="Year" required error={fieldErrors.year}><input type="number" min="1900" max="2100" className="input-field mt-2" value={vehicle.year} onChange={(event) => setField('year', event.target.value)} /></Field>
              <Field label="Make" required error={fieldErrors.make}><input className="input-field mt-2" value={vehicle.make} onChange={(event) => setField('make', event.target.value)} /></Field>
              <Field label="Model" required error={fieldErrors.model}><input className="input-field mt-2" value={vehicle.model} onChange={(event) => setField('model', event.target.value)} /></Field>
              <Field label="Trim"><input className="input-field mt-2" value={vehicle.trim} onChange={(event) => setField('trim', event.target.value)} /></Field>
              <Field label="Body type" required error={fieldErrors.bodyType}><select className="select-field mt-2" value={vehicle.bodyType} onChange={(event) => setField('bodyType', event.target.value)}>{BODY_TYPES.map((type) => <option key={type}>{type}</option>)}</select></Field>
              <Field label="Price (KES)" required error={fieldErrors.price}><input type="number" min="0" className="input-field mt-2" value={vehicle.price} onChange={(event) => setField('price', event.target.value)} /></Field>
              <Field label="Mileage (km)" required error={fieldErrors.mileage}><input type="number" min="0" required className="input-field mt-2" value={vehicle.mileage} onChange={(event) => setField('mileage', event.target.value)} /></Field>
            </div></section>

            <section className="border border-brand-border bg-white p-5 shadow-card sm:p-6"><h2 className="mb-5 text-lg font-bold text-dark">Specifications</h2><div className="grid gap-4 sm:grid-cols-2">
              <Field label="Fuel" required error={fieldErrors.fuel}><select className="select-field mt-2" value={vehicle.fuel} onChange={(event) => setField('fuel', event.target.value)}>{FUEL_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
              <Field label="Transmission" required error={fieldErrors.transmission}><input className="input-field mt-2" placeholder="e.g. Automatic" value={vehicle.transmission} onChange={(event) => setField('transmission', event.target.value)} /></Field>
              <Field label="Engine" required error={fieldErrors.engine}><input className="input-field mt-2" placeholder="e.g. 1.5L" value={vehicle.engine} onChange={(event) => setField('engine', event.target.value)} /></Field>
              <Field label="Drive" required error={fieldErrors.drive}><select className="select-field mt-2" value={vehicle.drive} onChange={(event) => setField('drive', event.target.value)}>{DRIVE_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
              <Field label="Exterior color" required error={fieldErrors.exteriorColor}><input className="input-field mt-2" value={vehicle.exteriorColor} onChange={(event) => setField('exteriorColor', event.target.value)} /></Field>
              <Field label="Interior color" required error={fieldErrors.interiorColor}><input className="input-field mt-2" value={vehicle.interiorColor} onChange={(event) => setField('interiorColor', event.target.value)} /></Field>
            </div></section>

            <section className="border border-brand-border bg-white p-5 shadow-card sm:p-6"><h2 className="mb-5 text-lg font-bold text-dark">Listing information</h2><div className="grid gap-4 sm:grid-cols-2"><Field label="Status"><select className="select-field mt-2" value={vehicle.status} onChange={(event) => setField('status', event.target.value)}>{STATUS_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field><Field label="Condition"><select className="select-field mt-2" value={vehicle.condition} onChange={(event) => setField('condition', event.target.value)}>{CONDITION_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field></div><Field label="Features" className="mt-4"><input className="input-field mt-2" value={vehicle.features.join(', ')} onChange={(event) => setField('features', event.target.value.split(',').map((feature) => feature.trim()).filter(Boolean))} placeholder="e.g. Reverse camera, Sunroof, Leather seats" /><span className="mt-1 block text-xs font-normal text-muted">Separate features with commas.</span></Field><Field label="Description" required error={fieldErrors.description} className="mt-4"><textarea rows="5" className="input-field mt-2 resize-y" value={vehicle.description} onChange={(event) => setField('description', event.target.value)} /></Field><label className={`mt-4 flex items-center gap-3 text-sm font-semibold text-dark ${availabilitySaving ? 'opacity-60' : ''}`}><input type="checkbox" checked={vehicle.available} disabled={availabilitySaving} onChange={handleAvailabilityChange} className="h-4 w-4 accent-primary" /> {availabilitySaving ? 'Updating availability...' : 'Available for sale'}</label></section>
          </div>

          <aside className="h-fit border border-brand-border bg-white p-5 shadow-card sm:p-6"><div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-bold text-dark">Vehicle images</h2><p className="mt-1 text-sm text-muted">{imageHint}</p></div><MdImage className="text-2xl text-primary" /></div><p className="mt-4 rounded bg-primary-subtle px-3 py-2 text-xs leading-5 text-dark"><strong>First image is the main image.</strong> Reorder the previews before saving.</p><label className={`mt-5 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-brand-border px-4 text-center transition hover:border-primary ${!canAddImages ? 'cursor-not-allowed opacity-50' : ''}`}><input type="file" accept="image/*" multiple disabled={!canAddImages} onChange={handleImageSelection} className="sr-only" /><span className="text-sm font-bold text-dark">{canAddImages ? 'Choose images' : 'Image limit reached'}</span><span className="mt-1 text-xs text-muted">JPG, PNG or WebP · up to 5 MB each</span></label>{previews.length > 0 && <div className="mt-5 grid grid-cols-2 gap-3">{previews.map((preview, index) => <div key={`${preview.url}-${index}`} className="relative overflow-hidden rounded border border-brand-border"><img src={preview.url} alt={`${index === 0 ? 'Main ' : ''}vehicle preview ${index + 1}`} className="aspect-square w-full object-cover" />{index === 0 && <span className="absolute left-2 top-2 rounded bg-dark-nav px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Main</span>}<div className="absolute bottom-2 right-2 flex gap-1"><button type="button" title="Move image earlier" aria-label="Move image earlier" disabled={index === 0} onClick={() => moveImage(index, -1)} className="grid h-8 w-8 place-items-center rounded bg-white/95 text-dark shadow disabled:opacity-40"><MdKeyboardArrowUp /></button><button type="button" title="Move image later" aria-label="Move image later" disabled={index === previews.length - 1} onClick={() => moveImage(index, 1)} className="grid h-8 w-8 place-items-center rounded bg-white/95 text-dark shadow disabled:opacity-40"><MdKeyboardArrowDown /></button><button type="button" title="Remove image" aria-label="Remove image" onClick={() => removeImage(index)} className="grid h-8 w-8 place-items-center rounded bg-white/95 text-red-700 shadow"><MdDeleteOutline /></button></div></div>)}</div>}</aside>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-brand-border pt-6 sm:flex-row sm:justify-end"><button type="button" onClick={() => navigate('/admin/dashboard')} className="min-h-12 rounded border border-brand-border px-5 text-sm font-semibold text-dark hover:bg-brand-low">Cancel</button><button type="submit" disabled={submitting} className="btn-primary min-h-12 justify-center disabled:cursor-not-allowed disabled:opacity-60"><MdSave />{submitting ? 'Saving vehicle...' : editing ? 'Save changes' : 'Add vehicle'}</button></div>
      </form>
    </AdminLayout>
  )
}