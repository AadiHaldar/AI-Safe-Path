# SafeZone AI - Urban Safety Intelligence System

An AI-powered real-time urban safety decision engine that helps commuters find the safest routes using Google Maps, Vertex AI (Gemini), and Firebase.

## 🎯 Features

### Core Safety Features
- **AI-Based Safety Scoring** - Analyzes 5 weighted factors (police distance, hospitals, time of day, crowd level, crime index)
- **Multiple Route Options** - Safest, Balanced, and Least Traffic routes
- **Real-time Crime Heatmap** - Visual crime density zones on map
- **Crowd Density Visualization** - Shows crowded vs empty streets
- **Time-based Safety Scoring** - Adjusts scores for morning/afternoon/evening/night
- **Weather Impact Analysis** - Recommendations include weather warnings

### User Experience
- **Dynamic Location Search** - Google Places Autocomplete for worldwide locations
- **Emergency Mode** - Quick access to nearest police/hospital with calling
- **Route Sharing** - Share safe routes with friends
- **Route History** - Save favorite commute routes
- **Safety Breakdown** - AI-powered explanations of safety factors
- **Real-time Map** - Live Google Maps with street-level routing

### Technical Features
- **A* Pathfinding Algorithm** - Optimized route calculation
- **Firebase Integration** - Real-time unsafe area reporting
- **Gemini AI Integration** - Natural language safety explanations
- **Google Directions API** - Accurate street-level routing
- **Responsive Design** - Works on desktop and mobile

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Maps API Key
- Gemini API Key
- Firebase Config
- Vertex AI API Key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/safezone-ai.git
cd safezone-ai
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Add your API keys to `.env.local`:
```
VITE_GOOGLE_MAPS_API_KEY=your_key_here
VITE_GEMINI_API_KEY=your_key_here
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_PROJECT_ID=your_project_id
```

5. Start the development server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app running.

## 📁 Project Structure

```
safezone-ai/
├── src/
│   ├── components/
│   │   ├── Map.tsx                 # Google Maps with routes & heatmap
│   │   ├── LocationSearch.tsx      # Google Places Autocomplete
│   │   ├── SafetyInsights.tsx      # Route safety analysis display
│   │   ├── SafetyBreakdown.tsx     # AI safety factor breakdown
│   │   ├── EmergencyMode.tsx       # Emergency services modal
│   │   └── SafetyHeatmap.tsx       # Crime density visualization
│   ├── lib/
│   │   ├── ai-model.ts            # AI safety scoring algorithm
│   │   ├── astar.ts               # A* pathfinding algorithm
│   │   ├── gemini.ts              # Gemini API integration
│   │   ├── firebase-config.ts     # Firebase setup
│   │   └── google-maps.ts         # Google Maps utilities
│   ├── App.tsx                     # Main application
│   └── main.tsx                    # Entry point
├── .env.example                    # Environment variables template
├── package.json                    # Dependencies
└── README.md                       # This file
```

## 🔧 Configuration

### API Keys Setup

1. **Google Maps API**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable Maps JavaScript API, Places API, Directions API
   - Create an API key
   - Add to `.env.local`

2. **Gemini API**
   - Go to [Google AI Studio](https://aistudio.google.com)
   - Create an API key
   - Add to `.env.local`

3. **Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Copy config values
   - Add to `.env.local`

## 🎨 How It Works

### Safety Scoring Algorithm
```
Safety Score = (Police Distance × 0.25) + (Hospital Distance × 0.20) + 
               (Time of Day × 0.15) + (Crowd Level × 0.15) + 
               (Crime Index × 0.25)
```

### Route Analysis
1. User enters start and destination
2. System fetches 3 alternative routes from Google Directions API
3. Each route is analyzed for safety factors
4. Gemini AI generates natural language explanations
5. Routes are displayed with color coding:
   - 🟢 Green: Safest Route
   - 🟡 Amber: Balanced Route
   - 🔴 Red: Least Traffic Route

### Real-time Features
- Crime heatmap updates based on Firebase data
- Crowd density calculated from historical patterns
- Weather impact assessed in real-time
- Time-based scoring adjusts throughout the day

## 📊 Safety Factors

- **Lighting**: Street lighting quality (Poor/Fair/Good/Excellent)
- **Traffic Density**: Vehicle congestion (Low/Moderate/High)
- **Recent Incidents**: Crime reports in last 30 days
- **Weather Impact**: Current weather conditions (None/Minor/Major)
- **Crowd Level**: Pedestrian density (Low/Moderate/High)

## 🚨 Emergency Mode

Quick access to:
- Nearest police station with distance and ETA
- Nearest hospital with distance and ETA
- One-click calling (911)
- Navigation to emergency services

## 🔐 Security & Privacy

- API keys stored in environment variables (never committed)
- No personal data stored locally
- Firebase security rules restrict data access
- HTTPS only for all API calls

## 📱 Supported Locations

- Worldwide location search via Google Places
- Optimized for Indian cities (Delhi, Mumbai, Bangalore, etc.)
- Works with neighborhoods and localities
- Example: "Electronic City, Bangalore" → "MG Road, Bangalore"

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run TypeScript linter
```

### Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Maps**: Google Maps JavaScript API
- **AI**: Vertex AI (Gemini)
- **Database**: Firebase Firestore
- **Routing**: A* Algorithm + Google Directions API
- **UI Components**: shadcn/ui
- **Animations**: Motion (Framer Motion)

## 📈 Performance

- Route calculation: < 2 seconds
- Map rendering: < 1 second
- API response time: < 500ms
- Optimized for mobile devices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
## 🙏 Acknowledgments

- Google Maps Platform for routing and location services
- Vertex AI for safety analysis
- Firebase for real-time database
- shadcn/ui for beautiful components

---

**SafeZone AI** - Making urban commutes safer, one route at a time. 🛡️
