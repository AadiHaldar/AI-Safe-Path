import React from 'react';
import { motion } from 'motion/react';
import { Shield, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { SafetyData } from '../lib/gemini';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock Progress component since I didn't add it via shadcn yet (it's often a separate add)
// I'll just build a simple one here for speed or add it later.
const CustomProgress = ({ value, className }: { value: number, className?: string }) => (
  <div className={`h-2 w-full bg-zinc-800 rounded-full overflow-hidden ${className}`}>
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`h-full ${value > 70 ? 'bg-emerald-500' : value > 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
    />
  </div>
);

interface SafetyInsightsProps {
  data: SafetyData;
  isSafest: boolean;
}

export const SafetyInsights: React.FC<SafetyInsightsProps> = ({ data, isSafest }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-zinc-100 flex items-center gap-2">
                {data.name}
                {isSafest && (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                    Safest Option
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-zinc-400">Route Safety Analysis</CardDescription>
            </div>
            <div className="text-right">
              <span className={`text-2xl font-mono font-bold ${data.safetyScore > 70 ? 'text-emerald-500' : data.safetyScore > 40 ? 'text-amber-500' : 'text-rose-500'}`}>
                {data.safetyScore}%
              </span>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono italic">Safety Index</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-zinc-400 uppercase tracking-tighter">
              <span>Overall Safety Level</span>
              <span>{data.safetyScore > 70 ? 'High' : data.safetyScore > 40 ? 'Moderate' : 'Low'}</span>
            </div>
            <CustomProgress value={data.safetyScore} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
              <p className="text-[10px] uppercase text-zinc-500 font-mono mb-1">Lighting</p>
              <p className={`text-sm font-medium ${data.factors.lighting === 'Excellent' || data.factors.lighting === 'Good' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {data.factors.lighting}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
              <p className="text-[10px] uppercase text-zinc-500 font-mono mb-1">Traffic</p>
              <p className="text-sm font-medium text-zinc-100">{data.factors.trafficDensity}</p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
              <p className="text-[10px] uppercase text-zinc-500 font-mono mb-1">Recent Incidents</p>
              <p className={`text-sm font-medium ${data.factors.recentIncidents === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {data.factors.recentIncidents} reported
              </p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
              <p className="text-[10px] uppercase text-zinc-500 font-mono mb-1">Weather Impact</p>
              <p className="text-sm font-medium text-zinc-100">{data.factors.weatherImpact}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-2">
              <Info className="w-3 h-3" />
              Actionable Recommendations
            </h4>
            <ul className="space-y-2">
              {data.recommendations.map((rec, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-sm text-zinc-300 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  {rec}
                </motion.li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
