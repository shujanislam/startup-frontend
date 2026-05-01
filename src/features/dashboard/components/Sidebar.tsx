import { useState, type ChangeEvent, type ReactNode } from 'react'
import type { SortType, SeasonType } from '../types/trip'

interface SidebarProps {
  onSortChange?: (sortType: SortType) => void
  onSeasonChange?: (season: SeasonType) => void
  onBudgetChange?: (maxBudget: number) => void
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

const sortOptions: Array<FilterOption<SortType>> = [
  { id: 'all', label: 'All Trips', icon: <CompassIcon /> },
  { id: 'popular', label: 'Most Popular', icon: <FlameIcon /> },
  { id: 'cheapest', label: 'Cheapest First', icon: <WalletIcon /> },
  { id: 'newest', label: 'Newest', icon: <SparkIcon /> },
  { id: 'shortest', label: 'Shortest Trip', icon: <ClockIcon /> },
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
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Sort By
        </h3>
      </div>
      <div className="flex flex-col gap-1 my-3">
        {sortOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-1.5 text-sm font-semibold transition-all ${
              activeSort === option.id
                ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-sm'
                : 'border-transparent bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950'
            }`}
            onClick={() => onSortClick(option.id)}
          >
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                activeSort === option.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {option.icon}
            </span>
            <span className="truncate text-left">{option.label}</span>
          </button>
        ))}
      </div>
    </div>

    <div className="mt-6">
      <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
        Season
      </h3>
      <div className="flex flex-col gap-1 my-3">
        {seasonOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-1.5 text-sm font-semibold transition-all ${
              activeSeason === option.id
                ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-sm'
                : 'border-transparent bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950'
            }`}
            onClick={() => onSeasonClick(option.id)}
          >
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                activeSeason === option.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {option.icon}
            </span>
            <span className="truncate text-left">{option.label}</span>
          </button>
        ))}
      </div>
    </div>

    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 mt-6">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Max Budget
        </h3>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-blue-700 shadow-sm">
          ₹{maxBudget.toLocaleString()}
        </span>
      </div>
      <input
        type="range"
        className="w-full cursor-pointer accent-blue-600"
        min="500"
        max="10000"
        step="500"
        value={maxBudget}
        onChange={onBudgetChange}
      />
      <div className="mt-1.5 flex justify-between text-xs font-medium text-slate-400">
        <span>₹500</span>
        <span>₹10,000</span>
      </div>
    </div>
  </>
)

const Sidebar = ({
  onSortChange,
  onSeasonChange,
  onBudgetChange,
}: SidebarProps) => {
  const [activeSort, setActiveSort] = useState<SortType>('all')
  const [activeSeason, setActiveSeason] = useState<SeasonType>('all')
  const [maxBudget, setMaxBudget] = useState(10000)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSortClick = (id: SortType) => {
    setActiveSort(id)
    onSortChange?.(id)
  }

  const handleSeasonClick = (id: SeasonType) => {
    setActiveSeason(id)
    onSeasonChange?.(id)
  }

  const handleBudgetChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    setMaxBudget(value)
    onBudgetChange?.(value)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden h-screen w-72 shrink-0 overflow-hidden border-r border-slate-200 bg-white/95 shadow-sm backdrop-blur lg:block">
        <div className="border-slate-200 px-5 py-4">
          <div className="mb-4 flex items-center gap-2 rounded-full pr-2">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-950 text-white shadow-sm">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10.5h.01" />
              </svg>
            </span>
            <span className="text-lg font-bold text-slate-950">BudgetYatra</span>
          </div>
        </div>
        <div className="px-3 py-3">
          <FilterContent
            activeSort={activeSort}
            activeSeason={activeSeason}
            maxBudget={maxBudget}
            onSortClick={handleSortClick}
            onSeasonClick={handleSeasonClick}
            onBudgetChange={handleBudgetChange}
          />
        </div>
      </aside>

      {/* Mobile Floating Toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed bottom-20 right-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-transparent text-white shadow-lg transition hover:bg-slate-800 active:scale-95 lg:hidden"
        aria-label="Toggle filters"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer panel */}
          <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[76vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl lg:hidden">
            <div className="flex items-center justify-between  border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100"
                aria-label="Close filters"
              >
                <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-4 py-5 pb-10">
              <FilterContent
                activeSort={activeSort}
                activeSeason={activeSeason}
                maxBudget={maxBudget}
                onSortClick={handleSortClick}
                onSeasonClick={handleSeasonClick}
                onBudgetChange={handleBudgetChange}
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}

export { Sidebar }
