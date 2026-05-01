import { Navbar } from './Navbar'

interface HomeHeaderProps {
  userName: string
  userEmail?: string | null
  userPhotoURL?: string | null
  searchQuery: string
  onSearch: (query: string) => void
  onSubmitTrip: () => void
  onLogout: () => void
  onProfileClick: () => void
  isLoggingOut: boolean
  isAdmin: boolean
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
  onLogout,
  onProfileClick,
  isLoggingOut,
  isAdmin,
}: HomeHeaderProps) => {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 pt-6 md:px-6 lg:px-8 md:pt-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            <span className="font-light">Hi</span> {userName},
          </h1>
          <h1 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Where do you want to go?
          </h1>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-transparent bg-slate-200 text-xs font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-300 focus:border-blue-500 focus:outline-none md:hidden"
          aria-label="Go to profile"
          onClick={onProfileClick}
        >
          {userPhotoURL ? (
            <img src={userPhotoURL} alt="" className="h-full w-full object-cover" />
          ) : (
            <span>{getInitials(userEmail)}</span>
          )}
        </button>

        <div className="hidden md:block">
          <Navbar
            onSearch={onSearch}
            onSubmitTrip={onSubmitTrip}
            onLogout={onLogout}
            isLoggingOut={isLoggingOut}
            isAdmin={isAdmin}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 md:hidden">
        <label className="flex h-10 flex-1 items-center overflow-hidden rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
          <svg className="ml-3 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
          </svg>
          <input
            type="search"
            className="min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            placeholder="Search destinations"
            value={searchQuery}
            onChange={(event) => onSearch(event.target.value)}
            aria-label="Search destinations"
          />
        </label>

        <button
          type="button"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
          onClick={onSubmitTrip}
          aria-label="Add new package"
          title="Add new package"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" />
          </svg>
        </button>
      </div>
    </section>
  )
}

export { HomeHeader }
