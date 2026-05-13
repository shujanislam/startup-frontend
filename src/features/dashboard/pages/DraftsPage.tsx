import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CreateTripModal } from '../components/CreateTripModal'
import type { DraftPackageSummary } from '../types/trip'
import {
  type ApiPackage,
  createPackage,
  createPackageDraft,
  fetchDraftPackages,
  fetchEditablePackage,
  submitPackageForApproval,
  updatePackageDraft,
  type CreatePackagePayload,
  type DraftPackagePayload,
} from '../services/packageApi'
import { useAuth } from '../../auth/hooks/useAuth'

type BannerState =
  | {
      tone: 'success' | 'error'
      message: string
    }
  | null

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback

const DraftsPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()

  const [draftTrips, setDraftTrips] = useState<DraftPackageSummary[]>([])
  const [editingPackage, setEditingPackage] = useState<ApiPackage | null>(null)
  const [isDraftLoading, setIsDraftLoading] = useState(false)
  const [isLoadingEditablePackage, setIsLoadingEditablePackage] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isSubmittingTrip, setIsSubmittingTrip] = useState(false)
  const [draftError, setDraftError] = useState<string | null>(null)
  const [createTripError, setCreateTripError] = useState<string | null>(null)
  const [banner, setBanner] = useState<BannerState>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const rejectedDrafts = draftTrips.filter((draft) => draft.status === 'rejected').length
  const latestUpdate = draftTrips.length
    ? new Date(
        Math.max(...draftTrips.map((draft) => new Date(draft.updatedAt).getTime())),
      )
    : null
  const latestUpdateLabel = latestUpdate
    ? latestUpdate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A'

  const fetchDraftTrips = useCallback(async () => {
    if (!user) {
      setDraftTrips([])
      setDraftError(null)
      return
    }

    setIsDraftLoading(true)
    setDraftError(null)

    try {
      const data = await fetchDraftPackages()
      setDraftTrips(data)
    } catch (err: unknown) {
      setDraftError(getErrorMessage(err, 'Failed to load saved drafts'))
    } finally {
      setIsDraftLoading(false)
    }
  }, [user])

  useEffect(() => {
    void fetchDraftTrips()
  }, [fetchDraftTrips])

  useEffect(() => {
    const draftId = searchParams.get('draft')

    if (!draftId || !user) {
      return
    }

    const loadEditableDraft = async () => {
      setIsLoadingEditablePackage(true)
      setCreateTripError(null)
      setBanner(null)

      try {
        const data = await fetchEditablePackage(draftId)
        setEditingPackage(data)
        setIsCreateModalOpen(true)
      } catch (err: unknown) {
        setBanner({
          tone: 'error',
          message: getErrorMessage(err, 'Failed to open this draft'),
        })
        setSearchParams({}, { replace: true })
      } finally {
        setIsLoadingEditablePackage(false)
      }
    }

    void loadEditableDraft()
  }, [searchParams, setSearchParams, user])

  const handleSubmitTrip = () => {
    setBanner(null)
    setCreateTripError(null)
    setEditingPackage(null)
    setSearchParams({}, { replace: true })
    setIsCreateModalOpen(true)
  }

  const handleSaveDraft = async (
    payload: DraftPackagePayload,
    packageId?: string,
  ): Promise<ApiPackage> => {
    setCreateTripError(null)
    setBanner(null)
    setIsSavingDraft(true)

    try {
      const savedPackage = packageId
        ? await updatePackageDraft(packageId, payload)
        : await createPackageDraft(payload)

      setEditingPackage(savedPackage)
      setSearchParams({ draft: savedPackage._id }, { replace: true })
      await fetchDraftTrips()

      return savedPackage
    } catch (err: unknown) {
      const message = getErrorMessage(err, 'Failed to save your draft')
      setCreateTripError(message)
      throw new Error(message)
    } finally {
      setIsSavingDraft(false)
    }
  }

  const handleCreateTrip = async (payload: CreatePackagePayload, packageId?: string) => {
    setCreateTripError(null)
    setIsSubmittingTrip(true)

    try {
      if (packageId) {
        await submitPackageForApproval(packageId, payload)
      } else {
        await createPackage(payload)
      }

      setIsCreateModalOpen(false)
      setEditingPackage(null)
      setSearchParams({}, { replace: true })
      setBanner({
        tone: 'success',
        message: 'Trip submitted successfully. It is now waiting for admin approval.',
      })

      await fetchDraftTrips()
    } catch (err: unknown) {
      setCreateTripError(getErrorMessage(err, 'Failed to submit your trip'))
    } finally {
      setIsSubmittingTrip(false)
    }
  }

  const handleOpenDraft = (draftId: string) => {
    setSearchParams({ draft: draftId })
  }

  return (
    <>
      <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-blue-50 text-slate-950">
        <main className="relative pb-24">
          <div className="pointer-events-none absolute -top-32 right-0 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="pointer-events-none absolute top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-100/60 blur-3xl" />

          <section className="relative w-full px-6 pt-8 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 sidebar-rise">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  Drafts library
                </div>
                <h1 className="mt-4 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl lg:text-5xl font-display">
                  Saved packages, ready to finish
                </h1>
                <p className="mt-3 text-base leading-7 text-slate-600">
                  Keep momentum with every draft in one place. Pick up where you left off and submit
                  when everything feels right.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/home')}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m15 18-6-6 6-6" />
                  </svg>
                  Back to home
                </button>
                <button
                  type="button"
                  onClick={handleSubmitTrip}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(15,23,42,0.2)] transition hover:bg-slate-800"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" />
                  </svg>
                  New package
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Drafts
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{draftTrips.length}</p>
                <p className="mt-1 text-xs text-slate-500">saved in progress</p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Latest update
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{latestUpdateLabel}</p>
                <p className="mt-1 text-xs text-slate-500">most recent activity</p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Needs review
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{rejectedDrafts}</p>
                <p className="mt-1 text-xs text-slate-500">rejected drafts</p>
              </div>
            </div>
          </section>

          {banner && (
            <div className="w-full px-6 pt-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
              <div
                className={`rounded-3xl border px-5 py-4 shadow-sm ${
                  banner.tone === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
              >
                <p className="text-sm font-semibold uppercase tracking-[0.18em]">
                  {banner.tone === 'success' ? 'Update' : 'Attention'}
                </p>
                <p className="mt-2 text-sm leading-6">{banner.message}</p>
              </div>
            </div>
          )}

          <section className="w-full px-6 pb-2 pt-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
            <div className="rounded-4xl border border-slate-200/80 bg-white/90 px-5 py-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
                    Saved work
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">Your package drafts</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Start with the details you have, then return here to finish and submit for approval.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSubmitTrip}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" />
                  </svg>
                  Create new
                </button>
              </div>

              {draftError && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {draftError}
                </div>
              )}

              {isLoadingEditablePackage && (
                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                  Opening draft...
                </div>
              )}

              {isDraftLoading && draftTrips.length === 0 && (
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={`draft-skeleton-${index}`}
                      className="h-56 rounded-3xl border border-slate-200 bg-slate-100/70 shadow-sm animate-pulse"
                    />
                  ))}
                </div>
              )}

              {!isDraftLoading && draftTrips.length === 0 && !draftError && (
                <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                    <svg
                      className="h-6 w-6 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4h10a2 2 0 0 1 2 2v14l-7-3-7 3V6a2 2 0 0 1 2-2Z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">No saved drafts yet</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Create a package and use Save as Draft when you want to pause.
                  </p>
                </div>
              )}

              {draftTrips.length > 0 && (
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {draftTrips.map((draft) => (
                    <article
                      key={draft.id}
                      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_40px_rgba(15,23,42,0.12)]"
                    >
                      <div className="relative h-36 bg-slate-100">
                        {draft.imageUrl ? (
                          <img
                            src={draft.imageUrl}
                            alt={draft.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-800 via-blue-700 to-cyan-500 px-4 text-center text-sm font-semibold text-white">
                            {draft.destination}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent" />
                        <span
                          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                            draft.status === 'rejected'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-white/90 text-slate-700'
                          }`}
                        >
                          {draft.status === 'rejected' ? 'Rejected' : 'Draft'}
                        </span>
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="line-clamp-1 text-base font-semibold text-slate-950">
                              {draft.name}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">{draft.destination}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                          <span>Updated {new Date(draft.updatedAt).toLocaleDateString()}</span>
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                            Saved
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenDraft(draft.id)}
                          className="mt-4 w-full rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(37,99,235,0.2)] transition hover:bg-blue-700"
                        >
                          Continue editing
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      <CreateTripModal
        open={isCreateModalOpen}
        initialPackage={editingPackage}
        isSavingDraft={isSavingDraft}
        isSubmitting={isSubmittingTrip}
        errorMessage={createTripError}
        onClose={() => {
          setIsCreateModalOpen(false)
          setEditingPackage(null)
          setSearchParams({}, { replace: true })
        }}
        onSaveDraft={handleSaveDraft}
        onSubmit={handleCreateTrip}
      />
    </>
  )
}

export { DraftsPage }
