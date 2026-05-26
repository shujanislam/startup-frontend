import { useEffect, useState, type ChangeEvent, type ReactNode } from 'react'
import type { SortType, SeasonType } from '../types/trip'

interface TripFilterButtonProps {
  sortBy: SortType
  season: SeasonType
  maxBudget: number
  onSortChange: (sortType: SortType) => void
  onSeasonChange: (season: SeasonType) => void
  onBudgetChange: (maxBudget: number) => void
}

interface FilterOption<T extends string> {
  id: T
  label: string
  icon: ReactNode
}

interface FilterContentProps {
  activeSort: SortType
  activeSeason: SeasonType
  maxBudget: number
  onSortClick: (id: SortType) => void
  onSeasonClick: (id: SeasonType) => void
  onBudgetChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const CompassIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m14.5 9.5-5 2 2-5 5-2-2 5Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
  </svg>
)

const FlameIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22c4 0 7-2.9 7-6.7 0-2.8-1.7-5.3-4.1-7.4-.5 2-1.6 3.5-3.2 4.6.3-3.1-.8-6-3-8.5C6.7 6.4 5 9.7 5 14.3 5 18.1 8 22 12 22Z" />
  </svg>
)

const WalletIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 16.5v-9Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12h4" />
  </svg>
)

const SparkIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
  </svg>
)

const ClockIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
  </svg>
)

const SunIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4V2m0 20v-2m8-8h2M2 12h2m14.4-6.4 1.4-1.4M4.2 19.8l1.4-1.4m0-12.8L4.2 4.2m15.6 15.6-1.4-1.4" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
  </svg>
)

const SnowIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18m6.4-14.4L5.6 19.4m0-12.8 12.8 12.8M4 12h16" />
  </svg>
)

const RainIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17h10a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.2 7.8 4.8 4.8 0 0 0 7 17Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8 20 1-1.5M12 21l1-1.5M16 20l1-1.5" />
  </svg>
)

const LeafIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 4C11 4 5 9.5 5 17a3 3 0 0 0 3 3c7.5 0 12-7 12-16Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19c2.5-5 6-8 11-10" />
  </svg>
)

const GlobeIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.6 9h16.8M3.6 15h16.8M12 3c2 2.3 3 5.3 3 9s-1 6.7-3 9c-2-2.3-3-5.3-3-9s1-6.7 3-9Z" />
  </svg>
)

const FilterIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10m-7 6h4" />
  </svg>
)

const CloseIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
  </svg>
)

const sortOptions: Array<FilterOption<SortType>> = [
  { id: 'all', label: 'All Trips', icon: <CompassIcon /> },
  { id: 'popular', label: 'Most Popular', icon: <FlameIcon /> },
  { id: 'cheapest', label: 'Cheapest First', icon: <WalletIcon /> },
  { id: 'newest', label: 'Newest', icon: <SparkIcon /> },
  { id: 'shortest', label: 'Shortest First', icon: <ClockIcon /> },
]

const seasonOptions: Array<FilterOption<SeasonType>> = [
  { id: 'all', label: 'All Seasons', icon: <GlobeIcon /> },
  { id: 'summer', label: 'Summer', icon: <SunIcon /> },
  { id: 'winter', label: 'Winter', icon: <SnowIcon /> },
  { id: 'monsoon', label: 'Monsoon', icon: <RainIcon /> },
  { id: 'autumn', label: 'Autumn', icon: <LeafIcon /> },
]

const FilterContent = ({
  activeSort,
  activeSeason,
  maxBudget,
  onSortClick,
  onSeasonClick,
  onBudgetChange,
}: FilterContentProps) => (
  <>
    <div>
      <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Sort By</h3>
      <div className="mt-2 grid gap-1">
        {sortOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm font-medium transition ${
              activeSort === option.id
                ? 'border-slate-950 bg-slate-950 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
            onClick={() => onSortClick(option.id)}
          >
            <span
              className={`shrink-0 ${activeSort === option.id ? 'text-white' : 'text-slate-400'}`}
            >
              {option.icon}
            </span>
            <span className="truncate text-left">{option.label}</span>
          </button>
        ))}
      </div>
    </div>

    <div className="mt-4">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Season</h3>
      <div className="mt-2 grid gap-1">
        {seasonOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm font-medium transition ${
              activeSeason === option.id
                ? 'border-slate-950 bg-slate-950 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
            onClick={() => onSeasonClick(option.id)}
          >
            <span
              className={`shrink-0 ${activeSeason === option.id ? 'text-white' : 'text-slate-400'}`}
            >
              {option.icon}
            </span>
            <span className="truncate text-left">{option.label}</span>
          </button>
        ))}
      </div>
    </div>

    <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Max Budget</h3>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-950">
          ₹{maxBudget.toLocaleString()}
        </span>
      </div>
      <input
        type="range"
        className="w-full cursor-pointer accent-slate-950"
        min="500"
        max="10000"
        step="500"
        value={maxBudget}
        onChange={onBudgetChange}
      />
      <div className="mt-1.5 flex justify-between text-[11px] font-medium text-slate-400">
        <span>₹500</span>
        <span>₹10,000</span>
      </div>
    </div>
  </>
)

const TripFilterButton = ({
  sortBy,
  season,
  maxBudget,
  onSortChange,
  onSeasonChange,
  onBudgetChange,
}: TripFilterButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const activeFilterCount =
    (sortBy !== 'all' ? 1 : 0) + (season !== 'all' ? 1 : 0) + (maxBudget < 10000 ? 1 : 0)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleBudgetChange = (event: ChangeEvent<HTMLInputElement>) => {
    onBudgetChange(Number(event.target.value))
  }

  return (
    <div className="relative flex justify-end">
      <button
        type="button"
        className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 shadow-sm transition hover:border-slate-900"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
      >
        <FilterIcon />
        <span>Filter</span>
        {activeFilterCount > 0 && (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-slate-950 px-1.5 text-[11px] font-bold text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-60 bg-slate-950/30 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none"
            aria-label="Close filters"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-x-3 bottom-3 z-70 max-h-[72vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-xl md:absolute md:inset-auto md:right-0 md:top-12 md:w-72">
            <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
              <h2 className="text-sm font-semibold text-slate-950">Filters</h2>
              <button
                type="button"
                className="grid h-8 w-8 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                onClick={() => setIsOpen(false)}
                aria-label="Close filters"
              >
                <CloseIcon />
              </button>
            </div>

            <FilterContent
              activeSort={sortBy}
              activeSeason={season}
              maxBudget={maxBudget}
              onSortClick={onSortChange}
              onSeasonClick={onSeasonChange}
              onBudgetChange={handleBudgetChange}
            />
          </div>
        </>
      )}
    </div>
  )
}

export { TripFilterButton }
