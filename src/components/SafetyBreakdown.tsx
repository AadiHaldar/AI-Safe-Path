import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SafetyBreakdownProps {
  score: number;
  factors: {
    policeScore: number;
    hospitalScore: number;
    timeScore: number;
    crowdScore: number;
    crimeScore: number;
  };
  explanation: string;
}

export const SafetyBreakdown: React.FC<SafetyBreakdownProps> = ({
  score,
  factors,
  explanation,
}) => {
  const factorsList = [
    { label: 'Police Proximity', value: factors.policeScore, weight: 25, icon: '🚔' },
    { label: 'Hospital Proximity', value: factors.hospitalScore, weight: 20, icon: '🏥' },
    { label: 'Time of Day', value: factors.timeScore, weight: 15, icon: '🕐' },
    { label: 'Crowd Level', value: factors.crowdScore, weight: 15, icon: '👥' },
    { label: 'Crime Index', value: factors.crimeScore, weight: 25, icon: '📊' },
  ];

  const getScoreColor = (value: number) => {
    if (value >= 70) return 'bg-emerald-500';
    if (value >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-zinc-100">
          <BarChart3 className="w-5 h-5" />
          Safety Score Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center">
          <div className="text-5xl font-bold text-emerald-500 mb-2">{score}</div>
          <p className="text-sm text-zinc-400">Overall Safety Score</p>
        </div>

        {/* AI Explanation */}
        <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
          <p className="text-sm text-zinc-300 italic">
            "{explanation}"
          </p>
        </div>

        {/* Factor Breakdown */}
        <div className="space-y-4">
          {factorsList.map((factor, index) => (
            <motion.div
              key={factor.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{factor.icon}</span>
                  <span className="text-sm font-medium text-zinc-300">{factor.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-zinc-100">{factor.value}%</span>
                  <span className="text-xs text-zinc-500">({factor.weight}% weight)</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${factor.value}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`h-full ${getScoreColor(factor.value)}`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <div className="text-sm text-blue-200">
              <p className="font-semibold mb-1">Recommendations:</p>
              <ul className="text-xs space-y-1 opacity-90">
                {score >= 70 && <li>✓ This is a safe route. Proceed with confidence.</li>}
                {score >= 40 && score < 70 && (
                  <li>⚠ Moderate safety. Consider traveling during daytime hours.</li>
                )}
                {score < 40 && <li>⚠ Low safety score. Consider alternative routes.</li>}
                {factors.timeScore < 50 && <li>🌙 Night time detected. Extra caution advised.</li>}
                {factors.crimeScore < 40 && <li>📍 Higher crime area. Stay alert.</li>}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
