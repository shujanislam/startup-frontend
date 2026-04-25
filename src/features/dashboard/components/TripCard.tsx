import '../styles/trip-card.css'

interface TripPlan {
  id: string
  name: string
  budget: number
  destination: string
  duration: number
  startDate: string
  rating: number
  imageUrl?: string
  tags?: string[]
}

interface TripCardProps {
  trip: TripPlan
  onClick?: () => void
}

const TripCard = ({ trip, onClick }: TripCardProps) => {
  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="trip-card" onClick={onClick}>
      {trip.imageUrl && (
        <div className="trip-card-image">
          <img src={trip.imageUrl} alt={trip.name} />
          <div className="trip-rating">
            <span className="rating-value">{trip.rating}</span>
            <span className="rating-label">★</span>
          </div>
        </div>
      )}

      <div className="trip-card-content">
        <h3 className="trip-name">{trip.name}</h3>

        <p className="trip-destination">
          <svg className="trip-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
          </svg>
          {trip.destination}
        </p>

        <div className="trip-details">
          <div className="detail-item">
            <span className="detail-label">Duration</span>
            <span className="detail-value">{trip.duration} days</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Start Date</span>
            <span className="detail-value">{trip.startDate}</span>
          </div>
        </div>

        <div className="trip-footer">
          <div className="trip-budget">
            <span className="budget-label">Budget</span>
            <span className="budget-value">{formatBudget(trip.budget)}</span>
          </div>
          <button type="button" className="view-btn">
            View Details
          </button>
        </div>

        {trip.tags && trip.tags.length > 0 && (
          <div className="trip-tags">
            {trip.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export { TripCard }
