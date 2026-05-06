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
const languageOptions = [
  'English',
  'Hindi',
  'Bengali',
  'Tamil',
  'Telugu',
  'Marathi',
  'Gujarati',
  'Kannada',
  'Urdu',
  'Punjabi',
  'Spanish',
  'French',
  'German',
  'Japanese',
  'Mandarin',
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
      className="peer h-14 w-full rounded-2xl border border-slate-200 px-4 pt-5 text-sm outline-none transition focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/15"
      placeholder={placeholder}
    />
    <span className="pointer-events-none absolute left-4 top-4 origin-left text-sm text-slate-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:scale-85 peer-focus:text-[#1d4ed8] peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:scale-85">
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
    dateOfBirth: '',
    gender: '',
    location: '',
    occupation: '',
    languages: [] as string[],
    travelStyle: '',
    bio: '',
    tags: [] as string[],
  })

  const updateField = (key: keyof typeof form, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const toggleItem = (key: 'languages' | 'tags', value: string) => {
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
        dateOfBirth: form.dateOfBirth || undefined,
        gender: genderValue,
        location: form.location.trim() || undefined,
        occupation: form.occupation.trim() || undefined,
        languages: form.languages.length > 0 ? form.languages : undefined,
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
    <div className="relative min-h-screen bg-transparent text-slate-900 lg:bg-[#f8fbfb]">
      <div
        className="fixed inset-0 -z-10 lg:hidden"
        style={{
          backgroundImage: `url(${onboard})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="mx-auto flex min-h-screen max-w-[1520px]">
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

        <section className="mx-4 my-6 flex w-full items-center justify-center rounded-[28px] border border-white/60 bg-white/70 px-6 py-10 shadow-[0_30px_80px_rgba(15,23,42,0.16)] backdrop-blur-sm lg:mx-0 lg:my-0 lg:w-[620px] lg:rounded-none lg:border-none lg:bg-white lg:px-12 lg:shadow-none lg:backdrop-blur-none">
          <div className="w-full max-w-[430px]">
            <div className="mb-4 text-center text-lg font-bold font-display uppercase tracking-[0.45em] text-blue-700/80 lg:hidden">
              <img src={Logo} className="h-22 w-auto" /> 
            </div>
            <div className="mb-9">
              <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-600">
                <span>{`Step ${stepNumber} of ${TOTAL_STEPS}`}</span>
                <span className="text-blue-600">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <motion.div
                  className="h-full rounded-full bg-blue-600"
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
                    <p className="mt-2 text-sm text-slate-500">Tell us the basics so we can personalize your experience.</p>

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
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={form.dateOfBirth}
                          onChange={(e) => updateField('dateOfBirth', e.target.value)}
                          className="h-14 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/15"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h1 className="text-3xl font-bold leading-tight text-[#0f172a]">Your identity & background</h1>
                    <p className="mt-2 text-sm text-slate-500">Help us understand who you are and where you&apos;re from.</p>

                    <div className="mt-8 space-y-5">
                      <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Gender *</p>
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
                                    ? 'border-[#3b82f6] bg-[#3b82f6]/10 text-[#1d4ed8] shadow-[0_8px_20px_rgba(59,130,246,0.18)]'
                                    : 'border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-[#3b82f6]/40 hover:shadow-md'
                                }`}
                              >
                                {option}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <FloatingLabelInput
                        value={form.location}
                        onChange={(v) => updateField('location', v)}
                        label="City / Country"
                      />
                      <FloatingLabelInput
                        value={form.occupation}
                        onChange={(v) => updateField('occupation', v)}
                        label="Occupation"
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h1 className="text-3xl font-bold leading-tight text-[#0f172a]">Your travel style</h1>
                    <p className="mt-2 text-sm text-slate-500">How do you like to travel? Tell us about your style.</p>

                    <div className="mt-8 space-y-5">
                      <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Travel Style *</p>
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
                                    ? 'border-[#3b82f6] bg-[#3b82f6]/10 text-[#1d4ed8] shadow-[0_8px_20px_rgba(59,130,246,0.18)]'
                                    : 'border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-[#3b82f6]/40 hover:shadow-md'
                                }`}
                              >
                                {option}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Languages you speak</p>
                        <div className="flex flex-wrap gap-2">
                          {languageOptions.map((lang) => {
                            const selected = form.languages.includes(lang)
                            return (
                              <button
                                key={lang}
                                type="button"
                                onClick={() => toggleItem('languages', lang)}
                                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                                  selected
                                    ? 'border-[#3b82f6] bg-[#3b82f6] text-white shadow-[0_4px_12px_rgba(59,130,246,0.3)]'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-[#3b82f6]/40 hover:text-[#1d4ed8]'
                                }`}
                              >
                                {lang}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Short Bio
                        </label>
                        <textarea
                          value={form.bio}
                          onChange={(e) => updateField('bio', e.target.value)}
                          rows={3}
                          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/15"
                          placeholder="Tell travelers what makes your trips unforgettable..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h1 className="text-3xl font-bold leading-tight text-[#0f172a]">Choose your Vibe</h1>
                    <p className="mt-2 text-sm text-slate-500">Pick one or more interests so we can tailor your feed.</p>

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
                                ? 'border-[#3b82f6] bg-[#3b82f6] text-white shadow-[0_8px_18px_rgba(59,130,246,0.35)]'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-[#3b82f6]/40 hover:text-[#1d4ed8]'
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
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {submitError}
              </div>
            )}

            <div className="mt-10 flex gap-3">
              {step > 0 && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={goBack}
                  className="h-12 flex-1 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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
                className="h-12 flex-1 rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isSubmitting ? 'Saving...' : step === 3 ? 'Finish Onboarding' : 'Continue'}
              </motion.button>
            </div>

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

export default () => (
  <ProtectedRoute>
    <OnboardingRoute />
  </ProtectedRoute>
)
