import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

type Step = 0 | 1 | 2

const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'] as const
const vibeOptions = [
  'Mountains',
  'Beaches',
  'Solo Travel',
  'Luxury',
  'Backpacking',
  'Trekking',
  'Road Trips',
  'Culture',
  'Food Trails',
  'Wildlife',
]

const OnboardingRoute = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(0)
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [gender, setGender] = useState<string | null>(null)
  const [interests, setInterests] = useState<string[]>([])

  const stepNumber = step + 1
  const progress = (stepNumber / 3) * 100

  const canContinue = useMemo(() => {
    if (step === 0) return fullName.trim().length > 1 && username.trim().length > 2
    if (step === 1) return Boolean(gender)
    return interests.length > 0
  }, [fullName, gender, interests.length, step, username])

  const toggleInterest = (value: string) => {
    setInterests((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    )
  }

  const goNext = () => {
    if (!canContinue) return
    if (step < 2) {
      setStep((prev) => (prev + 1) as Step)
      return
    }
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-[#f8fbfb] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1520px]">
        <section className="relative hidden flex-1 overflow-hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=80"
            alt="Hiker exploring mountain landscape"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-br from-[#0f172acc] via-[#0f766ec4] to-[#0f172a8c]" />
          <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-200">BudgetYatra</p>
            <h2 className="mt-4 max-w-xl text-4xl font-bold leading-tight">
              Build your next adventure with trips that match your vibe and your budget.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-emerald-50/90">
              From mountain treks to beach escapes, personalize your journey in seconds.
            </p>
          </div>
        </section>

        <section className="flex w-full items-center justify-center bg-white px-6 py-10 lg:w-[620px] lg:px-12">
          <div className="w-full max-w-[430px]">
            <div className="mb-9">
              <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-600">
                <span>{`Step ${stepNumber} of 3`}</span>
                <span className="text-[#14b8a6]">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <motion.div
                  className="h-full rounded-full bg-[#14b8a6]"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -48 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {step === 0 && (
                  <div>
                    <h1 className="text-3xl font-bold leading-tight text-[#0f172a]">
                      Hi there! Let&apos;s get to know you
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">Set up your traveler identity in under a minute.</p>

                    <div className="mt-8 space-y-5">
                      <label className="relative block">
                        <input
                          value={fullName}
                          onChange={(event) => setFullName(event.target.value)}
                          className="peer h-14 w-full rounded-2xl border border-slate-200 px-4 pt-5 text-sm outline-none transition focus:border-[#14b8a6] focus:ring-4 focus:ring-[#14b8a6]/15"
                          placeholder=" "
                        />
                        <span className="pointer-events-none absolute left-4 top-4 origin-left text-sm text-slate-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:scale-85 peer-focus:text-[#0f766e] peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:scale-85">
                          Full Name
                        </span>
                      </label>

                      <label className="relative block">
                        <input
                          value={username}
                          onChange={(event) => setUsername(event.target.value.replace(/\s+/g, ''))}
                          className="peer h-14 w-full rounded-2xl border border-slate-200 px-4 pt-5 text-sm outline-none transition focus:border-[#14b8a6] focus:ring-4 focus:ring-[#14b8a6]/15"
                          placeholder=" "
                        />
                        <span className="pointer-events-none absolute left-4 top-4 origin-left text-sm text-slate-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:scale-85 peer-focus:text-[#0f766e] peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:scale-85">
                          Username
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h1 className="text-3xl font-bold leading-tight text-[#0f172a]">Choose your identity</h1>
                    <p className="mt-2 text-sm text-slate-500">Pick the option you are most comfortable with.</p>

                    <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {genderOptions.map((option) => {
                        const selected = gender === option
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setGender(option)}
                            className={`rounded-2xl border px-4 py-5 text-left text-sm font-semibold transition-all ${
                              selected
                                ? 'border-[#14b8a6] bg-[#14b8a6]/10 text-[#0f766e] shadow-[0_8px_20px_rgba(20,184,166,0.18)]'
                                : 'border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-[#14b8a6]/40 hover:shadow-md'
                            }`}
                          >
                            {option}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h1 className="text-3xl font-bold leading-tight text-[#0f172a]">Choose your Vibe</h1>
                    <p className="mt-2 text-sm text-slate-500">Pick one or more styles so we can tailor your feed.</p>

                    <div className="mt-8 flex flex-wrap gap-2.5">
                      {vibeOptions.map((option) => {
                        const selected = interests.includes(option)
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => toggleInterest(option)}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                              selected
                                ? 'border-[#14b8a6] bg-[#14b8a6] text-white shadow-[0_8px_18px_rgba(20,184,166,0.35)]'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-[#14b8a6]/40 hover:text-[#0f766e]'
                            }`}
                          >
                            {option}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.94 }}
              onClick={goNext}
              disabled={!canContinue}
              className="mt-10 h-12 w-full rounded-xl bg-[#14b8a6] text-sm font-semibold text-white transition hover:bg-[#0ea697] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {step === 2 ? 'Finish Onboarding' : 'Continue'}
            </motion.button>

            <div className="mt-6 flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => navigate('/home')}
                className="text-slate-500 transition hover:text-slate-700"
              >
                Skip for now
              </button>
              <a href="#" className="text-slate-500 transition hover:text-slate-700">
                Privacy Policy
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default OnboardingRoute
