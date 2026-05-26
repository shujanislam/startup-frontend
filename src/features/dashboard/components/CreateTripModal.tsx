import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Car, Hotel, Info, X } from 'lucide-react'
import apiClient from '../../../lib/apiClient'
import {
  type ApiHotel,
  type ApiPackage,
  type ApiVehicle,
  type CreatePackagePayload,
  type DraftHotelPayload,
  type DraftPackagePayload,
  type DraftVehiclePayload,
  resolveHotelPhoto,
  resolvePackageCoverImage,
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
type WizardStep = 1 | 2 | 3

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
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500'
const labelClassName = 'mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600'

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
  message ? <p className="mt-1 text-xs font-medium text-red-600">{message}</p> : null

interface EntityModalProps {
  open: boolean
  title: string
  subtitle: string
  step: 1 | 2
  onClose: () => void
  children: ReactNode
  footer: ReactNode
}

const EntityModal = ({
  open,
  title,
  subtitle,
  step,
  onClose,
  children,
  footer,
}: EntityModalProps) => {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/60 px-3 py-5 backdrop-blur-md"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              Step {step} of 2
            </span>
          </div>
          <div className="mt-3 flex gap-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className={`h-1 flex-1 rounded-full ${item <= step ? 'bg-slate-900' : 'bg-slate-200'}`}
              />
            ))}
          </div>
        </div>
        <div className="px-5 py-5">{children}</div>
        <div className="border-t border-slate-200 bg-white px-5 py-4">{footer}</div>
      </div>
    </div>
  )
}

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
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [uploadImageError, setUploadImageError] = useState<string | null>(null)
  const [isUploadingHotelPhoto, setIsUploadingHotelPhoto] = useState(false)
  const [uploadHotelPhotoError, setUploadHotelPhotoError] = useState<string | null>(null)

  const [currentWizardStep, setCurrentWizardStep] = useState<WizardStep>(1)
  const [editingHotelIndex, setEditingHotelIndex] = useState<number | null>(null)
  const [editingVehicleIndex, setEditingVehicleIndex] = useState<number | null>(null)
  const [hotelModalOpen, setHotelModalOpen] = useState(false)
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false)
  const [hotelModalStep, setHotelModalStep] = useState<1 | 2>(1)
  const [vehicleModalStep, setVehicleModalStep] = useState<1 | 2>(1)
  const [hotelDraft, setHotelDraft] = useState<HotelFormState>(createEmptyHotel())
  const [vehicleDraft, setVehicleDraft] = useState<VehicleFormState>(createEmptyVehicle())

  useEffect(() => {
    if (open) {
      setFormState(buildFormState(initialPackage))
      setCurrentPackageId(initialPackage?._id)
      setFieldErrors({})
      setLocalError(null)
      setLocalSuccess(null)
      setCurrentWizardStep(1)
      setEditingHotelIndex(null)
      setEditingVehicleIndex(null)
      setHotelModalOpen(false)
      setVehicleModalOpen(false)
      setHotelModalStep(1)
      setVehicleModalStep(1)
      setHotelDraft(createEmptyHotel())
      setVehicleDraft(createEmptyVehicle())
      setIsUploadingHotelPhoto(false)
      setUploadHotelPhotoError(null)
    }
  }, [initialPackage, open])

  if (!open) {
    return null
  }

  const isBusy = isSavingDraft || isSubmitting
  const isEditingDraft = Boolean(currentPackageId)

  const handleCoverImageUpload = async (file: File) => {
    setIsUploadingImage(true)
    setUploadImageError(null)

    try {
      const formData = new FormData()
      if (formState.coverImage.trim()) {
        formData.append('previousCoverImage', formState.coverImage.trim())
      }
      formData.append('coverImage', file)

      const response = await apiClient.post<{
        success: boolean
        data: { imagePath?: string; imageUrl?: string }
      }>('/packages/upload-cover-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        const uploadedImage = response.data.data.imagePath || response.data.data.imageUrl || ''

        if (!uploadedImage) {
          throw new Error('Upload completed but image path is missing in response.')
        }

        setFormState((current) => ({
          ...current,
          coverImage: uploadedImage,
        }))
        setLocalSuccess('Image uploaded successfully!')
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Failed to upload image. Please try again.'
      setUploadImageError(errMsg)
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleChange = <K extends keyof CreateTripFormState>(key: K, value: CreateTripFormState[K]) => {
    setFormState((current) => ({
      ...current,
      [key]: value,
    }))
    setLocalSuccess(null)
  }

  const handleHotelPhotoUpload = async (file: File) => {
    setIsUploadingHotelPhoto(true)
    setUploadHotelPhotoError(null)

    try {
      const formData = new FormData()
      const previous = parseListInput(hotelDraft.photos)[0]
      if (previous) {
        formData.append('previousHotelPhoto', previous)
      }
      formData.append('hotelPhoto', file)

      const response = await apiClient.post<{
        success: boolean
        data: { imagePath?: string; imageUrl?: string }
      }>('/packages/upload-hotel-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        const uploadedImage = response.data.data.imagePath || response.data.data.imageUrl || ''

        if (!uploadedImage) {
          throw new Error('Upload completed but image path is missing in response.')
        }

        setHotelDraft((current) => ({
          ...current,
          photos: uploadedImage,
        }))
      }
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : 'Failed to upload hotel photo. Please try again.'
      setUploadHotelPhotoError(errMsg)
    } finally {
      setIsUploadingHotelPhoto(false)
    }
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

  const validateStep = (step: WizardStep): boolean => {
    const errors: FieldErrors = {}

    if (step === 1) {
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

      validateSharedFields(errors, true)
    }

    if (step === 2 || step === 3) {
      validateSharedFields(errors, true)
    }

    setFieldErrors(errors)
    setLocalError(Object.keys(errors).length > 0 ? 'Please fix the errors before proceeding.' : null)
    return Object.keys(errors).length === 0
  }

  const validateHotelDraftStep = (step: 1 | 2, draft: HotelFormState) => {
    const errors: FieldErrors = {}

    if (step === 1) {
      if (!draft.name.trim()) errors.hotelDraftName = 'Hotel name is required.'
      if (!draft.phoneNumber.trim()) errors.hotelDraftPhone = 'Phone number is required.'
      if (!draft.address.trim()) errors.hotelDraftAddress = 'Address is required.'
    }

    if (step === 2) {
      if (!draft.budget.trim()) {
        errors.hotelDraftBudget = 'Budget is required.'
      } else {
        const budget = parseOptionalNumber(draft.budget)
        if (budget === undefined) errors.hotelDraftBudget = 'Budget must be a valid number.'
        if (budget !== undefined && budget < 0) errors.hotelDraftBudget = 'Budget must be zero or greater.'
      }
    }

    setFieldErrors((current) => {
      const next = { ...current }
      delete next.hotelDraftName
      delete next.hotelDraftPhone
      delete next.hotelDraftAddress
      delete next.hotelDraftBudget
      return { ...next, ...errors }
    })

    return Object.keys(errors).length === 0
  }

  const validateVehicleDraftStep = (step: 1 | 2, draft: VehicleFormState) => {
    const errors: FieldErrors = {}

    if (step === 1) {
      if (!draft.car.trim()) errors.vehicleDraftCar = 'Vehicle name is required.'
      if (!draft.carNumber.trim()) errors.vehicleDraftNumber = 'Car number is required.'
      if (!draft.driverPhoneNumber.trim()) {
        errors.vehicleDraftDriverPhone = 'Driver phone number is required.'
      }
    }

    if (step === 2) {
      if (!draft.budget.trim()) {
        errors.vehicleDraftBudget = 'Budget is required.'
      } else {
        const budget = parseOptionalNumber(draft.budget)
        if (budget === undefined) errors.vehicleDraftBudget = 'Budget must be a valid number.'
        if (budget !== undefined && budget < 0) {
          errors.vehicleDraftBudget = 'Budget must be zero or greater.'
        }
      }
    }

    setFieldErrors((current) => {
      const next = { ...current }
      delete next.vehicleDraftCar
      delete next.vehicleDraftNumber
      delete next.vehicleDraftDriverPhone
      delete next.vehicleDraftBudget
      return { ...next, ...errors }
    })

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

  const handleNextStep = () => {
    if (validateStep(currentWizardStep) && currentWizardStep < 3) {
      setCurrentWizardStep((currentWizardStep + 1) as WizardStep)
      setLocalError(null)
    }
  }

  const handlePrevStep = () => {
    if (currentWizardStep > 1) {
      setCurrentWizardStep((currentWizardStep - 1) as WizardStep)
      setLocalError(null)
      setFieldErrors({})
    }
  }

  const handleAddHotel = () => {
    setEditingHotelIndex(null)
    setHotelDraft(createEmptyHotel())
    setHotelModalStep(1)
    setHotelModalOpen(true)
    setFieldErrors({})
    setLocalError(null)
    setUploadHotelPhotoError(null)
  }

  const handleEditHotel = (index: number) => {
    setEditingHotelIndex(index)
    setHotelDraft(formState.hotels[index] ?? createEmptyHotel())
    setHotelModalStep(1)
    setHotelModalOpen(true)
    setFieldErrors({})
    setLocalError(null)
    setUploadHotelPhotoError(null)
  }

  const handleCloseHotelModal = () => {
    setHotelModalOpen(false)
    setEditingHotelIndex(null)
    setHotelModalStep(1)
    setUploadHotelPhotoError(null)
  }

  const handleSaveHotel = () => {
    if (!validateHotelDraftStep(2, hotelDraft)) return

    if (editingHotelIndex !== null) {
      setFormState((current) => {
        const hotels = [...current.hotels]
        hotels[editingHotelIndex] = hotelDraft
        return { ...current, hotels }
      })
    } else {
      setFormState((current) => ({
        ...current,
        hotels: [...current.hotels, hotelDraft],
      }))
    }

    handleCloseHotelModal()
  }

  const handleAddVehicle = () => {
    setEditingVehicleIndex(null)
    setVehicleDraft(createEmptyVehicle())
    setVehicleModalStep(1)
    setVehicleModalOpen(true)
    setFieldErrors({})
    setLocalError(null)
  }

  const handleEditVehicle = (index: number) => {
    setEditingVehicleIndex(index)
    setVehicleDraft(formState.vehicles[index] ?? createEmptyVehicle())
    setVehicleModalStep(1)
    setVehicleModalOpen(true)
    setFieldErrors({})
    setLocalError(null)
  }

  const handleCloseVehicleModal = () => {
    setVehicleModalOpen(false)
    setEditingVehicleIndex(null)
    setVehicleModalStep(1)
  }

  const handleSaveVehicle = () => {
    if (!validateVehicleDraftStep(2, vehicleDraft)) return

    if (editingVehicleIndex !== null) {
      setFormState((current) => {
        const vehicles = [...current.vehicles]
        vehicles[editingVehicleIndex] = vehicleDraft
        return { ...current, vehicles }
      })
    } else {
      setFormState((current) => ({
        ...current,
        vehicles: [...current.vehicles, vehicleDraft],
      }))
    }

    handleCloseVehicleModal()
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
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/95 shadow-2xl">
        <div className="border-b border-slate-200/70 bg-white px-5 py-6 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Step {currentWizardStep} of 3
                </span>
                <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-600">
                  {statusLabel}
                </span>
                {/* <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-600"> */}
                {/*   {requiredProgress}% ready */}
                {/* </span> */}
              </div>

              <h2 className="mt-3 flex items-center gap-2 text-2xl font-semibold text-slate-950 sm:text-3xl font-display">
                {currentWizardStep === 1 && <Info className="h-5 w-5 text-slate-700" />}
                {currentWizardStep === 2 && <Hotel className="h-5 w-5 text-slate-700" />}
                {currentWizardStep === 3 && <Car className="h-5 w-5 text-slate-700" />}
                <span>
                  {currentWizardStep === 1 && 'Trip Information'}
                  {currentWizardStep === 2 && 'Hotels'}
                  {currentWizardStep === 3 && 'Vehicles'}
                </span>
              </h2>

              {/* <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600"> */}
              {/*   {currentWizardStep === 1 && 'Provide core trip details to continue.'} */}
              {/*   {currentWizardStep === 2 && 'Accommodations are managed as a separate entity.'} */}
              {/*   {currentWizardStep === 3 && 'Transportation is managed as a separate entity.'} */}
              {/* </p> */}
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="self-end rounded-full border border-slate-300 bg-white p-2 text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 lg:self-center"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 flex gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-1 flex-1 rounded-full transition ${
                  step <= currentWizardStep
                    ? 'bg-slate-900'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="min-h-0 overflow-y-auto px-4 pt-6 pb-28 sm:px-6">
          <div className="space-y-5">
            {currentWizardStep === 1 && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label htmlFor="trip-name" className={labelClassName}>
                    Trip name <span className="text-red-600">*</span>
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
                    Description <span className="text-red-600">*</span>
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
                    Cover image <span className="text-red-600">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="trip-cover-image"
                      type="file"
                      accept="image/*"
                      className={inputClassName}
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (file) {
                          handleCoverImageUpload(file)
                        }
                      }}
                      disabled={isBusy || isUploadingImage}
                    />
                    {formState.coverImage && (
                      <img
                        src={resolvePackageCoverImage(formState.coverImage)}
                        alt="Cover preview"
                        className="h-12 w-12 rounded-lg border border-slate-200 object-cover shadow-sm"
                      />
                    )}
                  </div>
                  {uploadImageError && <ErrorText message={uploadImageError} />}
                  {isUploadingImage && (
                    <p className="mt-2 text-xs font-medium text-slate-700">Uploading image...</p>
                  )}
                </div>

                <div>
                  <label htmlFor="trip-cover-image-url" className={labelClassName}>
                    Cover image URL (optional)
                  </label>
                  <input
                    id="trip-cover-image-url"
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
                    Destination <span className="text-red-600">*</span>
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

                <div>
                  <label htmlFor="trip-season" className={labelClassName}>
                    Season <span className="text-red-600">*</span>
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
                    Budget <span className="text-red-600">*</span>
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
                    Duration (days) <span className="text-red-600">*</span>
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
                    Permit requirement <span className="text-red-600">*</span>
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
                    Start date <span className="text-red-600">*</span>
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
                    End date <span className="text-red-600">*</span>
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

                <div className="md:col-span-2">
                  <label className="flex items-center rounded-lg border border-slate-300 bg-white px-4 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                      checked={formState.identification}
                      onChange={(event) => handleChange('identification', event.target.checked)}
                      disabled={isBusy}
                    />
                    <span className="ml-3 text-sm font-semibold text-slate-700">
                      Travelers must carry identification
                    </span>
                  </label>
                </div>
              </div>
            )}

            {currentWizardStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                      <Hotel className="h-4 w-4 text-slate-700" />
                      Accommodations
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Hotels are independent from trip information and vehicles.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddHotel}
                    disabled={isBusy}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    + Add hotel
                  </button>
                </div>

                {formState.hotels.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
                    <p className="text-sm text-slate-500">No hotels added yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {formState.hotels.map((hotel, index) => (
                      <div
                        key={`hotel-card-${index}`}
                        className="rounded-xl border border-slate-300 bg-white p-4"
                      >
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {hotel.name || `Hotel ${index + 1}`}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500">{hotel.address || 'No address'}</p>
                        <p className="mt-2 text-xs text-slate-600">
                          Budget: {hotel.budget ? `₹${hotel.budget}` : 'Not set'}
                        </p>

                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditHotel(index)}
                            disabled={isBusy}
                            className="flex-1 rounded-md border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-200 disabled:opacity-60"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setFormState((current) => ({
                                ...current,
                                hotels: current.hotels.filter((_, idx) => idx !== index),
                              }))
                            }
                            disabled={isBusy}
                            className="flex-1 rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                          >
                            Remove
                          </button>
                        </div>

                        <ErrorText message={fieldErrors[`hotel-${index}-name`]} />
                        <ErrorText message={fieldErrors[`hotel-${index}-phoneNumber`]} />
                        <ErrorText message={fieldErrors[`hotel-${index}-address`]} />
                        <ErrorText message={fieldErrors[`hotel-${index}-budget`]} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentWizardStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                      <Car className="h-4 w-4 text-slate-700" />
                      Transportation
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Vehicles are independent from trip information and hotels.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVehicle}
                    disabled={isBusy}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    + Add vehicle
                  </button>
                </div>

                {formState.vehicles.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
                    <p className="text-sm text-slate-500">No vehicles added yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {formState.vehicles.map((vehicle, index) => (
                      <div
                        key={`vehicle-card-${index}`}
                        className="rounded-xl border border-slate-300 bg-white p-4"
                      >
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {vehicle.car || `Vehicle ${index + 1}`}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {vehicle.carNumber || 'No car number'}
                        </p>
                        <p className="mt-2 text-xs text-slate-600">
                          Budget: {vehicle.budget ? `₹${vehicle.budget}` : 'Not set'}
                        </p>

                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditVehicle(index)}
                            disabled={isBusy}
                            className="flex-1 rounded-md border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-200 disabled:opacity-60"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setFormState((current) => ({
                                ...current,
                                vehicles: current.vehicles.filter((_, idx) => idx !== index),
                              }))
                            }
                            disabled={isBusy}
                            className="flex-1 rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                          >
                            Remove
                          </button>
                        </div>

                        <ErrorText message={fieldErrors[`vehicle-${index}-car`]} />
                        <ErrorText message={fieldErrors[`vehicle-${index}-carNumber`]} />
                        <ErrorText message={fieldErrors[`vehicle-${index}-driverPhoneNumber`]} />
                        <ErrorText message={fieldErrors[`vehicle-${index}-budget`]} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {(localError || errorMessage || localSuccess) && (
              <div
                className={`rounded-lg border px-4 py-3 text-sm font-medium ${
                  localSuccess && !localError && !errorMessage
                    ? 'border-slate-300 bg-slate-100 text-slate-800'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
              >
                {localError || errorMessage || localSuccess}
              </div>
            )}
          </div>

          <div className="sticky bottom-0 -mx-4 mt-6 border-t border-slate-200/70 bg-white/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* <p className="text-xs text-slate-500"> */}
              {/*   {currentWizardStep === 1 && 'Fill required fields to continue to Hotels.'} */}
              {/*   {currentWizardStep === 2 && 'Add hotels or continue to Vehicles.'} */}
              {/*   {currentWizardStep === 3 && 'Add vehicles, then save draft or submit.'} */}
              {/* </p> */}

              <div className="flex flex-col gap-3 sm:flex-row">
                {currentWizardStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={isBusy}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:opacity-60"
                  >
                    Back
                  </button>
                )}

                {currentWizardStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isBusy}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
                  >
                    Next
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      disabled={isBusy}
                      className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSavingDraft ? 'Saving draft...' : 'Save as Draft'}
                    </button>
                    <button
                      type="submit"
                      disabled={isBusy}
                      className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      <EntityModal
        open={hotelModalOpen}
        title={editingHotelIndex === null ? 'Add Hotel' : `Edit Hotel ${editingHotelIndex + 1}`}
        subtitle={hotelModalStep === 1 ? 'Basic hotel details' : 'Budget and photos'}
        step={hotelModalStep}
        onClose={handleCloseHotelModal}
        footer={
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={handleCloseHotelModal}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            {hotelModalStep === 2 && (
              <button
                type="button"
                onClick={() => setHotelModalStep(1)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Back
              </button>
            )}
            {hotelModalStep === 1 ? (
              <button
                type="button"
                onClick={() => {
                  if (validateHotelDraftStep(1, hotelDraft)) {
                    setHotelModalStep(2)
                  }
                }}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveHotel}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
              >
                Save Hotel
              </button>
            )}
          </div>
        }
      >
        {hotelModalStep === 1 ? (
          <div className="space-y-4">
            <div>
              <label className={labelClassName}>
                Hotel name <span className="text-red-600">*</span>
              </label>
              <input
                className={inputClassName}
                value={hotelDraft.name}
                onChange={(event) => setHotelDraft((current) => ({ ...current, name: event.target.value }))}
                placeholder="Lush Retreat"
              />
              <ErrorText message={fieldErrors.hotelDraftName} />
            </div>

            <div>
              <label className={labelClassName}>
                Phone number <span className="text-red-600">*</span>
              </label>
              <input
                className={inputClassName}
                value={hotelDraft.phoneNumber}
                onChange={(event) =>
                  setHotelDraft((current) => ({ ...current, phoneNumber: event.target.value }))
                }
                placeholder="+91 98765 43210"
              />
              <ErrorText message={fieldErrors.hotelDraftPhone} />
            </div>

            <div>
              <label className={labelClassName}>
                Address <span className="text-red-600">*</span>
              </label>
              <input
                className={inputClassName}
                value={hotelDraft.address}
                onChange={(event) =>
                  setHotelDraft((current) => ({ ...current, address: event.target.value }))
                }
                placeholder="Main Road, Coorg"
              />
              <ErrorText message={fieldErrors.hotelDraftAddress} />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className={labelClassName}>
                Budget <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                min="0"
                className={inputClassName}
                value={hotelDraft.budget}
                onChange={(event) =>
                  setHotelDraft((current) => ({ ...current, budget: event.target.value }))
                }
                placeholder="3200"
              />
              <ErrorText message={fieldErrors.hotelDraftBudget} />
            </div>

            <div>
              <label className={labelClassName}>Photo URLs (optional)</label>
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  className={inputClassName}
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) {
                      void handleHotelPhotoUpload(file)
                    }
                  }}
                  disabled={isUploadingHotelPhoto}
                />
                {hotelDraft.photos && (
                  <img
                    src={resolveHotelPhoto(parseListInput(hotelDraft.photos)[0])}
                    alt="Hotel photo preview"
                    className="h-12 w-12 rounded-lg border border-slate-200 object-cover shadow-sm"
                  />
                )}
              </div>
              {isUploadingHotelPhoto && (
                <p className="mt-1 text-xs font-medium text-slate-700">Uploading hotel photo...</p>
              )}
              {uploadHotelPhotoError && <ErrorText message={uploadHotelPhotoError} />}
              <textarea
                className={`${inputClassName} min-h-24 resize-y`}
                value={hotelDraft.photos}
                onChange={(event) =>
                  setHotelDraft((current) => ({ ...current, photos: event.target.value }))
                }
                placeholder="https://example.com/hotel.jpg"
              />
              <p className="mt-1 text-xs text-slate-500">Upload one photo or enter URL(s) manually.</p>
            </div>
          </div>
        )}
      </EntityModal>

      <EntityModal
        open={vehicleModalOpen}
        title={editingVehicleIndex === null ? 'Add Vehicle' : `Edit Vehicle ${editingVehicleIndex + 1}`}
        subtitle={vehicleModalStep === 1 ? 'Vehicle and driver details' : 'Budget details'}
        step={vehicleModalStep}
        onClose={handleCloseVehicleModal}
        footer={
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={handleCloseVehicleModal}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            {vehicleModalStep === 2 && (
              <button
                type="button"
                onClick={() => setVehicleModalStep(1)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Back
              </button>
            )}
            {vehicleModalStep === 1 ? (
              <button
                type="button"
                onClick={() => {
                  if (validateVehicleDraftStep(1, vehicleDraft)) {
                    setVehicleModalStep(2)
                  }
                }}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveVehicle}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
              >
                Save Vehicle
              </button>
            )}
          </div>
        }
      >
        {vehicleModalStep === 1 ? (
          <div className="space-y-4">
            <div>
              <label className={labelClassName}>
                Vehicle name <span className="text-red-600">*</span>
              </label>
              <input
                className={inputClassName}
                value={vehicleDraft.car}
                onChange={(event) => setVehicleDraft((current) => ({ ...current, car: event.target.value }))}
                placeholder="Innova"
              />
              <ErrorText message={fieldErrors.vehicleDraftCar} />
            </div>

            <div>
              <label className={labelClassName}>
                Car number <span className="text-red-600">*</span>
              </label>
              <input
                className={inputClassName}
                value={vehicleDraft.carNumber}
                onChange={(event) =>
                  setVehicleDraft((current) => ({ ...current, carNumber: event.target.value }))
                }
                placeholder="KA 01 AB 1234"
              />
              <ErrorText message={fieldErrors.vehicleDraftNumber} />
            </div>

            <div>
              <label className={labelClassName}>Driver name</label>
              <input
                className={inputClassName}
                value={vehicleDraft.driverName}
                onChange={(event) =>
                  setVehicleDraft((current) => ({ ...current, driverName: event.target.value }))
                }
                placeholder="Ravi"
              />
            </div>

            <div>
              <label className={labelClassName}>
                Driver phone number <span className="text-red-600">*</span>
              </label>
              <input
                className={inputClassName}
                value={vehicleDraft.driverPhoneNumber}
                onChange={(event) =>
                  setVehicleDraft((current) => ({ ...current, driverPhoneNumber: event.target.value }))
                }
                placeholder="+91 90000 00000"
              />
              <ErrorText message={fieldErrors.vehicleDraftDriverPhone} />
            </div>

            <div>
              <label className={labelClassName}>Vehicle type</label>
              <input
                className={inputClassName}
                value={vehicleDraft.vehicleType}
                onChange={(event) =>
                  setVehicleDraft((current) => ({ ...current, vehicleType: event.target.value }))
                }
                placeholder="SUV"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className={labelClassName}>
              Budget <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              min="0"
              className={inputClassName}
              value={vehicleDraft.budget}
              onChange={(event) =>
                setVehicleDraft((current) => ({ ...current, budget: event.target.value }))
              }
              placeholder="1800"
            />
            <ErrorText message={fieldErrors.vehicleDraftBudget} />
          </div>
        )}
      </EntityModal>
    </div>
  )
}

export { CreateTripModal }
