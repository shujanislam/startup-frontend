import { useState } from 'react'
import type { SortType, SeasonType } from '../types/trip'

interface SidebarProps {
  onSortChange?: (sortType: SortType) => void
  onSeasonChange?: (season: SeasonType) => void
  onBudgetChange?: (maxBudget: number) => void
}

const Sidebar = ({ onSortChange, onSeasonChange, onBudgetChange }: SidebarProps) => {
  const [activeSort, setActiveSort] = useState<SortType>('all')
  const [activeSeason, setActiveSeason] = useState<SeasonType>('all')
  const [maxBudget, setMaxBudget] = useState(10000)
  const [mobileOpen, setMobileOpen] = useState(false)

  const sortOptions = [
    { id: 'all', label: 'All Trips', emoji: '🗺️' },
    { id: 'popular', label: 'Most Popular', emoji: '🔥' },
    { id: 'cheapest', label: 'Cheapest First', emoji: '💰' },
    { id: 'newest', label: 'Newest', emoji: '✨' },
    { id: 'shortest', label: 'Shortest Trip', emoji: '⚡' },
  ] as const

  const seasonOptions = [
    { id: 'all', label: 'All Seasons', emoji: '🌍' },
    { id: 'summer', label: 'Summer', emoji: '☀️' },
    { id: 'winter', label: 'Winter', emoji: '❄️' },
    { id: 'monsoon', label: 'Monsoon', emoji: '🌧️' },
    { id: 'autumn', label: 'Autumn', emoji: '🍂' },
  ] as const

  const handleSortClick = (id: SortType) => {
    setActiveSort(id)
    onSortChange?.(id)
  }

  const handleSeasonClick = (id: SeasonType) => {
    setActiveSeason(id)
    onSeasonChange?.(id)
  }

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    setMaxBudget(value)
    onBudgetChange?.(value)
  }

  const FilterContent = () => (
    <>
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-3">
          Sort By
        </h3>
        <div className="flex flex-col gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-md transition-all font-medium text-sm ${
                activeSort === option.id
                  ? 'bg-blue-50 text-blue-600 border border-blue-600'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
              onClick={() => handleSortClick(option.id as SortType)}
            >
              <span className="text-base w-4.5 text-center flex-shrink-0">
                {option.emoji}
              </span>
              <span className="truncate">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-200 my-4" />

      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-3">
          Season
        </h3>
        <div className="flex flex-col gap-2">
          {seasonOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-md transition-all font-medium text-sm ${
                activeSeason === option.id
                  ? 'bg-blue-50 text-blue-600 border border-blue-600'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
              onClick={() => handleSeasonClick(option.id as SeasonType)}
            >
              <span className="text-base w-4.5 text-center flex-shrink-0">
                {option.emoji}
              </span>
              <span className="truncate">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-200 my-4" />

      <div>
        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-3">
          Max Budget
        </h3>
        <input
          type="range"
          className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600 mb-3"
          min="500"
          max="10000"
          step="500"
          value={maxBudget}
          onChange={handleBudgetChange}
        />
        <div className="flex justify-between items-center gap-2 text-xs">
          <span className="text-gray-500 font-medium">₹500</span>
          <span className="text-blue-600 font-bold text-center">₹{maxBudget.toLocaleString()}</span>
          <span className="text-gray-500 font-medium">₹10,000</span>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
        <div className="p-6">
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Floating Toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-20 right-4 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
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
            className="lg:hidden fixed inset-0 bg-black/40 z-40"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer panel */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 pb-10">
              <FilterContent />
            </div>
          </div>
        </>
      )}
    </>
  )
}

export { Sidebar }
