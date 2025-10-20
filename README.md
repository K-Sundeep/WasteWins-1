# WasteWins - Eco-Friendly Donation Platform

A modern, full-stack platform for managing waste donations and recycling with location-based recycling center finder, carbon impact tracking, and rewards system. Built with React + Express.js and designed to work completely free without external API dependencies.

## Features

### Core Features
- **Recycling Center Finder** - 31+ recycling centers across India with smart location search
- **Real-time Geolocation** - Browser-based location detection with 50km search radius
- **Donation Tracking** - Complete donation management with category selection and weight tracking
- **Carbon Impact Calculations** - Real carbon footprint reduction calculations via Climatiq API
- **Rewards & Points System** - Earn points for donations and track achievements
- **User Authentication** - Complete user registration, login, and profile management
- **Distance Calculations** - Haversine formula for accurate straight-line distances
- **Full-Stack Architecture** - Express.js backend with PostgreSQL database

### Technical Features
- **Modern Frontend** - React 18 + TypeScript + Vite for fast development
- **Beautiful UI** - Tailwind CSS with shadcn/ui components and responsive design
- **Robust Backend** - Express.js API with PostgreSQL database and JWT authentication
- **Free-Only Mode** - Works completely without external API costs or dependencies
- **Built-in Alternatives** - Haversine distance calculations and browser geolocation
- **OpenStreetMap Integration** - Free map data for recycling center locations
- **Real-time Updates** - Live data synchronization between frontend and backend
- **Production Ready** - Optimized build process and deployment configuration

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (for backend)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd WasteWins1

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Environment is already configured for free-only mode
# No API keys required!

# Start backend server (Terminal 1)
cd backend
npm run dev

# Start frontend server (Terminal 2)
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/v1

## Configuration

The application is pre-configured to work in **Free-Only Mode** with no external API dependencies required.

### Current Configuration
- ✅ **Backend API:** http://localhost:5000/api/v1
- ✅ **Climatiq API:** Pre-configured for carbon calculations
- ✅ **Free-Only Mode:** Enabled (no external costs)
- ✅ **Distance Calculations:** Haversine formula (built-in)
- ✅ **Location Services:** Browser geolocation + manual input

### What Works Out of the Box
- 🗺️ **31+ Recycling Centers** across major Indian cities
- 📍 **Smart Location Detection** with 50km search radius
- 🌱 **Real Carbon Impact** calculations
- 🎯 **Complete Rewards System** with points and achievements
- 👤 **User Management** with authentication and profiles
- 📊 **Donation Tracking** with full history and analytics

## Project Structure

```
WasteWins1/
├── src/                    # Frontend React application
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── AuthProvider.tsx
│   │   ├── LifecycleTracker.tsx
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   │   ├── useApi.tsx     # Backend API integration
│   │   ├── useOpenData.ts # Recycling centers data
│   │   └── ...
│   ├── data/              # Static data
│   │   └── customRecyclingCenters.ts # 31+ centers across India
│   ├── services/          # API services
│   │   └── indiaRecyclingApi.ts
│   ├── utils/             # Utility functions
│   │   ├── env.ts         # Environment validation
│   │   └── ...
│   ├── constants/         # App constants
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── backend/               # Express.js API server
│   ├── src/              # Backend source code
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Database models
│   │   └── server.ts     # Server entry point
│   ├── package.json      # Backend dependencies
│   └── .env              # Backend configuration
├── .env                  # Frontend environment variables
├── package.json          # Frontend dependencies
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite build configuration
└── README.md             # This file
```

## Available Scripts

### Frontend
```bash
npm run dev          # Start frontend dev server (localhost:3000)
npm run build        # Build frontend for production
npm run preview      # Preview production build
```

### Backend
```bash
cd backend
npm run dev          # Start backend dev server (localhost:5000)
npm run build        # Build backend for production
npm start            # Start production backend server
```

## Key Features

### Recycling Center Finder
- 31+ recycling centers across major Indian cities
- Smart location-based search with 50km radius
- Real-time distance calculations using Haversine formula
- Interactive map display with center details
- Browser geolocation integration

### Donation Management
- Multi-category waste selection (Clothes, Plastic, Paper, Electronics, etc.)
- Weight tracking and estimation
- Carbon impact calculations for each donation
- Complete donation history and analytics
- Points earning system

### User System
- User registration and authentication
- Personal profile management
- Donation history tracking
- Rewards and achievements system
- Community impact statistics

### Backend API
- RESTful API with Express.js and PostgreSQL
- JWT-based authentication
- Real-time data synchronization
- Comprehensive donation and user management
- Impact calculation endpoints

## Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS + shadcn/ui** for modern, responsive UI
- **React Leaflet** for interactive maps
- **React Hook Form** for form management

### Backend
- **Express.js** with TypeScript for robust API
- **PostgreSQL** for reliable data storage
- **JWT** for secure authentication
- **CORS** enabled for cross-origin requests
- **Helmet** for security headers

### APIs & Services
- **Climatiq API** for accurate carbon calculations
- **OpenStreetMap** for free map data
- **Browser Geolocation API** for location services

## Troubleshooting

### Backend not connecting
```bash
# Check if backend is running
cd backend
npm run dev
# Should show: Server running on port 5000
```

### Frontend API errors
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify `VITE_API_URL=http://localhost:5000/api/v1` in `.env`

### No recycling centers found
- Check browser location permission
- Try refreshing the page
- Verify internet connection for geolocation

### Database connection issues
- Ensure PostgreSQL is installed and running
- Check backend `.env` file for database credentials
- Backend will auto-create tables on first run

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# For backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

## Development

### Adding New Recycling Centers
Edit `src/data/customRecyclingCenters.ts` to add more centers:
```typescript
{
  id: 'custom-new-1',
  name: 'Your Recycling Center',
  lat: 12.9716,
  lon: 77.5946,
  address: 'Your Address',
  services: ['Plastic', 'Paper', 'Electronics'],
  // ... other properties
}
```

### API Endpoints
- `GET /api/v1/donations` - Get user donations
- `POST /api/v1/donations` - Create new donation
- `GET /api/v1/user/profile` - Get user profile
- `GET /api/v1/rewards` - Get available rewards
- `GET /api/v1/impact/community` - Get community impact stats

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- **OpenStreetMap** - Free, open-source map data for recycling centers
- **shadcn/ui** - Beautiful, accessible UI components
- **React Leaflet** - Interactive map library for location display
- **Climatiq** - Carbon footprint calculation API
- **Express.js** - Fast, unopinionated web framework for Node.js
- **PostgreSQL** - Powerful, open-source relational database

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting guide

---

**Made with ❤️ for a sustainable future** 🌍pendencies.
