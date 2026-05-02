import { useState, useEffect, type FormEvent } from 'react'
import type { Review, ReviewEligibility } from '../../services/packageApi'
import { fetchPackageReviews, createPackageReview, fetchReviewEligibility } from '../../services/packageApi'
import { useAuth } from '../../../auth/hooks/useAuth'

interface TripDetailReviewsProps {
  packageId: string
  isRevealed: boolean
}

const StarRating = ({
  value,
  onChange,
  readOnly = false,
}: {
  value: number
  onChange?: (v: number) => void
  readOnly?: boolean
}) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => {
        const star = i + 1
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(star)}
            className={`text-lg leading-none transition-colors ${
              star <= value ? 'text-amber-400' : 'text-gray-300'
            } ${readOnly ? '' : 'hover:text-amber-300'}`}
          >
            ★
          </button>
        )
      })}
    </div>
  )
}

const formatDate = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

const TripDetailReviews = ({ packageId, isRevealed }: TripDetailReviewsProps) => {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [eligibility, setEligibility] = useState<ReviewEligibility | null>(null)
  const [eligibilityLoading, setEligibilityLoading] = useState(false)
  const [eligibilityError, setEligibilityError] = useState<string | null>(null)

  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchPackageReviews(packageId)
      .then((data) => {
        if (!cancelled) setReviews(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load reviews')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [packageId])

  useEffect(() => {
    if (!user) {
      setEligibility(null)
      setEligibilityError(null)
      setEligibilityLoading(false)
      return
    }

    let cancelled = false
    setEligibilityLoading(true)
    setEligibilityError(null)

    fetchReviewEligibility(packageId)
      .then((data) => {
        if (!cancelled) setEligibility(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setEligibilityError(err instanceof Error ? err.message : 'Failed to check review eligibility')
        }
      })
      .finally(() => {
        if (!cancelled) setEligibilityLoading(false)
      })

    return () => { cancelled = true }
  }, [packageId, user, isRevealed])

  const buildEligibilityMessage = (info: ReviewEligibility) => {
    if (!info.revealed) {
      return 'Unlock the trip to leave a review.'
    }

    if (info.canReview) {
      return ''
    }

    const dateLabel = info.reviewAvailableAt ? formatDate(info.reviewAvailableAt) : 'soon'
    if (info.daysRemaining !== null && info.daysRemaining > 0) {
      const suffix = info.daysRemaining === 1 ? '' : 's'
      return `Reviews unlock on ${dateLabel} (${info.daysRemaining} day${suffix} remaining).`
    }

    return `Reviews unlock on ${dateLabel}.`
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!eligibility?.canReview) {
      setSubmitError('Reviews unlock 3 days after unlocking the trip.')
      return
    }

    if (rating === 0 || !text.trim()) {
      setSubmitError('Please provide a rating and review text.')
      return
    }

    setSubmitError(null)
    setSubmitting(true)

    try {
      await createPackageReview({ packageId, review: text.trim(), rating })
      setText('')
      setRating(0)
      const fresh = await fetchPackageReviews(packageId)
      setReviews(fresh)
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Reviews</h3>

      {user && (
        <>
          {eligibilityLoading && (
            <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
              Checking when you can post a review...
            </div>
          )}

          {!eligibilityLoading && eligibilityError && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {eligibilityError}
            </div>
          )}

          {!eligibilityLoading && !eligibilityError && eligibility && !eligibility.canReview && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {buildEligibilityMessage(eligibility)}
            </div>
          )}

          {!eligibilityLoading && !eligibilityError && eligibility?.canReview && (
            <form
              onSubmit={handleSubmit}
              className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <p className="mb-2 text-sm font-medium text-gray-700">Write a review</p>
              <div className="mb-3">
                <StarRating value={rating} onChange={setRating} />
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-400 focus:bg-white transition"
              />
              {submitError && (
                <p className="mt-2 text-xs text-red-600">{submitError}</p>
              )}
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {submitting ? 'Posting...' : 'Post Review'}
                </button>
              </div>
            </form>
          )}
        </>
      )}

      {loading && (
        <div className="flex items-center gap-2 py-6">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-sm text-gray-500">Loading reviews...</p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center">
          <p className="text-sm font-medium text-gray-700">No reviews yet</p>
          <p className="mt-1 text-xs text-gray-500">
            {user ? 'Be the first to share your thoughts.' : 'Log in to leave a review.'}
          </p>
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  {r.userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{r.userName}</p>
                  <div className="flex items-center gap-2">
                    <StarRating value={r.rating} readOnly />
                    <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-700">{r.review}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { TripDetailReviews }
