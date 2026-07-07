/**
 * Riri Cars Backend API client.
 * Base URL is configurable via VITE_API_BASE_URL so it can point at
 * localhost during development or the deployed backend in production.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// Backend enums (FuelType, DriveType, VehicleCondition, VehicleStatus) are
// mapped to the display strings the UI components already render.
const FUEL_LABELS = { PETROL: 'Petrol', DIESEL: 'Diesel', HYBRID: 'Hybrid', ELECTRIC: 'Electric' }
const DRIVE_LABELS = { TWO_WD: '2WD', FOUR_WD: '4WD', AWD: 'AWD' }
const CONDITION_LABELS = { JAPAN_IMPORT: 'Japan Import', LOCAL_USED: 'Local Used', BRAND_NEW: 'Brand New' }
const STATUS_LABELS = { NEW: 'New', USED: 'Used', CERTIFIED_PRE_OWNED: 'Certified Pre-Owned' }

function mapVehicle(vehicle) {
  return {
    ...vehicle,
    fuel: FUEL_LABELS[vehicle.fuel] || vehicle.fuel,
    drive: DRIVE_LABELS[vehicle.drive] || vehicle.drive,
    condition: CONDITION_LABELS[vehicle.condition] || vehicle.condition,
    status: STATUS_LABELS[vehicle.status] || vehicle.status,
  }
}

async function request(path) {
  const res = await fetch(`${API_BASE_URL}${path}`)
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`)
  }
  return res.json()
}

export async function fetchVehicles({ page = 1, pageSize = 100 } = {}) {
  const json = await request(`/api/vehicles?page=${page}&pageSize=${pageSize}`)
  const list = Array.isArray(json) ? json : json.data ?? []
  return list.map(mapVehicle)
}

export async function fetchVehicleById(id) {
  const json = await request(`/api/vehicles/${id}`)
  const vehicle = json?.data ?? json
  return mapVehicle(vehicle)
}

export async function fetchRecentlySold(limit = 10) {
  const json = await request(`/api/recently-sold?limit=${limit}`)
  const list = Array.isArray(json) ? json : json.data ?? []
  return list
}
