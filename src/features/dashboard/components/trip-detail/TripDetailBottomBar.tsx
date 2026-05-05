import type { TripDetail } from '../../types/trip'

interface TripDetailBottomBarProps {
  isRevealed: boolean
  isUnlocking: boolean
  onUnlockTrip: () => void
}

const TripDetailBottomBar = ({
  isRevealed,
  isUnlocking,
  onUnlockTrip,
}: TripDetailBottomBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-300 bg-slate-200 backdrop-blur-md lg:left-auto lg:right-0 lg:w-2/5 lg:border-l">
      <div className="flex items-center justify-end gap-4 px-6 py-4 w-full max-w-6xl mx-auto lg:max-w-none">
        <div className="flex gap-2 md:gap-3 flex-wrap md:flex-nowrap">
          <button
            type="button"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 md:px-4 md:text-sm"
          >
            Share
          </button>

          <button
            type="button"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 md:px-4 md:text-sm"
          >
            Save
          </button>

          <button
            type="button"
            onClick={onUnlockTrip}
            disabled={isRevealed || isUnlocking}
            className={`rounded-lg px-4 py-2 text-xs font-semibold text-white transition md:px-6 md:text-sm ${
              isRevealed
                ? 'bg-emerald-500'
                : isUnlocking
                  ? 'bg-slate-600'
                  : 'bg-slate-900 hover:bg-slate-800'
            } disabled:cursor-not-allowed`}
          >
            {isRevealed ? '✅ Trip Unlocked' : isUnlocking ? 'Unlocking...' : 'Unlock Trip'}
          </button>
        </div>
      </div>
    </div>
  )
}

export { TripDetailBottomBar }
