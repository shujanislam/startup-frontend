import { useState, useEffect, type ChangeEvent, type ReactNode } from 'react'
import type { SortType, SeasonType } from '../types/trip'

/* ─── Props ──────────────────────────────────────────────── */

interface SidebarProps {
  onSortChange?:  (sortType: SortType) => void
  onSeasonChange?: (season: SeasonType) => void
  onBudgetChange?: (maxBudget: number) => void
}

interface FilterOption<T extends string> {
  id: T
  label: string
  icon: ReactNode
}

interface FilterContentProps {
  activeSort:     SortType
  activeSeason:   SeasonType
  maxBudget:      number
  onSortClick:    (id: SortType) => void
  onSeasonClick:  (id: SeasonType) => void
  onBudgetChange: (event: ChangeEvent<HTMLInputElement>) => void
}

/* ─── Icons ──────────────────────────────────────────────── */

const CompassIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m14.5 9.5-5 2 2-5 5-2-2 5Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
  </svg>
)
const FlameIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 22c4 0 7-2.9 7-6.7 0-2.8-1.7-5.3-4.1-7.4-.5 2-1.6 3.5-3.2 4.6.3-3.1-.8-6-3-8.5C6.7 6.4 5 9.7 5 14.3 5 18.1 8 22 12 22Z" />
  </svg>
)
const WalletIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 16.5v-9Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 12h4" />
  </svg>
)
const SparkIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
  </svg>
)
const ClockIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6v6l4 2" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
  </svg>
)
const SunIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4V2m0 20v-2m8-8h2M2 12h2m14.4-6.4 1.4-1.4M4.2 19.8l1.4-1.4m0-12.8L4.2 4.2m15.6 15.6-1.4-1.4" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
  </svg>
)
const SnowIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v18m6.4-14.4L5.6 19.4m0-12.8 12.8 12.8M4 12h16" />
  </svg>
)
const RainIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 17h10a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.2 7.8 4.8 4.8 0 0 0 7 17Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m8 20 1-1.5M12 21l1-1.5M16 20l1-1.5" />
  </svg>
)
const LeafIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 4C11 4 5 9.5 5 17a3 3 0 0 0 3 3c7.5 0 12-7 12-16Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 19c2.5-5 6-8 11-10" />
  </svg>
)
const GlobeIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.6 9h16.8M3.6 15h16.8M12 3c2 2.3 3 5.3 3 9s-1 6.7-3 9c-2-2.3-3-5.3-3-9s1-6.7 3-9Z" />
  </svg>
)

/* ─── Data ───────────────────────────────────────────────── */

const sortOptions: Array<FilterOption<SortType>> = [
  { id: 'all',      label: 'All Trips',      icon: <CompassIcon /> },
  { id: 'popular',  label: 'Most Popular',   icon: <FlameIcon />   },
  { id: 'cheapest', label: 'Cheapest First', icon: <WalletIcon />  },
  { id: 'newest',   label: 'Newest',         icon: <SparkIcon />   },
  { id: 'shortest', label: 'Shortest Trip',  icon: <ClockIcon />   },
]

const seasonOptions: Array<FilterOption<SeasonType>> = [
  { id: 'all',     label: 'All Seasons', icon: <GlobeIcon /> },
  { id: 'summer',  label: 'Summer',      icon: <SunIcon />   },
  { id: 'winter',  label: 'Winter',      icon: <SnowIcon />  },
  { id: 'monsoon', label: 'Monsoon',     icon: <RainIcon />  },
  { id: 'autumn',  label: 'Autumn',      icon: <LeafIcon />  },
]

/* ─── Injected CSS ───────────────────────────────────────── */

const SIDEBAR_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Figtree:wght@400;500;600&display=swap');

  .yt-root { font-family: 'Figtree', system-ui, sans-serif; }

  .yt-brand {
    font-family: 'DM Serif Display', Georgia, serif;
    letter-spacing: -0.01em;
    line-height: 1;
  }

  /* Aurora mesh gradient background */
  .yt-bg {
    background-color: #f0fdfa;
    background-image:
      radial-gradient(ellipse at 18% 18%,  #bfdbfe 0px, transparent 52%),
      radial-gradient(ellipse at 82% 8%,   #a7f3d0 0px, transparent 48%),
      radial-gradient(ellipse at 60% 55%,  #bae6fd 0px, transparent 45%),
      radial-gradient(ellipse at 10% 80%,  #bbf7d0 0px, transparent 50%),
      radial-gradient(ellipse at 90% 85%,  #93c5fd 0px, transparent 42%);
  }

  /* Frosted glass panel */
  .yt-glass {
    background: rgba(255, 255, 255, 0.45);
    backdrop-filter: blur(22px) saturate(1.5);
    -webkit-backdrop-filter: blur(22px) saturate(1.5);
    border-right: 1px solid rgba(255, 255, 255, 0.8);
  }

  /* Inactive button */
  .yt-btn {
    position: relative;
    display: flex;
    align-items: center;
    gap: 11px;
    width: 100%;
    padding: 10px 12px;
    border-radius: 14px;
    font-size: 13.5px;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    color: #334155;
    background: rgba(255, 255, 255, 0.62);
    border: 1px solid rgba(255, 255, 255, 0.9);
    box-shadow: 0 1px 3px rgba(14,165,233,0.08), 0 1px 2px rgba(0,0,0,0.04);
    transition:
      transform 0.18s cubic-bezier(.4,0,.2,1),
      background 0.18s, border-color 0.18s,
      box-shadow 0.2s, color 0.15s;
  }

  .yt-btn:hover:not(.yt-btn--active) {
    transform: translateX(5px);
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 18px rgba(14,165,233,0.16), 0 1px 4px rgba(0,0,0,0.06);
    color: #0f172a;
  }

  /* Active button */
  .yt-btn--active {
    background: linear-gradient(135deg, #0369a1 0%, #065f46 100%);
    border-color: transparent;
    color: #ffffff;
    box-shadow:
      0 10px 32px -8px rgba(3,105,161,0.5),
      0 4px 12px rgba(6,95,70,0.28),
      inset 0 1px 0 rgba(255,255,255,0.18);
    transform: none;
  }

  /* Icon container */
  .yt-btn__icon {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    border-radius: 10px;
    background: rgba(14, 165, 233, 0.1);
    color: #0369a1;
    transition: background 0.18s, color 0.18s;
  }
  .yt-btn--active .yt-btn__icon {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }
  .yt-btn:hover:not(.yt-btn--active) .yt-btn__icon {
    background: rgba(14, 165, 233, 0.16);
    color: #0369a1;
  }

  /* Entrance animation */
  @keyframes ytSlide {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .yt-btn { animation: ytSlide 0.38s cubic-bezier(0.22, 1, 0.36, 1) both; }

  @keyframes ytFadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .yt-section { animation: ytFadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }

  /* Range slider */
  .yt-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    outline: none;
    cursor: pointer;
  }
  .yt-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px; height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0ea5e9, #059669);
    border: 2.5px solid #ffffff;
    cursor: pointer;
    box-shadow: 0 0 0 3px rgba(14,165,233,0.25), 0 3px 10px rgba(5,150,105,0.35);
    transition: transform 0.18s, box-shadow 0.18s;
  }
  .yt-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 0 5px rgba(14,165,233,0.22), 0 4px 14px rgba(5,150,105,0.45);
  }
  .yt-slider::-moz-range-thumb {
    width: 20px; height: 20px;
    border-radius: 50%;
    border: 2.5px solid #ffffff;
    background: linear-gradient(135deg, #0ea5e9, #059669);
    box-shadow: 0 0 0 3px rgba(14,165,233,0.25);
  }

  /* Mobile drawer */
  @keyframes ytDrawerUp {
    from { transform: translateY(100%); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
  .yt-drawer { animation: ytDrawerUp 0.3s cubic-bezier(0.22, 1, 0.36, 1) both; }

  /* Scrollbar */
  .yt-scroll::-webkit-scrollbar { width: 4px; }
  .yt-scroll::-webkit-scrollbar-track { background: transparent; }
  .yt-scroll::-webkit-scrollbar-thumb {
    border-radius: 99px;
    background: rgba(14,165,233,0.22);
  }
`

/* ─── Sub-components ─────────────────────────────────────── */

const SectionLabel = ({ children, count }: { children: string; count: number }) => (
  <div className="mb-3 flex items-center gap-2.5">
    <span
      style={{
        display: 'block',
        width: 3,
        height: 14,
        borderRadius: 99,
        background: 'linear-gradient(to bottom, #0ea5e9, #059669)',
        flexShrink: 0,
      }}
    />
    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.24em', color: '#64748b', textTransform: 'uppercase' }}>
      {children}
    </span>
    <span
      className="ml-auto rounded-full px-2.5 py-0.5"
      style={{
        fontSize: 10,
        fontWeight: 600,
        background: 'linear-gradient(135deg, rgba(14,165,233,0.12), rgba(5,150,105,0.12))',
        color: '#0369a1',
        border: '1px solid rgba(14,165,233,0.2)',
      }}
    >
      {count}
    </span>
  </div>
)

const Divider = () => (
  <div
    style={{
      height: 1,
      background: 'linear-gradient(to right, rgba(14,165,233,0.3), rgba(5,150,105,0.18), transparent)',
    }}
  />
)

/* ─── FilterContent ──────────────────────────────────────── */

const FilterContent = ({
  activeSort, activeSeason, maxBudget,
  onSortClick, onSeasonClick, onBudgetChange,
}: FilterContentProps) => {
  const pct = Math.round(((maxBudget - 500) / (10000 - 500)) * 100)
  const trackBg = `linear-gradient(to right, #0ea5e9 0%, #059669 ${pct}%, rgba(14,165,233,0.15) ${pct}%)`

  return (
    <div className="flex flex-col gap-6">

      {/* Sort */}
      <div className="yt-section" style={{ animationDelay: '60ms' }}>
        <SectionLabel count={sortOptions.length}>Sort Mood</SectionLabel>
        <div className="flex flex-col gap-1.5">
          {sortOptions.map((opt, i) => (
            <button
              key={opt.id}
              type="button"
              className={`yt-btn${activeSort === opt.id ? ' yt-btn--active' : ''}`}
              style={{ animationDelay: `${80 + i * 38}ms` }}
              onClick={() => onSortClick(opt.id)}
            >
              <span className="yt-btn__icon">{opt.icon}</span>
              <span style={{ letterSpacing: '-0.01em' }}>{opt.label}</span>
              {activeSort === opt.id && (
                <span
                  className="ml-auto flex-shrink-0 rounded-full"
                  style={{ width: 6, height: 6, background: 'rgba(255,255,255,0.7)' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <Divider />

      {/* Season */}
      <div className="yt-section" style={{ animationDelay: '200ms' }}>
        <SectionLabel count={seasonOptions.length}>Season Vibe</SectionLabel>
        <div className="flex flex-col gap-1.5">
          {seasonOptions.map((opt, i) => (
            <button
              key={opt.id}
              type="button"
              className={`yt-btn${activeSeason === opt.id ? ' yt-btn--active' : ''}`}
              style={{ animationDelay: `${220 + i * 38}ms` }}
              onClick={() => onSeasonClick(opt.id)}
            >
              <span className="yt-btn__icon">{opt.icon}</span>
              <span style={{ letterSpacing: '-0.01em' }}>{opt.label}</span>
              {activeSeason === opt.id && (
                <span
                  className="ml-auto flex-shrink-0 rounded-full"
                  style={{ width: 6, height: 6, background: 'rgba(255,255,255,0.7)' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <Divider />

      {/* Budget */}
      <div
        className="yt-section rounded-2xl p-4"
        style={{
          animationDelay: '390ms',
          background: 'rgba(255,255,255,0.58)',
          border: '1px solid rgba(255,255,255,0.92)',
          boxShadow: '0 4px 20px rgba(14,165,233,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        }}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span
                style={{
                  display: 'block',
                  width: 3,
                  height: 12,
                  borderRadius: 99,
                  background: 'linear-gradient(to bottom, #0ea5e9, #059669)',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.24em', color: '#64748b', textTransform: 'uppercase' }}>
                Budget Dial
              </span>
            </div>
            <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
              Slide to cap your max spend
            </p>
          </div>
          <span
            className="flex-shrink-0 rounded-xl px-3 py-1.5"
            style={{
              background: 'linear-gradient(135deg, rgba(14,165,233,0.13), rgba(5,150,105,0.13))',
              border: '1px solid rgba(14,165,233,0.22)',
              color: '#0369a1',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            ₹{maxBudget.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          className="yt-slider"
          min="500"
          max="10000"
          step="500"
          value={maxBudget}
          style={{ background: trackBg }}
          onChange={onBudgetChange}
        />
        <div className="mt-2 flex justify-between" style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
          <span>₹500</span>
          <span>₹10,000</span>
        </div>
      </div>

    </div>
  )
}

/* ─── Sidebar ────────────────────────────────────────────── */

const Sidebar = ({ onSortChange, onSeasonChange, onBudgetChange }: SidebarProps) => {
  const [activeSort,   setActiveSort]   = useState<SortType>('all')
  const [activeSeason, setActiveSeason] = useState<SeasonType>('all')
  const [maxBudget,    setMaxBudget]    = useState(10000)
  const [mobileOpen,   setMobileOpen]   = useState(false)

  useEffect(() => {
    const id = 'yt-sidebar-styles'
    if (!document.getElementById(id)) {
      const style = document.createElement('style')
      style.id = id
      style.textContent = SIDEBAR_CSS
      document.head.appendChild(style)
    }
    return () => { document.getElementById(id)?.remove() }
  }, [])

  const handleSortClick    = (id: SortType)   => { setActiveSort(id);   onSortChange?.(id)   }
  const handleSeasonClick  = (id: SeasonType) => { setActiveSeason(id); onSeasonChange?.(id) }
  const handleBudgetChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value)
    setMaxBudget(v)
    onBudgetChange?.(v)
  }

  const filterProps: FilterContentProps = {
    activeSort, activeSeason, maxBudget,
    onSortClick: handleSortClick,
    onSeasonClick: handleSeasonClick,
    onBudgetChange: handleBudgetChange,
  }

  return (
    <>
      {/* ═══ Desktop sidebar ═══ */}
      <aside className="yt-root yt-bg sticky top-0 hidden h-screen w-[300px] shrink-0 self-start lg:flex">
        <div className="yt-glass relative flex h-full w-full flex-col overflow-hidden px-5 py-6">

          {/* Decorative ambient orbs */}
          <div
            className="pointer-events-none absolute"
            style={{
              top: -80, right: -70,
              width: 240, height: 240,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(167,243,208,0.5) 0%, transparent 68%)',
            }}
          />
          <div
            className="pointer-events-none absolute"
            style={{
              bottom: 40, left: -60,
              width: 200, height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(147,197,253,0.45) 0%, transparent 68%)',
            }}
          />

          {/* Brand */}
          <div className="relative mb-6">
            <div className="flex items-center gap-3.5">
              <div
                className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9, #059669)',
                  boxShadow: '0 8px 24px -8px rgba(14,165,233,0.55), 0 2px 8px rgba(5,150,105,0.3)',
                }}
              >
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10.5h.01" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.28em', color: '#64748b', textTransform: 'uppercase' }}>
                  Atlas Filters
                </p>
                <h2 className="yt-brand" style={{ fontSize: 22, color: '#0f172a' }}>
                  BudgetYatra
                </h2>
              </div>
            </div>

            <p className="mt-3" style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.65, paddingLeft: 2 }}>
              Curate the perfect escape — by mood, season, and spend.
            </p>

            <div
              className="mt-4"
              style={{
                height: 1.5,
                borderRadius: 99,
                background: 'linear-gradient(to right, #0ea5e9, #059669, rgba(255,255,255,0))',
                opacity: 0.4,
              }}
            />
          </div>

          {/* Filters */}
          <div className="yt-scroll relative flex-1 overflow-y-auto pr-1">
            <FilterContent {...filterProps} />
          </div>

          {/* Travel tip */}
          <div
            className="relative mt-5 px-4 py-3.5"
            style={{
              background: 'rgba(255,255,255,0.7)',
              borderLeft: '3px solid #0ea5e9',
              borderTop: '1px solid rgba(255,255,255,0.92)',
              borderRight: '1px solid rgba(255,255,255,0.92)',
              borderBottom: '1px solid rgba(255,255,255,0.92)',
              borderRadius: '0 16px 16px 0',
              boxShadow: '0 4px 16px rgba(14,165,233,0.1)',
            }}
          >
            <p style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.22em', color: '#0369a1', textTransform: 'uppercase', marginBottom: 5 }}>
              ✦ Travel Tip
            </p>
            <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.6 }}>
              Pair a short duration with a low budget to surface the quickest weekend escapes.
            </p>
          </div>

        </div>
      </aside>

      {/* ═══ Mobile toggle ═══ */}
      <button
        type="button"
        className="yt-root fixed bottom-20 right-4 z-40 grid place-items-center rounded-full lg:hidden"
        style={{
          width: 52,
          height: 52,
          background: 'linear-gradient(135deg, #0ea5e9, #059669)',
          boxShadow: '0 8px 28px -6px rgba(14,165,233,0.6), 0 4px 12px rgba(5,150,105,0.35)',
        }}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle filters"
      >
        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </button>

      {/* ═══ Mobile drawer ═══ */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(6px)' }}
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="yt-root yt-bg yt-drawer fixed bottom-0 left-0 right-0 z-50 max-h-[82vh] overflow-y-auto rounded-t-3xl lg:hidden"
            style={{ borderTop: '1px solid rgba(255,255,255,0.85)' }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div
                style={{
                  width: 36, height: 4, borderRadius: 99,
                  background: 'linear-gradient(to right, #0ea5e9, #059669)',
                  opacity: 0.4,
                }}
              />
            </div>

            <div className="px-5 pb-1 pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.26em', color: '#64748b', textTransform: 'uppercase' }}>
                    Filters
                  </p>
                  <h3 className="yt-brand" style={{ fontSize: 20, color: '#0f172a' }}>
                    Shape your trip
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(255,255,255,0.92)',
                    color: '#64748b',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  }}
                  aria-label="Close filters"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-5 pb-12 pt-4">
              <FilterContent {...filterProps} />
            </div>
          </div>
        </>
      )}
    </>
  )
}

export { Sidebar }