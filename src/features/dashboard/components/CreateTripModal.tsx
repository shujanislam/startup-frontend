import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import {
  type ApiHotel,
  type ApiPackage,
  type ApiVehicle,
  type CreatePackagePayload,
  type DraftHotelPayload,
  type DraftPackagePayload,
  type DraftVehiclePayload,
} from '../services/packageApi.ts'
import type { SeasonType } from '../types/trip.ts'

interface CreateTripModalProps {
  open: boolean
  initialPackage?: ApiPackage | null
  isSavingDraft: boolean
  isSubmitting: boolean
  errorMessage: string | null
  onClose: () => void
  onSaveDraft: (payload: DraftPackagePayload, packageId?: string) => Promise<ApiPackage>
  onSubmit: (payload: CreatePackagePayload, packageId?: string) => Promise<void>
}

interface CreateTripFormState {
  name: string
  description: string
  coverImage: string
  season: '' | Exclude<SeasonType, 'all'>
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

type FieldErrors = Record<string, string>

const DEFAULT_FORM_STATE: CreateTripFormState = {
  name: '',
  description: '',
  coverImage: '',
  season: '',
  budget: '',
  destination: '',
  spots: '',
  duration: '',
  startDate: '',
  endDate: '',
  identification: false,
  permit: '',
  tags: '',
  affiliateLinks: '',
  additional: '',
  hotels: [],
  vehicles: [],
}

const seasonOptions: Array<Exclude<SeasonType, 'all'>> = ['summer', 'winter', 'monsoon', 'autumn']

const inputClassName =
  'w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500'
const labelClassName = 'mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'
const sectionClassName =
  'rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]'

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

const parseListInput = (value: string): string[] =>
  value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)

const formatListInput = (value?: string[]) => (value ?? []).join('\n')

const formatOptionalNumber = (value?: number) =>
  typeof value === 'number' && Number.isFinite(value) && value > 0 ? String(value) : ''

const parseOptionalNumber = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : undefined
}

const formatDateInput = (value?: string) => (value ? value.slice(0, 10) : '')

const isApiHotel = (hotel: ApiHotel | string): hotel is ApiHotel => typeof hotel !== 'string'
const isApiVehicle = (vehicle: ApiVehicle | string): vehicle is ApiVehicle => typeof vehicle !== 'string'

const hasHotelValue = (hotel: HotelFormState) =>
  [hotel.name, hotel.phoneNumber, hotel.address, hotel.photos, hotel.budget].some(
    (value) => value.trim().length > 0,
  )

const hasVehicleValue = (vehicle: VehicleFormState) =>
  [
    vehicle.car,
    vehicle.carNumber,
    vehicle.driverName,
    vehicle.driverPhoneNumber,
    vehicle.vehicleType,
    vehicle.budget,
  ].some((value) => value.trim().length > 0)

const hasPackageValue = (state: CreateTripFormState) =>
  [
    state.name,
    state.description,
    state.coverImage,
    state.season,
    state.budget,
    state.destination,
    state.spots,
    state.duration,
    state.startDate,
    state.endDate,
    state.permit,
    state.tags,
    state.affiliateLinks,
    state.additional,
  ].some((value) => value.trim().length > 0) ||
  state.identification ||
  state.hotels.some(hasHotelValue) ||
  state.vehicles.some(hasVehicleValue)

const formatSeasonLabel = (season: Exclude<SeasonType, 'all'>) =>
  season.charAt(0).toUpperCase() + season.slice(1)

const normalizeDraftHotel = (hotel: DraftHotelPayload): HotelFormState => ({
  name: hotel.name ?? '',
  phoneNumber: hotel.phoneNumber ?? '',
  address: hotel.address ?? '',
  photos: formatListInput(hotel.photos),
  budget: formatOptionalNumber(hotel.budget),
})

const normalizeDraftVehicle = (vehicle: DraftVehiclePayload): VehicleFormState => ({
  car: vehicle.car ?? '',
  carNumber: vehicle.carNumber ?? '',
  driverName: vehicle.driverName ?? '',
  driverPhoneNumber: vehicle.driverPhoneNumber ?? '',
  vehicleType: vehicle.vehicleType ?? '',
  budget: formatOptionalNumber(vehicle.budget),
})

const buildFormState = (pkg?: ApiPackage | null): CreateTripFormState => {
  if (!pkg) {
    return DEFAULT_FORM_STATE
  }

  const draftHotels =
    pkg.draftHotels && pkg.draftHotels.length > 0
      ? pkg.draftHotels.map(normalizeDraftHotel)
      : (pkg.hotels ?? [])
          .filter(isApiHotel)
          .map((hotel) => ({
            name: hotel.name ?? '',
            phoneNumber: hotel.phoneNumber ?? '',
            address: hotel.address ?? '',
            photos: formatListInput(hotel.photos),
            budget: formatOptionalNumber(hotel.budget),
          }))

  const draftVehicles =
    pkg.draftVehicles && pkg.draftVehicles.length > 0
      ? pkg.draftVehicles.map(normalizeDraftVehicle)
      : (pkg.vehicles ?? [])
          .filter(isApiVehicle)
          .map((vehicle) => ({
            car: vehicle.car ?? '',
            carNumber: vehicle.carNumber ?? '',
            driverName: vehicle.driverName ?? '',
            driverPhoneNumber: vehicle.driverPhoneNumber ?? '',
            vehicleType: vehicle.vehicleType ?? '',
            budget: formatOptionalNumber(vehicle.budget),
          }))

  return {
    name: pkg.name ?? '',
    description: pkg.description ?? '',
    coverImage: pkg.coverImage ?? '',
    season: seasonOptions.includes(pkg.season as Exclude<SeasonType, 'all'>)
      ? (pkg.season as Exclude<SeasonType, 'all'>)
      : '',
    budget: formatOptionalNumber(pkg.budget),
    destination: pkg.destination ?? '',
    spots: formatListInput(pkg.spots),
    duration: formatOptionalNumber(pkg.duration),
    startDate: formatDateInput(pkg.startDate),
    endDate: formatDateInput(pkg.endDate),
    identification: Boolean(pkg.identification),
    permit: pkg.permit ?? '',
    tags: formatListInput(pkg.tags),
    affiliateLinks: formatListInput(pkg.affiliateLinks),
    additional: pkg.additional ?? '',
    hotels: draftHotels,
    vehicles: draftVehicles,
  }
}

const ErrorText = ({ message }: { message?: string }) =>
  message ? <p className="mt-2 text-xs font-medium text-red-600">{message}</p> : null

const Section = ({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: ReactNode
}) => (
  <section className={sectionClassName}>
    <div className="mb-5 flex items-center gap-3">
      <span className="h-9 w-1.5 rounded-full bg-linear-to-b from-blue-600 via-cyan-500 to-emerald-500" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">{eyebrow}</p>
        <h3 className="mt-1 text-lg font-semibold text-slate-950">{title}</h3>
      </div>
    </div>
    {children}
  </section>
)

const CreateTripModal = ({
  open,
  initialPackage,
  isSavingDraft,
  isSubmitting,
  errorMessage,
  onClose,
  onSaveDraft,
  onSubmit,
}: CreateTripModalProps) => {
  const [formState, setFormState] = useState<CreateTripFormState>(DEFAULT_FORM_STATE)
  const [currentPackageId, setCurrentPackageId] = useState<string | undefined>()
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [localError, setLocalError] = useState<string | null>(null)
  const [localSuccess, setLocalSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setFormState(buildFormState(initialPackage))
      setCurrentPackageId(initialPackage?._id)
      setFieldErrors({})
      setLocalError(null)
      setLocalSuccess(null)
    }
  }, [initialPackage, open])

  const requiredProgress = useMemo(() => {
    const checks = [
      formState.name.trim(),
      formState.description.trim(),
      formState.coverImage.trim(),
      formState.season,
      formState.budget.trim(),
      formState.destination.trim(),
      formState.duration.trim(),
      formState.startDate.trim(),
      formState.endDate.trim(),
      formState.permit.trim(),
    ]
    const completed = checks.filter(Boolean).length
    return Math.round((completed / checks.length) * 100)
  }, [formState])

  if (!open) {
    return null
  }

  const isBusy = isSavingDraft || isSubmitting
  const isEditingDraft = Boolean(currentPackageId)

  const handleChange = <K extends keyof CreateTripFormState>(
    key: K,
    value: CreateTripFormState[K],
  ) => {
    setFormState((current) => ({
      ...current,
      [key]: value,
    }))
    setLocalSuccess(null)
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
    setLocalSuccess(null)
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
    setLocalSuccess(null)
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

  const validateSharedFields = (errors: FieldErrors, allowMissing: boolean) => {
    const budget = parseOptionalNumber(formState.budget)
    const duration = parseOptionalNumber(formState.duration)

    if (formState.budget.trim() && budget === undefined) {
      errors.budget = 'Budget must be a valid number.'
    }

    if (budget !== undefined && budget < 0) {
      errors.budget = 'Budget must be zero or greater.'
    }

    if (formState.duration.trim() && duration === undefined) {
      errors.duration = 'Duration must be a valid number.'
    }

    if (duration !== undefined && duration < 1) {
      errors.duration = 'Duration must be at least 1 day.'
    }

    if (formState.startDate && formState.endDate && formState.endDate < formState.startDate) {
      errors.endDate = 'End date cannot be earlier than the start date.'
    }

    formState.hotels.forEach((hotel, index) => {
      if (!hasHotelValue(hotel)) return

      const hotelBudget = parseOptionalNumber(hotel.budget)
      if (hotel.budget.trim() && hotelBudget === undefined) {
        errors[`hotel-${index}-budget`] = 'Budget must be a valid number.'
      }

      if (!allowMissing) {
        if (!hotel.name.trim()) errors[`hotel-${index}-name`] = 'Hotel name is required.'
        if (!hotel.phoneNumber.trim()) errors[`hotel-${index}-phoneNumber`] = 'Phone number is required.'
        if (!hotel.address.trim()) errors[`hotel-${index}-address`] = 'Address is required.'
        if (!hotel.budget.trim()) errors[`hotel-${index}-budget`] = 'Budget is required.'
      }
    })

    formState.vehicles.forEach((vehicle, index) => {
      if (!hasVehicleValue(vehicle)) return

      const vehicleBudget = parseOptionalNumber(vehicle.budget)
      if (vehicle.budget.trim() && vehicleBudget === undefined) {
        errors[`vehicle-${index}-budget`] = 'Budget must be a valid number.'
      }

      if (!allowMissing) {
        if (!vehicle.car.trim()) errors[`vehicle-${index}-car`] = 'Vehicle name is required.'
        if (!vehicle.carNumber.trim()) errors[`vehicle-${index}-carNumber`] = 'Car number is required.'
        if (!vehicle.driverPhoneNumber.trim()) {
          errors[`vehicle-${index}-driverPhoneNumber`] = 'Driver phone number is required.'
        }
        if (!vehicle.budget.trim()) errors[`vehicle-${index}-budget`] = 'Budget is required.'
      }
    })
  }

  const validateDraftSave = () => {
    const errors: FieldErrors = {}
    validateSharedFields(errors, true)

    if (!hasPackageValue(formState)) {
      setLocalError('Add at least one package detail before saving a draft.')
      setFieldErrors(errors)
      return false
    }

    setFieldErrors(errors)
    setLocalError(Object.keys(errors).length > 0 ? 'Please fix the highlighted values before saving.' : null)
    return Object.keys(errors).length === 0
  }

  const validateSubmit = () => {
    const errors: FieldErrors = {}

    if (!formState.name.trim()) errors.name = 'Trip name is required.'
    if (!formState.description.trim()) errors.description = 'Description is required.'
    if (!formState.coverImage.trim()) errors.coverImage = 'Cover image is required.'
    if (!formState.destination.trim()) errors.destination = 'Destination is required.'
    if (!formState.season) errors.season = 'Season is required.'
    if (!formState.budget.trim()) errors.budget = 'Budget is required.'
    if (!formState.duration.trim()) errors.duration = 'Duration is required.'
    if (!formState.startDate.trim()) errors.startDate = 'Start date is required.'
    if (!formState.endDate.trim()) errors.endDate = 'End date is required.'
    if (!formState.permit.trim()) errors.permit = 'Permit requirement is required.'

    validateSharedFields(errors, false)

    setFieldErrors(errors)
    setLocalError(
      Object.keys(errors).length > 0
        ? 'Complete the required fields before submitting for approval.'
        : null,
    )
    return Object.keys(errors).length === 0
  }

  const buildDraftHotels = (): DraftHotelPayload[] =>
    formState.hotels.filter(hasHotelValue).map((hotel) => ({
      name: hotel.name.trim(),
      phoneNumber: hotel.phoneNumber.trim(),
      address: hotel.address.trim(),
      photos: parseListInput(hotel.photos),
      budget: parseOptionalNumber(hotel.budget),
    }))

  const buildDraftVehicles = (): DraftVehiclePayload[] =>
    formState.vehicles.filter(hasVehicleValue).map((vehicle) => ({
      car: vehicle.car.trim(),
      carNumber: vehicle.carNumber.trim(),
      driverName: vehicle.driverName.trim(),
      driverPhoneNumber: vehicle.driverPhoneNumber.trim(),
      vehicleType: vehicle.vehicleType.trim(),
      budget: parseOptionalNumber(vehicle.budget),
    }))

  const buildDraftPayload = (): DraftPackagePayload => ({
    name: formState.name.trim(),
    description: formState.description.trim(),
    coverImage: formState.coverImage.trim(),
    season: formState.season,
    budget: parseOptionalNumber(formState.budget) ?? 0,
    destination: formState.destination.trim(),
    spots: parseListInput(formState.spots),
    duration: parseOptionalNumber(formState.duration) ?? 0,
    startDate: formState.startDate,
    endDate: formState.endDate,
    identification: formState.identification,
    permit: formState.permit.trim(),
    tags: parseListInput(formState.tags),
    affiliateLinks: parseListInput(formState.affiliateLinks),
    additional: formState.additional.trim(),
    draftHotels: buildDraftHotels(),
    draftVehicles: buildDraftVehicles(),
  })

  const buildSubmitPayload = (): CreatePackagePayload => ({
    name: formState.name.trim(),
    description: formState.description.trim(),
    coverImage: formState.coverImage.trim(),
    season: formState.season,
    budget: Number(formState.budget),
    destination: formState.destination.trim(),
    spots: parseListInput(formState.spots),
    duration: Number(formState.duration),
    startDate: formState.startDate,
    endDate: formState.endDate,
    identification: formState.identification,
    permit: formState.permit.trim(),
    tags: parseListInput(formState.tags),
    affiliateLinks: parseListInput(formState.affiliateLinks),
    additional: formState.additional.trim() || undefined,
    hotels: [],
    vehicles: [],
    draftHotels: buildDraftHotels(),
    draftVehicles: buildDraftVehicles(),
  })

  const handleSaveDraft = async () => {
    setLocalSuccess(null)
    setLocalError(null)

    if (!validateDraftSave()) {
      return
    }

    try {
      const savedPackage = await onSaveDraft(buildDraftPayload(), currentPackageId)
      setCurrentPackageId(savedPackage._id)
      setLocalSuccess('Draft saved. You can keep editing or come back later.')
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Failed to save draft.')
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocalSuccess(null)
    setLocalError(null)

    if (!validateSubmit()) {
      return
    }

    try {
      await onSubmit(buildSubmitPayload(), currentPackageId)
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Failed to submit package.')
    }
  }

  const statusLabel = isEditingDraft ? 'Draft in progress' : 'New package'

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/60 px-3 py-5 backdrop-blur-md sm:px-5"
      onClick={(event) => {
        if (!isBusy && event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-4xl border border-white/80 bg-white/95 shadow-2xl">
        <div className="border-b border-slate-200/70 bg-linear-to-r from-white via-blue-50 to-amber-50 px-5 py-6 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                  {statusLabel}
                </span>
                <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-600">
                  {requiredProgress}% ready
                </span>
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950 sm:text-3xl font-display">
                Create a travel package
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Save a partial draft anytime, then submit the completed package when it is ready for admin review.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="self-start rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 lg:self-center"
            >
              Close
            </button>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/80">
            <div
              className="h-full rounded-full bg-linear-to-r from-blue-600 via-cyan-500 to-emerald-500 transition-all"
              style={{ width: `${requiredProgress}%` }}
            />
          </div>
        </div>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden border-r border-slate-200/70 bg-linear-to-b from-white to-slate-50 p-5 lg:block">
            <div className="space-y-3">
              {[
                ['01', 'Essentials', 'Name, destination, story'],
                ['02', 'Dates', 'Budget and schedule'],
                ['03', 'Details', 'Spots, tags, links'],
                ['04', 'Logistics', 'Hotels and vehicles'],
                ['05', 'Review', 'Draft or approval'],
              ].map(([number, title, subtitle]) => (
                <div key={number} className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-950 text-xs font-bold text-white shadow-sm">
                      {number}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{title}</p>
                      <p className="text-xs text-slate-500">{subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <form onSubmit={handleSubmit} noValidate className="min-h-0 overflow-y-auto px-4 py-6 sm:px-6">
            <div className="space-y-5">
              <Section eyebrow="Essentials" title="Give travelers a clear first impression">
                <div className="grid gap-4 md:grid-cols-2">
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
                      disabled={isBusy}
                    />
                    <ErrorText message={fieldErrors.name} />
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
                      disabled={isBusy}
                    />
                    <ErrorText message={fieldErrors.description} />
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
                      disabled={isBusy}
                    />
                    <ErrorText message={fieldErrors.coverImage} />
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
                      disabled={isBusy}
                    />
                    <ErrorText message={fieldErrors.destination} />
                  </div>
                </div>
              </Section>

              <Section eyebrow="Dates and Budget" title="Set the commercial basics">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="trip-season" className={labelClassName}>
                      Season
                    </label>
                    <select
                      id="trip-season"
                      className={inputClassName}
                      value={formState.season}
                      onChange={(event) =>
                        handleChange('season', event.target.value as CreateTripFormState['season'])
                      }
                      disabled={isBusy}
                    >
                      <option value="">Choose season</option>
                      {seasonOptions.map((season) => (
                        <option key={season} value={season}>
                          {formatSeasonLabel(season)}
                        </option>
                      ))}
                    </select>
                    <ErrorText message={fieldErrors.season} />
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
                      disabled={isBusy}
                    />
                    <ErrorText message={fieldErrors.budget} />
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
                      disabled={isBusy}
                    />
                    <ErrorText message={fieldErrors.duration} />
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
                      disabled={isBusy}
                    />
                    <ErrorText message={fieldErrors.permit} />
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
                      disabled={isBusy}
                    />
                    <ErrorText message={fieldErrors.startDate} />
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
                      disabled={isBusy}
                    />
                    <ErrorText message={fieldErrors.endDate} />
                  </div>

                  <label className="flex items-center rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 md:col-span-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={formState.identification}
                      onChange={(event) => handleChange('identification', event.target.checked)}
                      disabled={isBusy}
                    />
                    <span className="ml-3 text-sm font-semibold text-slate-700">
                      Travelers must carry identification
                    </span>
                  </label>
                </div>
              </Section>

              <Section eyebrow="Trip Details" title="Add activities, labels, and links">
                <div className="grid gap-4 md:grid-cols-2">
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
                      disabled={isBusy}
                    />
                    <p className="mt-2 text-xs text-slate-500">Use commas or new lines to separate spots.</p>
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
                      disabled={isBusy}
                    />
                    <p className="mt-2 text-xs text-slate-500">Use commas or new lines to separate tags.</p>
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
                      disabled={isBusy}
                    />
                    <p className="mt-2 text-xs text-slate-500">Use commas or new lines to separate links.</p>
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
                      disabled={isBusy}
                    />
                  </div>
                </div>
              </Section>

              <Section eyebrow="Logistics" title="Keep accommodations and transport organized">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">Hotels</p>
                        <p className="mt-1 text-xs text-slate-500">Optional while drafting, complete when submitted.</p>
                      </div>
                      <button
                        type="button"
                        onClick={addHotel}
                        disabled={isBusy}
                        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Add hotel
                      </button>
                    </div>

                    {formState.hotels.length === 0 && (
                      <p className="mt-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                        Add hotels if this package includes accommodations.
                      </p>
                    )}

                    {formState.hotels.map((hotel, index) => (
                      <div key={`hotel-${index}`} className="mt-4 rounded-3xl border border-slate-200/80 bg-slate-50/80 p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-800">Hotel {index + 1}</p>
                          <button
                            type="button"
                            onClick={() => removeHotel(index)}
                            disabled={isBusy}
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
                              disabled={isBusy}
                            />
                            <ErrorText message={fieldErrors[`hotel-${index}-name`]} />
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
                              disabled={isBusy}
                            />
                            <ErrorText message={fieldErrors[`hotel-${index}-phoneNumber`]} />
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
                              disabled={isBusy}
                            />
                            <ErrorText message={fieldErrors[`hotel-${index}-budget`]} />
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
                              disabled={isBusy}
                            />
                            <ErrorText message={fieldErrors[`hotel-${index}-address`]} />
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
                              disabled={isBusy}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-6">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">Vehicles</p>
                        <p className="mt-1 text-xs text-slate-500">Optional while drafting, complete when submitted.</p>
                      </div>
                      <button
                        type="button"
                        onClick={addVehicle}
                        disabled={isBusy}
                        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Add vehicle
                      </button>
                    </div>

                    {formState.vehicles.length === 0 && (
                      <p className="mt-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                        Add vehicles if transport is included in the package.
                      </p>
                    )}

                    {formState.vehicles.map((vehicle, index) => (
                      <div key={`vehicle-${index}`} className="mt-4 rounded-3xl border border-slate-200/80 bg-slate-50/80 p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-800">Vehicle {index + 1}</p>
                          <button
                            type="button"
                            onClick={() => removeVehicle(index)}
                            disabled={isBusy}
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
                              disabled={isBusy}
                            />
                            <ErrorText message={fieldErrors[`vehicle-${index}-car`]} />
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
                              disabled={isBusy}
                            />
                            <ErrorText message={fieldErrors[`vehicle-${index}-carNumber`]} />
                          </div>

                          <div>
                            <label htmlFor={`vehicle-driver-${index}`} className={labelClassName}>
                              Driver name
                            </label>
                            <input
                              id={`vehicle-driver-${index}`}
                              className={inputClassName}
                              value={vehicle.driverName}
                              onChange={(event) => handleVehicleChange(index, 'driverName', event.target.value)}
                              placeholder="Ravi"
                              disabled={isBusy}
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
                              disabled={isBusy}
                            />
                            <ErrorText message={fieldErrors[`vehicle-${index}-driverPhoneNumber`]} />
                          </div>

                          <div>
                            <label htmlFor={`vehicle-type-${index}`} className={labelClassName}>
                              Vehicle type
                            </label>
                            <input
                              id={`vehicle-type-${index}`}
                              className={inputClassName}
                              value={vehicle.vehicleType}
                              onChange={(event) => handleVehicleChange(index, 'vehicleType', event.target.value)}
                              placeholder="SUV"
                              disabled={isBusy}
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
                              disabled={isBusy}
                            />
                            <ErrorText message={fieldErrors[`vehicle-${index}-budget`]} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>

              {(localError || errorMessage || localSuccess) && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                    localSuccess && !localError && !errorMessage
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-red-200 bg-red-50 text-red-700'
                  }`}
                >
                  {localError || errorMessage || localSuccess}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 -mx-4 mt-6 border-t border-slate-200/70 bg-white/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  Drafts can be incomplete. Approval submission checks all required fields.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isBusy}
                    className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSavingDraft ? 'Saving draft...' : 'Save as Draft'}
                  </button>
                  <button
                    type="submit"
                    disabled={isBusy}
                    className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(37,99,235,0.24)] transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export { CreateTripModal }
