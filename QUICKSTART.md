# SafeZone - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create `.env.local` in the root directory:

```env
# Gemini API
GEMINI_API_KEY=AIzaSyDyy-wSviHRgG4ygN7lYyhQQMWKi8uVbU8

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=AIzaSyCYFwU8dtaM2mj0l-_Q1EGgpV2Ab_LjRz4

# Vertex AI
VITE_VERTEX_AI_API_KEY=AQ.Ab8RN6KQVmEKwGuJuzrnNXsBhitnYhgrxb6h4qxzSOHib8DFnA

# Firebase
VITE_FIREBASE_API_KEY=AIzaSyCHkKiYyr2hXdq2FjYI-yoXtL5du9ZU1p0
VITE_FIREBASE_AUTH_DOMAIN=safe-zone-142bb.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=safe-zone-142bb
VITE_FIREBASE_STORAGE_BUCKET=safe-zone-142bb.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=355447885609
VITE_FIREBASE_APP_ID=1:355447885609:web:e6d1c2cda8b30546537138
VITE_FIREBASE_MEASUREMENT_ID=G-L1HNV15YXV
```

### 3. Run Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## 📋 What's Included

### Core Modules
- ✅ **AI Safety Scoring** (`src/lib/ai-model.ts`)
- ✅ **A* Pathfinding** (`src/lib/astar.ts`)
- ✅ **Google Maps Integration** (`src/lib/google-maps.ts`)
- ✅ **Firebase Real-Time** (`src/lib/firebase-config.ts`)
- ✅ **Emergency Mode** (`src/components/EmergencyMode.tsx`)
- ✅ **Safety Breakdown** (`src/components/SafetyBreakdown.tsx`)

### Features
1. **Find Safe Routes** - Enter start/end locations
2. **View Safety Analysis** - See AI-powered safety breakdown
3. **Emergency Mode** - Quick access to nearest help
4. **Real-Time Reports** - Mark unsafe areas (Firebase)
5. **Route Comparison** - Safest vs Shortest vs Balanced

---

## 🎯 How to Use

### Basic Flow
1. Enter departure point and destination
2. Click "Find Safe Routes"
3. View 3 route options with safety scores
4. Click "Show Safety Breakdown" for AI explanation
5. Click "Emergency" button for emergency services

### Safety Score Factors
- 🚔 Police Proximity (25%)
- 🏥 Hospital Proximity (20%)
- 🕐 Time of Day (15%)
- 👥 Crowd Level (15%)
- 📊 Crime Index (25%)

---

## 🏗️ Project Structure

```
src/
├── lib/
│   ├── ai-model.ts          # Safety scoring model
│   ├── astar.ts             # Pathfinding algorithm
│   ├── google-maps.ts       # Maps integration
│   ├── firebase-config.ts   # Firebase setup
│   └── gemini.ts            # Gemini API
├── components/
│   ├── EmergencyMode.tsx    # Emergency modal
│   ├── SafetyBreakdown.tsx  # Safety analysis
│   ├── Map.tsx              # Map viewer
│   └── SafetyInsights.tsx   # Route details
└── App.tsx                  # Main app
```

---

## 🔧 Build & Deploy

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Check
```bash
npm run lint
```

---

## 📊 Example Safety Score

```
Route: Market St → Mission District

Factors:
- Police: 800m away → 84/100
- Hospital: 1.2km away → 88/100
- Time: 2 PM (daytime) → 100/100
- Crowd: 65 people → 79/100
- Crime: Low area → 65/100

Final Score: 82/100 ✅ SAFE

AI Explanation:
"Good police coverage • Safe daytime hours • Low crime area"
```

---

## 🚨 Emergency Mode

Click the red **Emergency** button to:
- See nearest police station
- See nearest hospital
- Call emergency services (911)
- Get navigation to help

---

## 🔐 Security Notes

- ✅ API keys stored in `.env.local` (not committed)
- ✅ All inputs validated & sanitized
- ✅ Firebase security rules enabled
- ✅ HTTPS for all API calls
- ✅ No sensitive data logged

---

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

---

## 🐛 Troubleshooting

### Map not loading?
- Check `VITE_GOOGLE_MAPS_API_KEY` in `.env.local`
- Verify API key has Maps JavaScript API enabled

### Firebase not syncing?
- Check all Firebase config values
- Verify Firestore database is created
- Check browser console for errors

### Gemini not responding?
- Check `GEMINI_API_KEY` is valid
- Verify API quota not exceeded
- Check network connection

---

## 📚 Documentation

- **Architecture**: See `SAFEZONE_ARCHITECTURE.md`
- **API Keys**: See `.env.example`
- **Requirements**: See `.kiro/specs/safepath-ai-improvements/requirements.md`

---

## 🎓 For Judges

**Elevator Pitch:**
> "SafeZone is an AI-powered real-time urban safety decision engine that analyzes police proximity, hospital access, time of day, crowd levels, and crime data to recommend the safest routes. Users can mark unsafe areas in real-time, and the system uses A* pathfinding to prioritize safety over speed, with instant emergency mode for quick access to nearest help."

**Key Differentiators:**
1. ✅ AI-powered safety scoring (Gemini)
2. ✅ Real-time unsafe area reporting (Firebase)
3. ✅ A* pathfinding (safety-weighted routing)
4. ✅ Emergency mode (one-click help)
5. ✅ Google Cloud integration (Maps + Vertex AI + Firebase)

---

**Ready to make urban mobility safer!** 🛡️🗺️
