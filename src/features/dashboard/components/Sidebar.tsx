import { useState } from 'react'
import '../styles/sidebar.css'

interface SidebarProps {
  onSortChange?: (sortType: 'popular' | 'cheapest') => void
}

type SortType = 'popular' | 'cheapest'

const Sidebar = ({ onSortChange }: SidebarProps) => {
  const [activeSort, setActiveSort] = useState<SortType>('popular')

  const handleSort = (sortType: SortType) => {
    setActiveSort(sortType)
    onSortChange?.(sortType)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-container">
        <div className="sidebar-section">
          <h3 className="sidebar-title">Sort By</h3>

          <div className="sort-options">
            <button
              type="button"
              className={`sort-btn ${activeSort === 'popular' ? 'active' : ''}`}
              onClick={() => handleSort('popular')}
            >
              <svg className="sort-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
              <span>Popular</span>
            </button>

            <button
              type="button"
              className={`sort-btn ${activeSort === 'cheapest' ? 'active' : ''}`}
              onClick={() => handleSort('cheapest')}
            >
              <svg className="sort-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.31-8.86c-1.48-.92-2.4-1.96-2.07-3.56.252-1.51 1.88-2.75 3.39-2.75s3.139 1.24 3.39 2.75c.33 1.6-.59 2.64-2.07 3.56l.67 1.95c2.18-1.48 2.291-3.59 2.06-4.53-.27-1.8-1.555-3.08-3.77-3.08-2.215 0-3.5 1.28-3.77 3.08-.231.94-.118 3.05 2.06 4.53l.67-1.95z" />
              </svg>
              <span>Cheapest</span>
            </button>
          </div>
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-section">
          <h3 className="sidebar-title">Filters</h3>
          <p className="sidebar-subtitle">More filters coming soon...</p>
        </div>
      </div>
    </aside>
  )
}

export { Sidebar }
