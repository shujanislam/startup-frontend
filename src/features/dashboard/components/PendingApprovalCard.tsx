import { useMemo, useState } from 'react'
import type { PackageSummary } from '../types/trip.ts'

interface PendingApprovalCardProps {
  trip: PackageSummary
  isApproving: boolean
  onApprove: () => void
  onView: () => void
}

const PendingApprovalCard = ({
  trip,
  isApproving,
  onApprove,
  onView,
}: PendingApprovalCardProps) => {
  const [imageFailed, setImageFailed] = useState(false)

  const fallbackBackground = useMemo(() => {
    const palettes = [
      'from-amber-400 via-orange-300 to-rose-300',
      'from-sky-500 via-cyan-400 to-emerald-300',
      'from-indigo-500 via-blue-400 to-cyan-300',
      'from-emerald-500 via-lime-400 to-amber-300',
    ]

    const hash = trip.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
    return palettes[hash % palettes.length]
  }, [trip.name])

  const hasUsableImage = trip.imageUrl.trim().length > 0 && !imageFailed

  return (
    <article className="overflow-hidden rounded-[24px] border border-amber-200 bg-white shadow-sm">
      <div className="relative h-44 overflow-hidden bg-slate-100">
        {hasUsableImage ? (
          <img
            src={trip.imageUrl}
            alt={trip.name}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-linear-to-br ${fallbackBackground}`}>
            <span className="px-4 text-center text-sm font-semibold text-white/90">{trip.destination}</span>
          </div>
        )}

        <div className="absolute left-3 top-3 rounded-full border border-amber-300 bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">
          Pending review
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-900">{trip.name}</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              Rs {trip.price.toLocaleString()}
            </span>
          </div>
          <p className="line-clamp-2 text-sm leading-6 text-slate-600">{trip.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Destination</p>
            <p className="mt-1 font-medium text-slate-800">{trip.destination}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Duration</p>
            <p className="mt-1 font-medium text-slate-800">{trip.duration} days</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Created by</p>
            <p className="mt-1 truncate font-medium text-slate-800">{trip.createdBy}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Submitted</p>
            <p className="mt-1 font-medium text-slate-800">
              {new Date(trip.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onView}
            className="flex-1 rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            View details
          </button>
          <button
            type="button"
            onClick={onApprove}
            disabled={isApproving}
            className="flex-1 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isApproving ? 'Approving...' : 'Approve trip'}
          </button>
        </div>
      </div>
    </article>
  )
}

export { PendingApprovalCard }
