import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Navigation, 
  Search, 
  AlertCircle, 
  Activity, 
  Map as MapIcon, 
  Clock,
  ArrowRight,
  Zap,
  MapPin,
  AlertTriangle,
  Flame,
  Cloud,
  Users,
  Share2,
  History,
  Eye
} from 'lucide-react';
import { analyzeRoutes, RouteAnalysis, SafetyData } from './lib/gemini';
import { Map } from './components/Map';
import { SafetyInsights } from './components/SafetyInsights';
import { EmergencyMode } from './components/EmergencyMode';
import { SafetyBreakdown } from './components/SafetyBreakdown';
import { LocationSearch } from './components/LocationSearch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { calculateSafetyScore, SafetyFactors } from './lib/ai-model';
import { generateAllRoutes } from './lib/astar';

export default function App() {
  const [start, setStart] = useState('Electronic City, Bangalore');
  const [end, setEnd] = useState('MG Road, Bangalore');
  const [startCoords, setStartCoords] = useState({ lat: 12.9352, lng: 77.6245 });
  const [endCoords, setEndCoords] = useState({ lat: 12.9716, lng: 77.5997 });
  const [analysis, setAnalysis] = useState<RouteAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeRouteId, setActiveRouteId] = useState<string | undefined>(undefined);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [safetyBreakdown, setSafetyBreakdown] = useState<any>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [savedRoutes, setSavedRoutes] = useState<any[]>([]);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('afternoon');

  const handleStartSelect = (place: any) => {
    setStart(place.name || place.description);
    setStartCoords({ lat: place.lat, lng: place.lng });
  };

  const handleEndSelect = (place: any) => {
    setEnd(place.name || place.description);
    setEndCoords({ lat: place.lat, lng: place.lng });
  };

  const saveRoute = () => {
    if (analysis && activeRouteId) {
      const route = analysis.routes.find(r => r.routeId === activeRouteId);
      if (route) {
        setSavedRoutes([...savedRoutes, { from: start, to: end, route, timestamp: new Date() }]);
      }
    }
  };

  const shareRoute = () => {
    const text = `Check out this safe route from ${start} to ${end}! Safety Score: ${analysis?.routes.find(r => r.routeId === activeRouteId)?.safetyScore}%`;
    if (navigator.share) {
      navigator.share({ title: 'SafeZone Route', text });
    } else {
      alert(text);
    }
  };

  const handleAnalyze = async () => {
    if (!start || !end) return;
    setLoading(true);
    try {
      const result = await analyzeRoutes(start, end);
      
      // Adjust safety scores based on time of day
      const timeMultiplier = timeOfDay === 'night' ? 0.7 : timeOfDay === 'evening' ? 0.85 : 1;
      result.routes = result.routes.map(r => ({
        ...r,
        safetyScore: Math.round(r.safetyScore * timeMultiplier),
        timeOfDay,
      }));
      
      setAnalysis(result);
      setActiveRouteId(result.safestRouteId);

      const factors: SafetyFactors = {
        policeDistance: 800,
        hospitalDistance: 1200,
        timeOfDay: new Date().getHours(),
        crowdLevel: 65,
        crimeIndex: 35,
      };

      const safetyScore = calculateSafetyScore(factors);
      setSafetyBreakdown(safetyScore);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial analysis
  useEffect(() => {
    handleAnalyze();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Shield className="text-zinc-950 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">SafeZone AI</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-mono">Urban Safety Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-widest text-zinc-400">
              <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 text-emerald-500" />
                <span>System Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-zinc-500" />
                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
            {/* Emergency Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEmergencyMode(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg flex items-center gap-2 transition-all"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Emergency</span>
            </motion.button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Controls & Insights */}
        <div className="lg:col-span-4 space-y-6">
          <section className="space-y-4">
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-4">
              <LocationSearch
                value={start}
                onChange={setStart}
                onSelect={handleStartSelect}
                placeholder="Enter start location..."
                label="Departure Point"
                icon={<MapPin className="w-4 h-4" />}
                type="start"
              />
              <LocationSearch
                value={end}
                onChange={setEnd}
                onSelect={handleEndSelect}
                placeholder="Enter destination..."
                label="Destination"
                icon={<Navigation className="w-4 h-4" />}
                type="end"
              />
              
              {/* Time of Day Selector */}
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">
                  When are you traveling?
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {(['morning', 'afternoon', 'evening', 'night'] as const).map((time) => (
                    <button
                      key={time}
                      onClick={() => setTimeOfDay(time)}
                      className={`py-2 px-2 rounded-lg text-xs font-mono uppercase transition ${
                        timeOfDay === time
                          ? 'bg-emerald-500 text-zinc-950'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleAnalyze} 
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold h-12 rounded-xl transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <Zap className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Analyzing Safety...' : 'Find Safe Routes'}
              </Button>
            </div>
          </section>

          <AnimatePresence mode="wait">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-48 w-full bg-zinc-900 rounded-2xl" />
                <Skeleton className="h-24 w-full bg-zinc-900 rounded-2xl" />
              </div>
            ) : analysis ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-emerald-200/80 leading-relaxed italic font-serif">
                      "{analysis.summary}"
                    </p>
                  </div>
                </div>

                <Tabs defaultValue={analysis.safestRouteId} onValueChange={setActiveRouteId} className="w-full">
                  <TabsList className="w-full bg-zinc-900 border border-zinc-800 h-12 p-1 rounded-xl">
                    {analysis.routes.map((route) => (
                      <TabsTrigger 
                        key={route.routeId} 
                        value={route.routeId}
                        className="flex-1 rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-500 font-mono text-[10px] uppercase tracking-wider"
                      >
                        {route.routeId.replace('-', ' ')}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {analysis.routes.map((route) => (
                    <TabsContent key={route.routeId} value={route.routeId} className="mt-4">
                      <SafetyInsights 
                        data={route} 
                        isSafest={route.routeId === analysis.safestRouteId} 
                      />
                    </TabsContent>
                  ))}
                </Tabs>

                {/* Safety Breakdown Toggle */}
                <Button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
                >
                  <Flame className="w-4 h-4 mr-2" />
                  {showBreakdown ? 'Hide' : 'Show'} Safety Breakdown
                </Button>

                {/* Heatmap Toggle */}
                <Button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showHeatmap ? 'Hide' : 'Show'} Crime Heatmap
                </Button>

                {/* Route Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={saveRoute}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs"
                  >
                    <History className="w-3 h-3 mr-1" />
                    Save Route
                  </Button>
                  <Button
                    onClick={shareRoute}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs"
                  >
                    <Share2 className="w-3 h-3 mr-1" />
                    Share Route
                  </Button>
                </div>

                {/* Safety Breakdown */}
                {showBreakdown && safetyBreakdown && (
                  <SafetyBreakdown
                    score={safetyBreakdown.score}
                    factors={safetyBreakdown.factors}
                    explanation={safetyBreakdown.breakdown}
                  />
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Right Column: Visualizer */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex-1 min-h-[500px]">
            <Map 
              start={start} 
              end={end} 
              activeRouteId={activeRouteId}
              startCoords={startCoords}
              endCoords={endCoords}
              showHeatmap={showHeatmap}
            />
          </div>

          {/* Bottom Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Sensors', value: '1,242', icon: Activity, color: 'text-emerald-500' },
              { label: 'Network Latency', value: '24ms', icon: Zap, color: 'text-amber-500' },
              { label: 'Safety Incidents', value: '0 (24h)', icon: Shield, color: 'text-emerald-500' },
              { label: 'Commuter Load', value: 'Moderate', icon: Navigation, color: 'text-zinc-400' },
            ].map((stat, i) => (
              <div key={i} className="bg-zinc-900/30 border border-zinc-800/50 p-4 rounded-2xl flex items-center gap-4">
                <div className={`p-2 rounded-lg bg-zinc-950 border border-zinc-800 ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">{stat.label}</p>
                  <p className="text-sm font-bold text-zinc-100">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Emergency Mode Modal */}
      <EmergencyMode
        isActive={emergencyMode}
        onClose={() => setEmergencyMode(false)}
        nearestPolice={{
          name: 'Central Police Station',
          distance: '0.8 km',
          time: '2 min',
          phone: '911',
          type: 'police',
        }}
        nearestHospital={{
          name: 'City General Hospital',
          distance: '1.2 km',
          time: '3 min',
          phone: '911',
          type: 'hospital',
        }}
      />

      {/* Footer Decoration */}
      <footer className="py-12 border-t border-zinc-900 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 grayscale">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">SafeZone v1.0.0</span>
          </div>
          <div className="flex gap-8 text-[10px] font-mono uppercase tracking-widest">
            <span>Privacy</span>
            <span>Terms</span>
            <span>API Docs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
