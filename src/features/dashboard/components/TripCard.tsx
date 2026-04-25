import type { Trip } from '../types/trip'
import '../styles/trip-card.css'

interface TripCardProps {
  trip: Trip
  onClick?: () => void
}

const TripCard = ({ trip, onClick }: TripCardProps) => {
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`
  }

  const getSeasonEmoji = (season: string) => {
    const seasonMap: Record<string, string> = {
      summer: '☀️',
      winter: '❄️',
      monsoon: '🌧️',
      autumn: '🍂',
      all: '🌍',
    }
    return seasonMap[season] || '🌍'
  }

  const displayTags = trip.tags.slice(0, 3)

  return (
    <div className="trip-card" onClick={onClick}>
      {/* Image Section with Badges */}
      <div className="trip-card-image">
        <img src={trip.imageUrl} alt={trip.name} className="trip-image" />

        {/* Top Right: Budget Badge */}
        <div className="badge badge-budget">
          {formatPrice(trip.price)}
        </div>

        {/* Top Left: Season Badge */}
        <div className="badge badge-season">
          <span className="season-emoji">{getSeasonEmoji(trip.season)}</span>
          <span className="season-text">
            {trip.season === 'all' ? 'All' : trip.season.charAt(0).toUpperCase() + trip.season.slice(1)}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="trip-card-content">
        <h3 className="trip-name">{trip.name}</h3>
        <p className="trip-description">{trip.description}</p>

        {/* Info Row */}
        <div className="trip-info-row">
          <span className="trip-info-item">
            📍 {trip.destination}
          </span>
          <span className="trip-info-item">
            ⏱ {trip.duration}d
          </span>
          <span className="trip-info-item">
            ⭐ {trip.rating}
          </span>
        </div>

        {/* Tags Row */}
        {displayTags.length > 0 && (
          <div className="trip-tags">
            {displayTags.map((tag) => (
              <span key={tag} className="trip-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Button */}
        <button type="button" className="view-full-plan-btn">
          View Full Plan
        </button>
      </div>
    </div>
  )
}

export { TripCard }
