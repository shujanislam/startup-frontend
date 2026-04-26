import type { Trip, FeaturedTrip, TripDetail } from '../types/trip'

export const featuredTrip: FeaturedTrip = {
  id: 'featured-1',
  name: 'Tawang Monastery Trek',
  description: 'Experience the serene beauty of the highest Buddhist monastery in India.',
  destination: 'Tawang, Arunachal Pradesh',
  duration: 5,
  startDate: '2026-06-15',
  price: 3800,
  season: 'summer',
  tags: ['Adventure', 'Culture', 'Nature'],
  rating: 4.8,
  imageUrl:
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
  isFeatured: true,
  badge: '🔥 Most Popular This Season',
}

export const allTrips: Trip[] = [
  {
    id: '1',
    name: 'Manali-Leh Highway',
    description: 'Epic motorcycle journey through the highest motorable pass in the world.',
    destination: 'Manali to Leh, Ladakh',
    duration: 8,
    startDate: '2026-07-01',
    price: 2500,
    season: 'summer',
    tags: ['Adventure', 'Scenic Route', 'Thrill'],
    rating: 4.9,
    imageUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    name: 'Kasol Backpacking',
    description: 'Peaceful mountain village perfect for relaxation and trekking.',
    destination: 'Kasol, Himachal Pradesh',
    duration: 3,
    startDate: '2026-06-20',
    price: 1200,
    season: 'summer',
    tags: ['Budget-friendly', 'Relaxation', 'Hiking'],
    rating: 4.6,
    imageUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    name: 'Goa Beach Paradise',
    description: 'Sun, sand, and sea with vibrant nightlife and water sports.',
    destination: 'Goa',
    duration: 4,
    startDate: '2026-07-15',
    price: 1500,
    season: 'winter',
    tags: ['Beach', 'Nightlife', 'Water Sports'],
    rating: 4.5,
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
  },
  {
    id: '4',
    name: 'Darjeeling Tea Gardens',
    description: 'Explore the misty mountains and world-famous tea plantations.',
    destination: 'Darjeeling, West Bengal',
    duration: 6,
    startDate: '2026-08-10',
    price: 2200,
    season: 'autumn',
    tags: ['Culture', 'Nature', 'Food'],
    rating: 4.7,
    imageUrl:
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
  },
  {
    id: '5',
    name: 'Kerala Backwaters',
    description: 'Serene houseboats through palm-fringed backwaters and rice fields.',
    destination: 'Kerala',
    duration: 5,
    startDate: '2026-08-20',
    price: 3200,
    season: 'monsoon',
    tags: ['Relaxation', 'Scenic', 'Unique Experience'],
    rating: 4.8,
    imageUrl:
      'https://images.unsplash.com/photo-1506315996181-152e573f1707?w=400&h=300&fit=crop',
  },
  {
    id: '6',
    name: 'Jaisalmer Desert Safari',
    description: 'Experience the golden dunes with camel rides and desert camps.',
    destination: 'Jaisalmer, Rajasthan',
    duration: 3,
    startDate: '2026-09-05',
    price: 1800,
    season: 'winter',
    tags: ['Adventure', 'Desert', 'Cultural'],
    rating: 4.4,
    imageUrl:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
  },
]

// Detailed trip data for trip detail page
export const tripDetails: Record<string, TripDetail> = {
  'featured-1': {
    id: 'featured-1',
    name: 'Tawang Monastery Trek',
    description: 'Experience the serene beauty of the highest Buddhist monastery in India.',
    destination: 'Tawang, Arunachal Pradesh',
    duration: 5,
    startDate: '2026-06-15',
    endDate: '2026-06-19',
    price: 3800,
    season: 'summer',
    tags: ['Adventure', 'Culture', 'Nature'],
    rating: 4.8,
    imageUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
    spots: ['Tawang Monastery', 'Sela Pass', 'Jatsingha Falls', 'Nuranang Falls'],
    hotels: [
      {
        id: 'h1',
        name: 'Tawang Lodge',
        address: 'Tawang Bazaar, Tawang',
        budget: 2500,
      },
      {
        id: 'h2',
        name: 'Hotel Orchid',
        address: 'Main Street, Tawang',
        budget: 1800,
      },
    ],
    vehicles: [
      {
        id: 'v1',
        name: 'Innova Crysta',
        carNumber: 'AR01AB1234',
        driverName: 'Tenzin Dorjee',
        driverPhone: '+91-9876543210',
        budget: 5000,
      },
    ],
    identification: true,
    permit: 'Valid Indian ID / Passport required',
    affiliateLinks: [
      {
        title: 'Book on TravelTriangle',
        url: 'https://traveltriangle.com',
      },
      {
        title: 'Arunachal Pradesh Tourism',
        url: 'https://arunachaltourism.gov.in',
      },
    ],
    additional:
      'Tawang is one of the most serene destinations in Northeast India. The highest Buddhist monastery offers spectacular views. Best visited from May to September. Weather can be unpredictable, so pack warm clothes. The last stretch to Tawang is steep, so take it slow.',
    createdBy: 'Sarah Adventures',
    createdAt: '2026-04-15',
  },
  '1': {
    id: '1',
    name: 'Manali-Leh Highway',
    description: 'Epic motorcycle journey through the highest motorable pass in the world.',
    destination: 'Manali to Leh, Ladakh',
    duration: 8,
    startDate: '2026-07-01',
    endDate: '2026-07-09',
    price: 2500,
    season: 'summer',
    tags: ['Adventure', 'Scenic Route', 'Thrill'],
    rating: 4.9,
    imageUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    spots: ['Sarchu', 'Keylong', 'Khardung La Pass', 'Pangong Lake'],
    hotels: [
      {
        id: 'h1',
        name: 'Sarchu Resort',
        address: 'Sarchu, Himachal Pradesh',
        budget: 3000,
      },
      {
        id: 'h2',
        name: 'Leh Palace Hotel',
        address: 'Leh, Ladakh',
        budget: 4500,
      },
    ],
    vehicles: [
      {
        id: 'v1',
        name: 'Royal Enfield Bullet',
        carNumber: 'DL01AB1234',
        driverName: 'Raj Kumar',
        driverPhone: '+91-9876543210',
        budget: 12000,
      },
    ],
    identification: true,
    permit: 'Valid Indian ID / Passport',
    affiliateLinks: [
      {
        title: 'Book on TravelTriangle',
        url: 'https://traveltriangle.com',
      },
      {
        title: 'PlugBike - Ride Rental',
        url: 'https://plugbike.com',
      },
    ],
    additional:
      'This is one of the most challenging and scenic routes in India. Weather conditions can change rapidly. Ensure your bike is well-maintained and carry basic repair tools. Altitude sickness is common, so acclimatize properly.',
    createdBy: 'Adventure Mike',
    createdAt: '2026-03-20',
  },
  '2': {
    id: '2',
    name: 'Kasol Backpacking',
    description: 'Peaceful mountain village perfect for relaxation and trekking.',
    destination: 'Kasol, Himachal Pradesh',
    duration: 3,
    startDate: '2026-06-20',
    endDate: '2026-06-23',
    price: 1200,
    season: 'summer',
    tags: ['Budget-friendly', 'Relaxation', 'Hiking'],
    rating: 4.6,
    imageUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    spots: ['Kasol Village', 'Parvati Valley', 'Kheerganga', 'Chalal'],
    hotels: [
      {
        id: 'h1',
        name: 'Kasol Backpackers',
        address: 'Main Bazaar, Kasol',
        budget: 800,
      },
    ],
    vehicles: [
      {
        id: 'v1',
        name: 'Local Bus',
        carNumber: 'HP78CD5678',
        driverName: 'Mohan',
        driverPhone: '+91-9876543211',
        budget: 500,
      },
    ],
    identification: false,
    permit: 'None',
    affiliateLinks: [
      {
        title: 'Kasol Travel Guide',
        url: 'https://kasol.travel',
      },
    ],
    additional:
      'Kasol is a paradise for budget travelers and backpackers. The weather is pleasant throughout the year. Many hiking trails available. Restaurants serve great Israeli and Italian food. Perfect for solo travelers.',
    createdBy: 'Budget Backpackers',
    createdAt: '2026-02-10',
  },
  '3': {
    id: '3',
    name: 'Goa Beach Paradise',
    description: 'Sun, sand, and sea with vibrant nightlife and water sports.',
    destination: 'Goa',
    duration: 4,
    startDate: '2026-07-15',
    endDate: '2026-07-19',
    price: 1500,
    season: 'winter',
    tags: ['Beach', 'Nightlife', 'Water Sports'],
    rating: 4.5,
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    spots: ['Baga Beach', 'Anjuna Beach', 'Fort Aguada', 'Old Town of Goa'],
    hotels: [
      {
        id: 'h1',
        name: 'Sea Resort Goa',
        address: 'Baga Beach, Goa',
        budget: 3500,
      },
      {
        id: 'h2',
        name: 'Budget Beach Huts',
        address: 'Anjuna Beach, Goa',
        budget: 1500,
      },
    ],
    vehicles: [
      {
        id: 'v1',
        name: 'Tuk Tuk',
        carNumber: 'GA03MN9012',
        driverName: 'Carlos',
        driverPhone: '+91-9876543212',
        budget: 2000,
      },
    ],
    identification: false,
    permit: 'None',
    affiliateLinks: [
      {
        title: 'Goa Tourism Board',
        url: 'https://goatourism.gov.in',
      },
      {
        title: 'Water Sports Booking',
        url: 'https://goawatersports.com',
      },
    ],
    additional:
      'Goa is known for its beautiful beaches, Portuguese architecture, and vibrant nightlife. Best visited from October to March. December and January are peak season. Try local Goan cuisine and fresh seafood.',
    createdBy: 'Beach Explorer',
    createdAt: '2026-01-05',
  },
  '4': {
    id: '4',
    name: 'Darjeeling Tea Gardens',
    description: 'Explore the misty mountains and world-famous tea plantations.',
    destination: 'Darjeeling, West Bengal',
    duration: 6,
    startDate: '2026-08-10',
    endDate: '2026-08-16',
    price: 2200,
    season: 'autumn',
    tags: ['Culture', 'Nature', 'Food'],
    rating: 4.7,
    imageUrl:
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
    spots: [
      'Darjeeling Tea Gardens',
      'Tiger Hill',
      'Batasia Loop',
      'Himalayan Mountaineering Institute',
    ],
    hotels: [
      {
        id: 'h1',
        name: 'Tea Garden Resort',
        address: 'Darjeeling Hill Station, West Bengal',
        budget: 2500,
      },
      {
        id: 'h2',
        name: 'Cozy Mountain Lodge',
        address: 'Main Bazaar, Darjeeling',
        budget: 1800,
      },
    ],
    vehicles: [
      {
        id: 'v1',
        name: 'Tempo Traveller',
        carNumber: 'WB76GH3456',
        driverName: 'Kumar Singh',
        driverPhone: '+91-9876543213',
        budget: 4500,
      },
    ],
    identification: true,
    permit: 'Valid Indian ID / Passport',
    affiliateLinks: [
      {
        title: 'Darjeeling Tourism',
        url: 'https://darjeelingtourism.org',
      },
      {
        title: 'Tea Estate Tours',
        url: 'https://darjeelingtea.com',
      },
    ],
    additional:
      'Darjeeling is famous for its black tea and stunning views of Kanchenjunga. The toy train ride is a must-do experience. Best visited from September to November. Fog can be dense in early mornings, so plan accordingly.',
    createdBy: 'Tea Lover Tours',
    createdAt: '2026-02-15',
  },
  '5': {
    id: '5',
    name: 'Kerala Backwaters',
    description: 'Serene houseboats through palm-fringed backwaters and rice fields.',
    destination: 'Kerala',
    duration: 5,
    startDate: '2026-08-20',
    endDate: '2026-08-25',
    price: 3200,
    season: 'monsoon',
    tags: ['Relaxation', 'Scenic', 'Unique Experience'],
    rating: 4.8,
    imageUrl:
      'https://images.unsplash.com/photo-1506315996181-152e573f1707?w=400&h=300&fit=crop',
    spots: ['Alleppey Backwaters', 'Kumarakom', 'Kottayam', 'Vembanad Lake'],
    hotels: [
      {
        id: 'h1',
        name: 'Houseboat Resort',
        address: 'Alleppey, Kerala',
        budget: 5000,
      },
    ],
    vehicles: [
      {
        id: 'v1',
        name: 'Houseboat Shikara',
        carNumber: 'KL-HB-001',
        driverName: 'Prakash',
        driverPhone: '+91-9876543214',
        budget: 8000,
      },
    ],
    identification: false,
    permit: 'None',
    affiliateLinks: [
      {
        title: 'Kerala Tourism',
        url: 'https://keralatourism.org',
      },
      {
        title: 'Houseboat Booking',
        url: 'https://backwaters.kerala.com',
      },
    ],
    additional:
      'Kerala backwaters offer a unique and serene experience. The best time to visit is from November to February. During monsoon season (June-August), the landscape is lush green. Ayurvedic treatments are available at most resorts.',
    createdBy: 'Wellness Retreats',
    createdAt: '2026-01-25',
  },
  '6': {
    id: '6',
    name: 'Jaisalmer Desert Safari',
    description: 'Experience the golden dunes with camel rides and desert camps.',
    destination: 'Jaisalmer, Rajasthan',
    duration: 3,
    startDate: '2026-09-05',
    endDate: '2026-09-08',
    price: 1800,
    season: 'winter',
    tags: ['Adventure', 'Desert', 'Cultural'],
    rating: 4.4,
    imageUrl:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
    spots: ['Khuri Desert', 'Jaisalmer Fort', 'Gadisar Lake', 'Sam Sand Dunes'],
    hotels: [
      {
        id: 'h1',
        name: 'Desert Camp Resort',
        address: 'Sam Dunes, Jaisalmer',
        budget: 2000,
      },
      {
        id: 'h2',
        name: 'Fort View Hotel',
        address: 'Jaisalmer City, Rajasthan',
        budget: 1500,
      },
    ],
    vehicles: [
      {
        id: 'v1',
        name: 'Camel',
        carNumber: 'CAMEL-001',
        driverName: 'Ahmed',
        driverPhone: '+91-9876543215',
        budget: 1200,
      },
    ],
    identification: false,
    permit: 'None',
    affiliateLinks: [
      {
        title: 'Jaisalmer Tourism',
        url: 'https://jaisalmertourism.com',
      },
    ],
    additional:
      'Jaisalmer is known for its golden fort and desert safaris. The best time to visit is October to March. Camel safaris are the highlight, offering sunset and sunrise experiences. The local Rajasthani culture is rich and welcoming.',
    createdBy: 'Desert Adventures',
    createdAt: '2026-03-01',
  },
}
