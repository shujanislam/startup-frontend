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

  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
      <div className="p-6">
        {/* Group 1: Sort By */}
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

        {/* Group 2: Season */}
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

        {/* Group 3: Max Budget */}
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
      </div>
    </aside>
  )
}

export { Sidebar }
