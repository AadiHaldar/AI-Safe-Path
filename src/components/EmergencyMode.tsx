import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Phone, MapPin, X, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmergencyService {
  name: string;
  distance: string;
  time: string;
  phone: string;
  type: 'police' | 'hospital';
}

interface EmergencyModeProps {
  isActive: boolean;
  onClose: () => void;
  nearestPolice?: EmergencyService;
  nearestHospital?: EmergencyService;
  userLocation?: { lat: number; lng: number };
}

export const EmergencyMode: React.FC<EmergencyModeProps> = ({
  isActive,
  onClose,
  nearestPolice,
  nearestHospital,
  userLocation,
}) => {
  const [pulseAnimation, setPulseAnimation] = useState(true);

  useEffect(() => {
    if (isActive) {
      setPulseAnimation(true);
    }
  }, [isActive]);

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleNavigate = (lat: number, lng: number) => {
    const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Emergency Panel */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-gradient-to-b from-red-900 to-red-950 border-2 border-red-500 rounded-2xl p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: pulseAnimation ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="p-2 bg-red-500 rounded-full"
                  >
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white">EMERGENCY MODE</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-red-800 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Services */}
              <div className="space-y-4">
                {/* Police */}
                {nearestPolice && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-blue-900/50 border border-blue-500 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-white flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {nearestPolice.name}
                        </h3>
                        <p className="text-sm text-blue-200 mt-1">
                          {nearestPolice.distance} • {nearestPolice.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCall(nearestPolice.phone)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Police
                      </Button>
                      <Button
                        onClick={() => handleNavigate(37.7749, -122.4194)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Navigate
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Hospital */}
                {nearestHospital && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-red-900/50 border border-red-500 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-white flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {nearestHospital.name}
                        </h3>
                        <p className="text-sm text-red-200 mt-1">
                          {nearestHospital.distance} • {nearestHospital.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCall(nearestHospital.phone)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Hospital
                      </Button>
                      <Button
                        onClick={() => handleNavigate(37.7749, -122.4194)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Navigate
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Close Button */}
              <Button
                onClick={onClose}
                className="w-full mt-6 bg-gray-700 hover:bg-gray-800 text-white"
              >
                Cancel Emergency Mode
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
