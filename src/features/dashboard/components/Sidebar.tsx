import { useState } from 'react'
import type { SortType, SeasonType } from '../types/trip'
import '../styles/sidebar.css'

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
    <aside className="sidebar">
      <div className="sidebar-container">
        {/* Group 1: Sort By */}
        <div className="sidebar-section">
          <h3 className="sidebar-title">Sort By</h3>
          <div className="filter-buttons">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`filter-btn ${activeSort === option.id ? 'active' : ''}`}
                onClick={() => handleSortClick(option.id as SortType)}
              >
                <span className="filter-emoji">{option.emoji}</span>
                <span className="filter-label">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-divider" />

        {/* Group 2: Season */}
        <div className="sidebar-section">
          <h3 className="sidebar-title">Season</h3>
          <div className="filter-buttons">
            {seasonOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`filter-btn ${activeSeason === option.id ? 'active' : ''}`}
                onClick={() => handleSeasonClick(option.id as SeasonType)}
              >
                <span className="filter-emoji">{option.emoji}</span>
                <span className="filter-label">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-divider" />

        {/* Group 3: Max Budget */}
        <div className="sidebar-section">
          <h3 className="sidebar-title">Max Budget</h3>
          <input
            type="range"
            className="budget-slider"
            min="500"
            max="10000"
            step="500"
            value={maxBudget}
            onChange={handleBudgetChange}
          />
          <div className="budget-labels">
            <span className="budget-min">₹500</span>
            <span className="budget-current">₹{maxBudget.toLocaleString()}</span>
            <span className="budget-max">₹10,000</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export { Sidebar }
