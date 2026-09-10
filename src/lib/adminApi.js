import { supabase } from './supabase'

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3030'
const STATUS_VALUES = new Set(['NEW', 'USED', 'CERTIFIED_PRE_OWNED'])
const CONDITION_VALUES = new Set(['JAPAN_IMPORT', 'LOCAL_USED', 'BRAND_NEW'])

function getErrorMessage(result, status) {
  if (status === 401) return 'Your session has expired. Please log in again.'
  if (status === 403) return 'Your account is authenticated but does not have administrator access.'
  if (status === 404) return 'The requested vehicle could not be found.'
  if (status === 422) return result?.error || result?.message || 'Please check the vehicle details and try again.'
  return result?.error || result?.message || `The request failed with status ${status}. Please try again.`
}

async function getAccessToken() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Please log in first')
  return session.access_token
}

async function request(path, options = {}) {
  const accessToken = await getAccessToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(getErrorMessage(result, response.status))
  return result?.data ?? result
}

export async function fetchAdminVehicles() {
  const result = await request('/api/vehicles/admin/all')
  return Array.isArray(result) ? result : result.data ?? []
}

export async function fetchAdminVehicle(id) {
  return request(`/api/vehicles/${id}`)
}

function buildVehicleFormData(vehicle, imageFiles) {
  const formData = new FormData()
  const fields = ['stockNumber', 'year', 'make', 'model', 'trim', 'price', 'mileage', 'fuel', 'transmission', 'engine', 'drive', 'bodyType', 'status', 'condition', 'exteriorColor', 'interiorColor', 'description']

  fields.forEach((field) => formData.append(field, vehicle[field] ?? ''))
  formData.set('status', STATUS_VALUES.has(vehicle.status) ? vehicle.status : 'USED')
  formData.set('condition', CONDITION_VALUES.has(vehicle.condition) ? vehicle.condition : 'JAPAN_IMPORT')
  formData.set('available', vehicle.available === true ? 'true' : 'false')
  vehicle.features?.filter(Boolean).forEach((feature) => formData.append('features', feature))
  imageFiles.forEach((file) => formData.append('images', file))
  return formData
}

export async function createVehicle(vehicle, imageFiles) {
  return request('/api/vehicles', {
    method: 'POST',
    body: buildVehicleFormData(vehicle, imageFiles),
  })
}

export async function updateVehicle(id, vehicle) {
  const payload = {
    stockNumber: vehicle.stockNumber,
    year: Number(vehicle.year),
    make: vehicle.make,
    model: vehicle.model,
    trim: vehicle.trim || null,
    price: Number(vehicle.price),
    mileage: Number(vehicle.mileage),
    fuel: vehicle.fuel,
    transmission: vehicle.transmission,
    engine: vehicle.engine,
    drive: vehicle.drive,
    bodyType: vehicle.bodyType,
    status: STATUS_VALUES.has(vehicle.status) ? vehicle.status : 'USED',
    condition: CONDITION_VALUES.has(vehicle.condition) ? vehicle.condition : 'JAPAN_IMPORT',
    exteriorColor: vehicle.exteriorColor,
    interiorColor: vehicle.interiorColor,
    description: vehicle.description,
    features: vehicle.features?.filter(Boolean) || [],
    available: vehicle.available === true,
  }

  return request(`/api/vehicles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function updateVehicleAvailability(id, available) {
  return request(`/api/vehicles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ available }),
  })
}

export async function deleteVehicle(id) {
  return request(`/api/vehicles/${id}`, { method: 'DELETE' })
}