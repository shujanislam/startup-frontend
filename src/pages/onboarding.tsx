import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute'
import { fetchCurrentUser, updateProfile } from '../features/dashboard/services/dashboardApi'
import onboard from "../assets/onboard.png"
import Logo from '../assets/logo-black.png'

type Step = 0 | 1 | 2 | 3

const TOTAL_STEPS = 4

const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'] as const
const travelStyleOptions = [
  'Adventure',
  'Relaxation',
  'Cultural',
  'Backpacking',
  'Luxury',
  'Solo',
  'Family',
  'Eco-friendly',
] as const
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
  'Photography',
  'Spiritual',
] as const

const FloatingLabelInput = ({
  value,
  onChange,
  label,
  type = 'text',
  placeholder = ' ',
}: {
  value: string
  onChange: (v: string) => void
  label: string
  type?: string
  placeholder?: string
}) => (
  <label className="relative block">
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="peer h-14 w-full rounded-2xl border border-white/35 bg-white/15 px-4 pt-5 text-sm text-white outline-none transition placeholder:text-white/70 focus:border-white/70 focus:ring-4 focus:ring-white/30 lg:border-slate-200 lg:bg-white lg:text-slate-900 lg:placeholder:text-slate-400 lg:focus:border-[#3b82f6] lg:focus:ring-[#3b82f6]/15"
      placeholder={placeholder}
    />
    <span className="pointer-events-none absolute left-4 top-4 origin-left text-sm text-white/70 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:scale-85 peer-focus:text-white peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:scale-85 lg:text-slate-500 lg:peer-focus:text-[#1d4ed8]">
      {label}
    </span>
  </label>
)

const OnboardingRoute = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    gender: '',
    travelStyle: '',
    bio: '',
    tags: [] as string[],
  })

  const updateField = (key: keyof typeof form, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const toggleItem = (key: 'tags', value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }))
  }

  const stepNumber = step + 1
  const progress = (stepNumber / TOTAL_STEPS) * 100

  const canContinue = useMemo(() => {
    if (step === 0) return form.name.trim().length > 1
    if (step === 1) return form.gender.length > 0
    if (step === 2) return form.travelStyle.length > 0
    return form.tags.length > 0
  }, [form, step])

  const handleFinish = async () => {
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      const { user } = await fetchCurrentUser()
      const userId = user._id

      if (!userId) {
        setSubmitError('Unable to find your account. Please try again.')
        setIsSubmitting(false)
        return
      }

      const genderValue = form.gender.toLowerCase().replace(/\s+/g, '_')

      await updateProfile(userId, {
        name: form.name.trim(),
        phone: form.phone.trim() || undefined,
        gender: genderValue,
        travelStyle: form.travelStyle,
        bio: form.bio.trim() || undefined,
        tags: form.tags,
        onboardingComplete: true,
      })

      navigate('/home', { replace: true })
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const goNext = () => {
    if (!canContinue) return
    if (step < 3) {
      setStep((prev) => (prev + 1) as Step)
      return
    }
    void handleFinish()
  }

  const goBack = () => {
    if (step > 0) setStep((prev) => (prev - 1) as Step)
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-white lg:bg-[#f8fbfb] lg:text-slate-900">
      <div
        className="fixed inset-0 -z-20 scale-105 blur-[5px] lg:hidden"
        style={{
          backgroundImage: `url(${onboard})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="fixed inset-0 -z-10 bg-black/40 lg:hidden" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-380 items-center justify-center px-3 py-4 sm:px-5 sm:py-7 lg:items-stretch lg:justify-start lg:p-0">
        <section className="relative hidden flex-1 overflow-hidden lg:block">
          <img
            src={onboard}
            alt="Hiker exploring mountain landscape"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#0a0000]"/>
          <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
            {/* <p className="text-7xl font-serif font-bold uppercase tracking-[0.10em] text-[#71b0f8]">Alpine</p> */}
            <h2 className="mt-4 max-w-xl text-4xl font-bold leading-tight">
              Build your next adventure with trips that match your vibe and your budget.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-blue-200">
              From mountain treks to beach escapes, personalize your journey in seconds.
            </p>
          </div>
        </section>

        <section className="flex w-full max-w-107.5 items-center justify-center bg-transparent px-6 py-8 text-white sm:px-8 sm:py-10 lg:max-w-none lg:w-155 lg:rounded-none lg:border-none lg:bg-white lg:px-12 lg:py-10 lg:text-slate-900 lg:shadow-none lg:backdrop-blur-none">
          <div className="w-full max-w-107.5">
            <div className="mb-4 flex justify-center lg:hidden">
              <img src={Logo} className="h-15 w-auto" alt="Alpine" />
            </div>
            <div className="mb-9">
              <div className="mb-2 flex items-center justify-between text-sm font-semibold text-white/80 lg:text-slate-700">
                <span>{`Step ${stepNumber} of ${TOTAL_STEPS}`}</span>
                <span className="text-white/90 lg:text-slate-950">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/20 lg:bg-slate-200">
                <motion.div
                  className="h-full rounded-full bg-white/80 lg:bg-slate-950"
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
                    <h1 className="text-3xl font-semibold leading-tight text-white lg:text-[#0f172a]">
                      Hi there! Let&apos;s get to know you
                    </h1>
                    <p className="mt-2 text-sm text-white/70 lg:text-slate-500">Tell us the basics so we can personalize your experience.</p>

                    <div className="mt-8 space-y-5">
                      <FloatingLabelInput
                        value={form.name}
                        onChange={(v) => updateField('name', v)}
                        label="Full Name *"
                      />
                      <FloatingLabelInput
                        value={form.phone}
                        onChange={(v) => updateField('phone', v)}
                        label="Phone Number"
                        type="tel"
                      />
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h1 className="text-3xl font-semibold leading-tight text-white lg:text-[#0f172a]">Your identity & background</h1>
                    <p className="mt-2 text-sm text-white/70 lg:text-slate-500">Choose how you want your profile to appear.</p>

                    <div className="mt-8 space-y-5">
                      <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 lg:text-slate-500">Gender *</p>
                        <div className="grid grid-cols-2 gap-3">
                          {genderOptions.map((option) => {
                            const selected = form.gender === option
                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() => updateField('gender', option)}
                                className={`rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition-all ${
                                  selected
                                    ? 'border-white/70 bg-white/25 text-white shadow-[0_8px_20px_rgba(0,0,0,0.25)] lg:border-[#3b82f6] lg:bg-[#3b82f6]/10 lg:text-[#1d4ed8] lg:shadow-[0_8px_20px_rgba(59,130,246,0.18)]'
                                    : 'border-white/30 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white lg:border-slate-200 lg:bg-white lg:text-slate-700 lg:hover:-translate-y-0.5 lg:hover:border-[#3b82f6]/40 lg:hover:shadow-md'
                                }`}
                              >
                                {option}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h1 className="text-3xl font-semibold leading-tight text-white lg:text-[#0f172a]">Your travel style</h1>
                    <p className="mt-2 text-sm text-white/70 lg:text-slate-500">How do you like to travel? Tell us about your style.</p>

                    <div className="mt-8 space-y-5">
                      <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 lg:text-slate-500">Travel Style *</p>
                        <div className="grid grid-cols-2 gap-3">
                          {travelStyleOptions.map((option) => {
                            const selected = form.travelStyle === option
                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() => updateField('travelStyle', option)}
                                className={`rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition-all ${
                                  selected
                                    ? 'border-white/70 bg-white/25 text-white shadow-[0_8px_20px_rgba(0,0,0,0.25)] lg:border-[#3b82f6] lg:bg-[#3b82f6]/10 lg:text-[#1d4ed8] lg:shadow-[0_8px_20px_rgba(59,130,246,0.18)]'
                                    : 'border-white/30 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white lg:border-slate-200 lg:bg-white lg:text-slate-700 lg:hover:-translate-y-0.5 lg:hover:border-[#3b82f6]/40 lg:hover:shadow-md'
                                }`}
                              >
                                {option}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/70 lg:text-slate-500">
                          Short Bio
                        </label>
                        <textarea
                          value={form.bio}
                          onChange={(e) => updateField('bio', e.target.value)}
                          rows={3}
                          className="w-full rounded-2xl border border-white/35 bg-white/15 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/70 focus:border-white/70 focus:ring-4 focus:ring-white/30 lg:border-slate-200 lg:bg-white lg:text-slate-900 lg:focus:border-[#3b82f6] lg:focus:ring-[#3b82f6]/15"
                          placeholder="Tell travelers what makes your trips unforgettable..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h1 className="text-3xl font-semibold leading-tight text-white lg:text-[#0f172a]">Choose your Vibe</h1>
                    <p className="mt-2 text-sm text-white/70 lg:text-slate-500">Pick one or more interests so we can tailor your feed.</p>

                    <div className="mt-8 flex flex-wrap gap-2.5">
                      {vibeOptions.map((option) => {
                        const selected = form.tags.includes(option)
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => toggleItem('tags', option)}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                              selected
                                ? 'border-white/70 bg-white/25 text-white shadow-[0_8px_18px_rgba(0,0,0,0.25)] lg:border-[#3b82f6] lg:bg-[#3b82f6] lg:text-white lg:shadow-[0_8px_18px_rgba(59,130,246,0.35)]'
                                : 'border-white/30 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white lg:border-slate-200 lg:bg-white lg:text-slate-600 lg:hover:border-[#3b82f6]/40 lg:hover:text-[#1d4ed8]'
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

            {submitError && (
              <div className="mt-4 rounded-xl border border-red-300/40 bg-red-500/15 px-4 py-3 text-sm font-medium text-red-100 lg:border-red-200 lg:bg-red-50 lg:text-red-700">
                {submitError}
              </div>
            )}

            <div className="mt-10 flex gap-3">
              {step > 0 && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={goBack}
                  className="h-12 flex-1 rounded-xl border border-white/40 text-sm font-semibold text-white/90 transition hover:bg-white/10 lg:border-slate-200 lg:text-slate-700 lg:hover:bg-slate-50"
                >
                  Back
                </motion.button>
              )}
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.94 }}
                onClick={goNext}
                disabled={!canContinue || isSubmitting}
                className="h-12 flex-1 rounded-xl border border-white/50 bg-white/15 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(0,0,0,0.35)] transition hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-45 lg:border-none lg:bg-blue-600 lg:hover:bg-blue-700"
              >
                {isSubmitting ? 'Saving...' : step === 3 ? 'Finish Onboarding' : 'Continue'}
              </motion.button>
            </div>

            <div className="mt-6 flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => navigate('/home')}
                className="text-white/70 transition hover:text-white lg:text-slate-500 lg:hover:text-slate-700"
              >
                Skip for now
              </button>
              <a href="#" className="text-white/70 transition hover:text-white lg:text-slate-500 lg:hover:text-slate-700">
                Privacy Policy
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default () => (
  <ProtectedRoute>
    <OnboardingRoute />
  </ProtectedRoute>
)
