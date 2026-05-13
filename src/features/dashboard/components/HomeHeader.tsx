import logoBlack from '../../../assets/logo-black.png'

interface HomeHeaderProps {
  userName: string
  userEmail?: string | null
  userPhotoURL?: string | null
  searchQuery: string
  onSearch: (query: string) => void
  onSubmitTrip: () => void
  onDraftsClick: () => void
  onLogout: () => void
  onProfileClick: () => void
  isLoggingOut: boolean
  isAdmin: boolean
  draftCount: number
  profilePhotoURL?: string
}

const getInitials = (email?: string | null) => {
  if (!email) return '?'
  return email.split('@')[0].slice(0, 2).toUpperCase()
}

const HomeHeader = ({
  userName,
  userEmail,
  userPhotoURL,
  searchQuery,
  onSearch,
  onSubmitTrip,
  onDraftsClick,
  onLogout,
  onProfileClick,
  isLoggingOut,
  isAdmin,
  draftCount,
  profilePhotoURL,
}: HomeHeaderProps) => {
  const profileImage = profilePhotoURL || userPhotoURL

  return (
    <header className="w-full px-6 pt-4 sm:px-8 lg:px-12 lg:pt-3 xl:px-16 2xl:px-20">
      <nav className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-4">
          <img src={logoBlack} alt="Alpine" className="h-14 w-auto object-contain sm:h-16 lg:h-18" />
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2 md:max-w-[700px] md:justify-end">
          <label className="group/search relative flex h-12 min-w-0 flex-1 items-center overflow-hidden rounded-full border border-slate-200/80 bg-white/90 text-slate-500 shadow-[0_12px_34px_rgba(15,23,42,0.08)] ring-1 ring-white/80 backdrop-blur transition-all duration-200 hover:border-slate-300 hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)] focus-within:border-slate-950 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-900/10 md:max-w-sm">
            <span className="ml-2 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-950 text-white transition-colors group-focus-within/search:bg-blue-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
              </svg>
            </span>
            <input
              type="search"
              className="min-w-0 flex-1 bg-transparent px-3 text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400"
              placeholder="Search trips"
              value={searchQuery}
              onChange={(event) => onSearch(event.target.value)}
              aria-label="Search trips"
            />
            <svg className="mr-4 hidden h-4 w-4 shrink-0 text-slate-300 transition-colors group-focus-within/search:text-slate-500 sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
            </svg>
          </label>

          <button
            type="button"
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-black px-3 text-sm font-semibold text-white shadow-[0_12px_34px_rgba(15,23,42,0.08)] ring-1 ring-white/80 transition hover:border-slate-900 hover:bg-slate-950 hover:text-white hover:shadow-[0_16px_40px_rgba(15,23,42,0.14)] active:scale-[0.98] sm:px-5"
            onClick={onSubmitTrip}
          >
            <span className="hidden sm:inline">Create Plan</span>
            <svg className="h-5 w-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" />
            </svg>
          </button>

          <button
            type="button"
            className="relative inline-flex h-12 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-white px-3 text-sm font-semibold text-slate-800 shadow-[0_12px_34px_rgba(15,23,42,0.08)] ring-1 ring-white/80 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] sm:px-4"
            onClick={onDraftsClick}
            aria-label="View saved drafts"
          >
            <span className="hidden sm:inline">Drafts</span>
            <svg className="h-5 w-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4h10a2 2 0 0 1 2 2v14l-7-3-7 3V6a2 2 0 0 1 2-2Z" />
            </svg>
            {draftCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-blue-600 px-1 text-[11px] font-bold text-white">
                {draftCount}
              </span>
            )}
          </button>

          <div className="group/profile relative z-50">
            <button
              type="button"
              className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
              aria-label="Open profile menu"
            >
              {profileImage ? (
                <img src={profileImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <span>{getInitials(userEmail)}</span>
              )}
            </button>

            <div className="invisible absolute right-0 top-full z-50 mt-3 w-56 translate-y-2 rounded-2xl border border-slate-200 bg-white p-2 text-left opacity-0 shadow-2xl transition-all duration-200 group-hover/profile:visible group-hover/profile:translate-y-0 group-hover/profile:opacity-100 group-focus-within/profile:visible group-focus-within/profile:translate-y-0 group-focus-within/profile:opacity-100">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="truncate text-sm font-semibold text-slate-950">{userName}</p>
                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {isAdmin ? 'Admin' : userEmail || 'Traveler'}
                </p>
              </div>

              <button
                type="button"
                onClick={onProfileClick}
                className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0" />
                </svg>
                Profile
              </button>

              <button
                type="button"
                onClick={onLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m-3-3h8.25m0 0-3-3m3 3-3 3" />
                </svg>
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="grid gap-5 py-4 sm:py-6 md:grid-cols-[minmax(0,1fr)_430px] md:items-end md:gap-12 lg:py-5">
        <div className="max-w-[760px]">
          {/* <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-800 shadow-sm">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-950 text-[10px] font-bold text-white">
              {getInitials(userEmail)}
            </span>
            <span>
              <span className="font-light text-slate-500">Hi</span> {userName},
            </span>
          </div> */}
          <h1 className="text-5xl font-semibold leading-[0.98] tracking-normal pb-3 text-slate-950 sm:text-6xl md:text-6xl xl:text-7xl">
            Find Your Perfect Journey
          </h1>
        </div>
        <p className="max-w-sm text-base leading-7 text-slate-500 md:pb-3 md:text-lg">
          Explore curated trips across the globe, designed for every type of traveler.
        </p>
      </section>
    </header>
  )
}

export { HomeHeader }
