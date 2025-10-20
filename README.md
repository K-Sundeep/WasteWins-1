# WasteWins - Eco-Friendly Donation Platform

A modern, full-featured platform for managing waste donations and recycling with real-time location tracking, carbon impact calculations, and rewards system.

## Features

### Core Features
- **Smart Pickup Locations** - Find unlimited real recycling centers using OpenStreetMap
- **Location Search** - Search any city worldwide with autocomplete
- **Real-time Geolocation** - Automatic "near me" functionality
- **Impact Tracking** - Track your carbon savings and environmental impact
- **Rewards System** - Earn points for donations and redeem rewards
- **User Dashboard** - Personal statistics and donation history
- **Weather & AQI** - Real-time weather and air quality information
- **Secure Authentication** - Supabase-powered auth system

### Technical Features
- **Fast & Modern** - Built with React 18, Vite, and TypeScript
- **Beautiful UI** - Tailwind CSS with shadcn/ui components
- **Responsive Design** - Works perfectly on all devices
- **Error Boundaries** - Graceful error handling
- **Optimistic Updates** - Smooth user experience
- **Multiple APIs** - Google Maps, Mapbox, OpenStreetMap integration
- **Smart Caching** - Reduced API calls with intelligent caching
- **Accessible** - WCAG compliant components

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- (Optional) Google Maps API key for enhanced search
- (Optional) Mapbox token for driving distances
- (Optional) climatiq API key for carbon calculations

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd WasteWins1

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your API keys to .env (optional but recommended)
# Edit .env and add your keys

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

## Environment Variables

Create a `.env` file in the root directory:

```bash
# climatiq API (for carbon calculations)
VITE_CLIMATIQ_API_KEY=your_key_here

# Google Maps API (for location search autocomplete)
VITE_GOOGLE_MAPS_API_KEY=your_key_here

# Mapbox API (for driving distance calculations)
VITE_MAPBOX_TOKEN=your_token_here

# App Settings
VITE_DEFAULT_PICKUP_DISTANCE_KM=5
VITE_FREE_ONLY_MODE=false
```

### Getting API Keys

1. **Google Maps API** (Free tier: 2,800 searches/month)
   - Visit: https://console.cloud.google.com/
   - Enable: Places API, Geocoding API
   - [Detailed Guide](./CITY_SEARCH_FIX.md)

2. **Mapbox Token** (Free tier: 50,000 requests/month)
   - Visit: https://www.mapbox.com/
   - Create account and get token

3. **Climatiq API** (Free tier available)
   - Visit: https://www.climatiq.io/
   - Sign up for API key

**Note:** The app works without API keys but with reduced functionality:
- **Manual city search (25+ cities)
- **Browser geolocation
- **Real recycling centers from OSM
- **Straight-line distance calculations
- **No full address autocomplete (requires Google Maps)
- **No driving distance (requires Mapbox)

## Project Structure

```
WasteWins1/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── ErrorBoundary.tsx
│   │   ├── Loading.tsx
│   │   ├── PickupLocationsDialog.tsx
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── useApi.tsx
│   │   ├── useOpenData.ts
│   │   ├── usePlaces.ts
│   │   └── ...
│   ├── lib/                # Third-party integrations
│   │   ├── mapbox.ts
│   │   └── google.ts
│   ├── utils/              # Utility functions
│   │   ├── distance.ts
│   │   ├── cities.ts
│   │   ├── env.ts
│   │   └── ...
│   ├── types/              # TypeScript types
│   ├── constants/          # App constants
│   ├── supabase/           # Backend functions
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── .env                    # Environment variables (create this)
├── .env.example            # Environment template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Available Scripts

```bash
# Development
npm run dev          # Start dev server at localhost:3000

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Deployment
npm run deploy       # Deploy to production (if configured)
```

## Key Components

### PickupLocationsDialog
- Dynamic location search with 25+ cities
- Real-time OSM data fetching
- Interactive map with markers
- Distance calculations
- Smart filtering

### QuickDonate
- Multi-category waste selection
- Weight estimation
- Address autocomplete
- Time slot selection
- Carbon impact preview

### ImpactTracker
- Personal carbon savings
- Community impact statistics
- Visual charts and graphs
- Achievement milestones

### RewardsStore
- Points-based rewards
- Category filtering
- Redemption system
- User balance tracking

## Configuration

### TypeScript
Configured for strict mode with modern ES2020 features. See `tsconfig.json`.

### Vite
Optimized build configuration with SWC for fast compilation. See `vite.config.ts`.

### Tailwind CSS
Custom theme with design tokens. See `src/index.css`.

## Troubleshooting

### Map not rendering
- Ensure Leaflet CSS is imported in `main.tsx`
- Check browser console for errors
- Verify coordinates are valid

### Location search not working
- Check if `VITE_GOOGLE_MAPS_API_KEY` is set
- Verify API key has Places API enabled
- Try manual city search (works without API key)

### No recycling centers found
- Check browser location permission
- Try searching a different location
- Verify internet connection

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Documentation

- [Pickup Locations Upgrade](./PICKUP_LOCATIONS_UPGRADE.md) - Feature documentation
- [City Search Fix](./CITY_SEARCH_FIX.md) - Search implementation guide
- [Testing Guide](./TESTING_GUIDE.md) - Comprehensive testing instructions
- [Backend Enhancements](./BACKEND_ENHANCEMENTS.md) - Optional backend features
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Technical overview

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- **OpenStreetMap** - Free, open-source map data
- **shadcn/ui** - Beautiful, accessible UI components
- **Leaflet** - Interactive map library
- **Supabase** - Backend and authentication
- **Vercel** - Analytics and deployment

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting guide

---

**Made with ❤️ for a sustainable future** 🌍pendencies.
