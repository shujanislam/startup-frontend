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
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-300 backdrop-blur-md lg:static lg:mt-6 lg:w-full lg:rounded-none lg:border-x-0 lg:border-b-0 lg:bg-white lg:backdrop-blur-none">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-end gap-4 px-6 py-4 lg:max-w-none lg:py-2">
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
                ? 'bg-blue-500'
                : isUnlocking
                  ? 'bg-slate-600'
                  : 'bg-slate-900 hover:bg-slate-800'
            } disabled:cursor-not-allowed`}
          >
            {isRevealed ? 'Trip Unlocked' : isUnlocking ? 'Unlocking...' : 'Unlock Trip'}
          </button>
        </div>
      </div>
    </div>
  )
}

export { TripDetailBottomBar }
