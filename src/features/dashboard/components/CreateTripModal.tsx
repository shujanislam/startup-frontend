import { useEffect, useState } from 'react'
import {
  createHotel,
  createVehicle,
  type CreateHotelPayload,
  type CreatePackagePayload,
  type CreateVehiclePayload,
} from '../services/packageApi.ts'
import type { SeasonType } from '../types/trip.ts'

interface CreateTripModalProps {
  open: boolean
  isSubmitting: boolean
  errorMessage: string | null
  onClose: () => void
  onSubmit: (payload: CreatePackagePayload) => Promise<void>
}

interface CreateTripFormState {
  name: string
  description: string
  coverImage: string
  season: Exclude<SeasonType, 'all'>
  budget: string
  destination: string
  spots: string
  duration: string
  startDate: string
  endDate: string
  identification: boolean
  permit: string
  tags: string
  affiliateLinks: string
  additional: string
  hotels: HotelFormState[]
  vehicles: VehicleFormState[]
}

interface HotelFormState {
  name: string
  phoneNumber: string
  address: string
  photos: string
  budget: string
}

interface VehicleFormState {
  car: string
  carNumber: string
  driverName: string
  driverPhoneNumber: string
  vehicleType: string
  budget: string
}

const DEFAULT_FORM_STATE: CreateTripFormState = {
  name: '',
  description: '',
  coverImage: '',
  season: 'summer',
  budget: '',
  destination: '',
  spots: '',
  duration: '',
  startDate: '',
  endDate: '',
  identification: false,
  permit: 'None',
  tags: '',
  affiliateLinks: '',
  additional: '',
  hotels: [],
  vehicles: [],
}

const createEmptyHotel = (): HotelFormState => ({
  name: '',
  phoneNumber: '',
  address: '',
  photos: '',
  budget: '',
})

const createEmptyVehicle = (): VehicleFormState => ({
  car: '',
  carNumber: '',
  driverName: '',
  driverPhoneNumber: '',
  vehicleType: '',
  budget: '',
})

const seasonOptions: Array<Exclude<SeasonType, 'all'>> = ['summer', 'winter', 'monsoon', 'autumn']

const parseListInput = (value: string): string[] =>
  value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)

const formatSeasonLabel = (season: Exclude<SeasonType, 'all'>) =>
  season.charAt(0).toUpperCase() + season.slice(1)

const CreateTripModal = ({
  open,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: CreateTripModalProps) => {
  const [formState, setFormState] = useState<CreateTripFormState>(DEFAULT_FORM_STATE)
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setFormState(DEFAULT_FORM_STATE)
      setLocalError(null)
    }
  }, [open])

  if (!open) {
    return null
  }

  const inputClassName =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
  const labelClassName = 'mb-2 block text-sm font-semibold text-gray-700'

  const handleChange = <K extends keyof CreateTripFormState>(
    key: K,
    value: CreateTripFormState[K],
  ) => {
    setFormState((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const handleHotelChange = (
    index: number,
    key: keyof HotelFormState,
    value: string,
  ) => {
    setFormState((current) => {
      const hotels = [...current.hotels]
      hotels[index] = { ...hotels[index], [key]: value }
      return { ...current, hotels }
    })
  }

  const handleVehicleChange = (
    index: number,
    key: keyof VehicleFormState,
    value: string,
  ) => {
    setFormState((current) => {
      const vehicles = [...current.vehicles]
      vehicles[index] = { ...vehicles[index], [key]: value }
      return { ...current, vehicles }
    })
  }

  const addHotel = () => {
    setFormState((current) => ({
      ...current,
      hotels: [...current.hotels, createEmptyHotel()],
    }))
  }

  const removeHotel = (index: number) => {
    setFormState((current) => ({
      ...current,
      hotels: current.hotels.filter((_, idx) => idx !== index),
    }))
  }

  const addVehicle = () => {
    setFormState((current) => ({
      ...current,
      vehicles: [...current.vehicles, createEmptyVehicle()],
    }))
  }

  const removeVehicle = (index: number) => {
    setFormState((current) => ({
      ...current,
      vehicles: current.vehicles.filter((_, idx) => idx !== index),
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocalError(null)

    const budget = Number(formState.budget)
    const duration = Number(formState.duration)

    if (!Number.isFinite(budget) || budget < 0) {
      setLocalError('Budget must be zero or greater.')
      return
    }

    if (!Number.isFinite(duration) || duration < 1) {
      setLocalError('Duration must be at least 1 day.')
      return
    }

    if (formState.endDate < formState.startDate) {
      setLocalError('End date cannot be earlier than the start date.')
      return
    }

    const hasHotelValue = (hotel: HotelFormState) =>
      [
        hotel.name,
        hotel.phoneNumber,
        hotel.address,
        hotel.photos,
        hotel.budget,
      ].some((value) => value.trim().length > 0)

    const hasVehicleValue = (vehicle: VehicleFormState) =>
      [
        vehicle.car,
        vehicle.carNumber,
        vehicle.driverName,
        vehicle.driverPhoneNumber,
        vehicle.vehicleType,
        vehicle.budget,
      ].some((value) => value.trim().length > 0)

    const hotelPayloads: CreateHotelPayload[] = []
    const hotelsToCreate = formState.hotels.filter(hasHotelValue)

    for (let i = 0; i < hotelsToCreate.length; i += 1) {
      const hotel = hotelsToCreate[i]
      const name = hotel.name.trim()
      const phoneNumber = hotel.phoneNumber.trim()
      const address = hotel.address.trim()
      const budgetValue = Number(hotel.budget)

      if (!name) {
        setLocalError(`Hotel ${i + 1}: name is required.`)
        return
      }

      if (!phoneNumber) {
        setLocalError(`Hotel ${i + 1}: phone number is required.`)
        return
      }

      if (!address) {
        setLocalError(`Hotel ${i + 1}: address is required.`)
        return
      }

      if (!Number.isFinite(budgetValue) || budgetValue < 0) {
        setLocalError(`Hotel ${i + 1}: budget must be zero or greater.`)
        return
      }

      hotelPayloads.push({
        name,
        phoneNumber,
        address,
        photos: parseListInput(hotel.photos),
        budget: budgetValue,
      })
    }

    const vehiclePayloads: CreateVehiclePayload[] = []
    const vehiclesToCreate = formState.vehicles.filter(hasVehicleValue)

    for (let i = 0; i < vehiclesToCreate.length; i += 1) {
      const vehicle = vehiclesToCreate[i]
      const car = vehicle.car.trim()
      const carNumber = vehicle.carNumber.trim()
      const driverName = vehicle.driverName.trim()
      const driverPhoneNumber = vehicle.driverPhoneNumber.trim()
      const vehicleType = vehicle.vehicleType.trim()
      const budgetValue = Number(vehicle.budget)

      if (!car) {
        setLocalError(`Vehicle ${i + 1}: name is required.`)
        return
      }

      if (!carNumber) {
        setLocalError(`Vehicle ${i + 1}: car number is required.`)
        return
      }

      if (!driverPhoneNumber) {
        setLocalError(`Vehicle ${i + 1}: driver phone number is required.`)
        return
      }

      if (!Number.isFinite(budgetValue) || budgetValue < 0) {
        setLocalError(`Vehicle ${i + 1}: budget must be zero or greater.`)
        return
      }

      vehiclePayloads.push({
        car,
        carNumber,
        driverName: driverName || undefined,
        driverPhoneNumber,
        vehicleType: vehicleType || undefined,
        budget: budgetValue,
      })
    }

    let hotelIds: string[] = []
    let vehicleIds: string[] = []

    try {
      if (hotelPayloads.length > 0) {
        const createdHotels = await Promise.all(
          hotelPayloads.map((payload) => createHotel(payload))
        )
        hotelIds = createdHotels.map((hotel) => hotel._id)
      }

      if (vehiclePayloads.length > 0) {
        const createdVehicles = await Promise.all(
          vehiclePayloads.map((payload) => createVehicle(payload))
        )
        vehicleIds = createdVehicles.map((vehicle) => vehicle._id)
      }
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Failed to save hotel or vehicle details.')
      return
    }

    await onSubmit({
      name: formState.name.trim(),
      description: formState.description.trim(),
      coverImage: formState.coverImage.trim(),
      season: formState.season,
      budget,
      destination: formState.destination.trim(),
      spots: parseListInput(formState.spots),
      duration,
      startDate: formState.startDate,
      endDate: formState.endDate,
      identification: formState.identification,
      permit: formState.permit.trim(),
      tags: parseListInput(formState.tags),
      affiliateLinks: parseListInput(formState.affiliateLinks),
      additional: formState.additional.trim() || undefined,
      hotels: hotelIds,
      vehicles: vehicleIds,
    })
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm"
      onClick={(event) => {
        if (!isSubmitting && event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 px-6 py-5 text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
              Submit New Trip
            </p>
            <h2 className="mt-2 text-2xl font-bold">Create a package for review</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-200">
              Submitted trips stay hidden from the main catalog until an admin approves them.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full border border-white/20 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto px-6 py-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="trip-name" className={labelClassName}>
                Trip name
              </label>
              <input
                id="trip-name"
                className={inputClassName}
                value={formState.name}
                onChange={(event) => handleChange('name', event.target.value)}
                placeholder="Weekend in Coorg"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="trip-description" className={labelClassName}>
                Description
              </label>
              <textarea
                id="trip-description"
                className={`${inputClassName} min-h-28 resize-y`}
                value={formState.description}
                onChange={(event) => handleChange('description', event.target.value)}
                placeholder="What makes this trip worth booking?"
                required
              />
            </div>

            <div>
              <label htmlFor="trip-cover-image" className={labelClassName}>
                Cover image URL
              </label>
              <input
                id="trip-cover-image"
                type="url"
                className={inputClassName}
                value={formState.coverImage}
                onChange={(event) => handleChange('coverImage', event.target.value)}
                placeholder="https://example.com/cover.jpg"
                required
              />
            </div>

            <div>
              <label htmlFor="trip-destination" className={labelClassName}>
                Destination
              </label>
              <input
                id="trip-destination"
                className={inputClassName}
                value={formState.destination}
                onChange={(event) => handleChange('destination', event.target.value)}
                placeholder="Coorg"
                required
              />
            </div>

            <div>
              <label htmlFor="trip-season" className={labelClassName}>
                Season
              </label>
              <select
                id="trip-season"
                className={inputClassName}
                value={formState.season}
                onChange={(event) =>
                  handleChange('season', event.target.value as Exclude<SeasonType, 'all'>)
                }
              >
                {seasonOptions.map((season) => (
                  <option key={season} value={season}>
                    {formatSeasonLabel(season)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="trip-budget" className={labelClassName}>
                Budget
              </label>
              <input
                id="trip-budget"
                type="number"
                min="0"
                className={inputClassName}
                value={formState.budget}
                onChange={(event) => handleChange('budget', event.target.value)}
                placeholder="4500"
                required
              />
            </div>

            <div>
              <label htmlFor="trip-duration" className={labelClassName}>
                Duration (days)
              </label>
              <input
                id="trip-duration"
                type="number"
                min="1"
                className={inputClassName}
                value={formState.duration}
                onChange={(event) => handleChange('duration', event.target.value)}
                placeholder="3"
                required
              />
            </div>

            <div>
              <label htmlFor="trip-start-date" className={labelClassName}>
                Start date
              </label>
              <input
                id="trip-start-date"
                type="date"
                className={inputClassName}
                value={formState.startDate}
                onChange={(event) => handleChange('startDate', event.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="trip-end-date" className={labelClassName}>
                End date
              </label>
              <input
                id="trip-end-date"
                type="date"
                className={inputClassName}
                value={formState.endDate}
                onChange={(event) => handleChange('endDate', event.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="trip-permit" className={labelClassName}>
                Permit requirement
              </label>
              <input
                id="trip-permit"
                className={inputClassName}
                value={formState.permit}
                onChange={(event) => handleChange('permit', event.target.value)}
                placeholder="None"
                required
              />
            </div>

            <div className="flex items-center rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3">
              <input
                id="trip-identification"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={formState.identification}
                onChange={(event) => handleChange('identification', event.target.checked)}
              />
              <label htmlFor="trip-identification" className="ml-3 text-sm font-medium text-gray-700">
                Travelers must carry identification
              </label>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="trip-spots" className={labelClassName}>
                Spots
              </label>
              <textarea
                id="trip-spots"
                className={`${inputClassName} min-h-24 resize-y`}
                value={formState.spots}
                onChange={(event) => handleChange('spots', event.target.value)}
                placeholder="Dubare, Abbey Falls, Raja's Seat"
              />
              <p className="mt-2 text-xs text-gray-500">Use commas or new lines to separate spots.</p>
            </div>

            <div>
              <label htmlFor="trip-tags" className={labelClassName}>
                Tags
              </label>
              <textarea
                id="trip-tags"
                className={`${inputClassName} min-h-24 resize-y`}
                value={formState.tags}
                onChange={(event) => handleChange('tags', event.target.value)}
                placeholder="nature, weekend, road trip"
              />
              <p className="mt-2 text-xs text-gray-500">Use commas or new lines to separate tags.</p>
            </div>

            <div>
              <label htmlFor="trip-links" className={labelClassName}>
                Affiliate links
              </label>
              <textarea
                id="trip-links"
                className={`${inputClassName} min-h-24 resize-y`}
                value={formState.affiliateLinks}
                onChange={(event) => handleChange('affiliateLinks', event.target.value)}
                placeholder="https://example.com/book"
              />
              <p className="mt-2 text-xs text-gray-500">Use commas or new lines to separate links.</p>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between gap-4">
                <label className={labelClassName}>Hotels</label>
                <button
                  type="button"
                  onClick={addHotel}
                  disabled={isSubmitting}
                  className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Add hotel
                </button>
              </div>

              {formState.hotels.length === 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  Add hotels if this trip includes accommodations.
                </p>
              )}

              {formState.hotels.map((hotel, index) => (
                <div
                  key={`hotel-${index}`}
                  className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">Hotel {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeHotel(index)}
                      disabled={isSubmitting}
                      className="text-xs font-semibold text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor={`hotel-name-${index}`} className={labelClassName}>
                        Hotel name
                      </label>
                      <input
                        id={`hotel-name-${index}`}
                        className={inputClassName}
                        value={hotel.name}
                        onChange={(event) => handleHotelChange(index, 'name', event.target.value)}
                        placeholder="Lush Retreat"
                      />
                    </div>

                    <div>
                      <label htmlFor={`hotel-phone-${index}`} className={labelClassName}>
                        Phone number
                      </label>
                      <input
                        id={`hotel-phone-${index}`}
                        className={inputClassName}
                        value={hotel.phoneNumber}
                        onChange={(event) => handleHotelChange(index, 'phoneNumber', event.target.value)}
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div>
                      <label htmlFor={`hotel-budget-${index}`} className={labelClassName}>
                        Budget
                      </label>
                      <input
                        id={`hotel-budget-${index}`}
                        type="number"
                        min="0"
                        className={inputClassName}
                        value={hotel.budget}
                        onChange={(event) => handleHotelChange(index, 'budget', event.target.value)}
                        placeholder="3200"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor={`hotel-address-${index}`} className={labelClassName}>
                        Address
                      </label>
                      <input
                        id={`hotel-address-${index}`}
                        className={inputClassName}
                        value={hotel.address}
                        onChange={(event) => handleHotelChange(index, 'address', event.target.value)}
                        placeholder="Main Road, Coorg"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor={`hotel-photos-${index}`} className={labelClassName}>
                        Photo URLs
                      </label>
                      <textarea
                        id={`hotel-photos-${index}`}
                        className={`${inputClassName} min-h-20 resize-y`}
                        value={hotel.photos}
                        onChange={(event) => handleHotelChange(index, 'photos', event.target.value)}
                        placeholder="https://example.com/hotel.jpg"
                      />
                      <p className="mt-2 text-xs text-gray-500">Use commas or new lines to separate URLs.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between gap-4">
                <label className={labelClassName}>Vehicles</label>
                <button
                  type="button"
                  onClick={addVehicle}
                  disabled={isSubmitting}
                  className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Add vehicle
                </button>
              </div>

              {formState.vehicles.length === 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  Add vehicles if transport is included in the package.
                </p>
              )}

              {formState.vehicles.map((vehicle, index) => (
                <div
                  key={`vehicle-${index}`}
                  className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">Vehicle {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeVehicle(index)}
                      disabled={isSubmitting}
                      className="text-xs font-semibold text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor={`vehicle-name-${index}`} className={labelClassName}>
                        Vehicle name
                      </label>
                      <input
                        id={`vehicle-name-${index}`}
                        className={inputClassName}
                        value={vehicle.car}
                        onChange={(event) => handleVehicleChange(index, 'car', event.target.value)}
                        placeholder="Innova"
                      />
                    </div>

                    <div>
                      <label htmlFor={`vehicle-number-${index}`} className={labelClassName}>
                        Car number
                      </label>
                      <input
                        id={`vehicle-number-${index}`}
                        className={inputClassName}
                        value={vehicle.carNumber}
                        onChange={(event) => handleVehicleChange(index, 'carNumber', event.target.value)}
                        placeholder="KA 01 AB 1234"
                      />
                    </div>

                    <div>
                      <label htmlFor={`vehicle-driver-${index}`} className={labelClassName}>
                        Driver name (optional)
                      </label>
                      <input
                        id={`vehicle-driver-${index}`}
                        className={inputClassName}
                        value={vehicle.driverName}
                        onChange={(event) => handleVehicleChange(index, 'driverName', event.target.value)}
                        placeholder="Ravi"
                      />
                    </div>

                    <div>
                      <label htmlFor={`vehicle-driver-phone-${index}`} className={labelClassName}>
                        Driver phone number
                      </label>
                      <input
                        id={`vehicle-driver-phone-${index}`}
                        className={inputClassName}
                        value={vehicle.driverPhoneNumber}
                        onChange={(event) => handleVehicleChange(index, 'driverPhoneNumber', event.target.value)}
                        placeholder="+91 90000 00000"
                      />
                    </div>

                    <div>
                      <label htmlFor={`vehicle-type-${index}`} className={labelClassName}>
                        Vehicle type (optional)
                      </label>
                      <input
                        id={`vehicle-type-${index}`}
                        className={inputClassName}
                        value={vehicle.vehicleType}
                        onChange={(event) => handleVehicleChange(index, 'vehicleType', event.target.value)}
                        placeholder="SUV"
                      />
                    </div>

                    <div>
                      <label htmlFor={`vehicle-budget-${index}`} className={labelClassName}>
                        Budget
                      </label>
                      <input
                        id={`vehicle-budget-${index}`}
                        type="number"
                        min="0"
                        className={inputClassName}
                        value={vehicle.budget}
                        onChange={(event) => handleVehicleChange(index, 'budget', event.target.value)}
                        placeholder="1800"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="trip-additional" className={labelClassName}>
                Additional notes
              </label>
              <textarea
                id="trip-additional"
                className={`${inputClassName} min-h-28 resize-y`}
                value={formState.additional}
                onChange={(event) => handleChange('additional', event.target.value)}
                placeholder="Packing notes, travel caveats, or anything else travelers should know."
              />
            </div>
          </div>

          {(localError || errorMessage) && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {localError || errorMessage}
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Submitting...' : 'Submit for approval'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export { CreateTripModal }
