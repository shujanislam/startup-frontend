import type { FeaturedTrip } from '../types/trip'
import '../styles/featured-card.css'

interface FeaturedTripCardProps {
  trip: FeaturedTrip
  onClick?: () => void
}

const FeaturedTripCard = ({ trip, onClick }: FeaturedTripCardProps) => {
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`
  }

  return (
    <div className="featured-card" onClick={onClick}>
      {/* Background Image */}
      <img src={trip.imageUrl} alt={trip.name} className="featured-image" />

      {/* Dark Gradient Overlay */}
      <div className="featured-gradient" />

      {/* Badge */}
      <div className="featured-badge">{trip.badge}</div>

      {/* Content */}
      <div className="featured-content">
        <h2 className="featured-name">{trip.name}</h2>
        <p className="featured-description">{trip.description}</p>

        <div className="featured-info">
          <div className="featured-price">{formatPrice(trip.price)}</div>
          <div className="featured-details">
            <span className="detail-item">
              📍 {trip.destination}
            </span>
            <span className="detail-item">
              ⏱ {trip.duration} days
            </span>
            <span className="detail-item">
              ⭐ {trip.rating}
            </span>
          </div>
        </div>

        <button type="button" className="view-trip-btn">
          View Trip →
        </button>
      </div>
    </div>
  )
}

export { FeaturedTripCard }
