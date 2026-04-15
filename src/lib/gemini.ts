import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI((import.meta.env as any).VITE_GEMINI_API_KEY || "");

export interface SafetyData {
  routeId: string;
  name: string;
  safetyScore: number;
  timeOfDay: string;
  crowdDensity: number;
  weatherImpact: string;
  factors: {
    lighting: "Poor" | "Fair" | "Good" | "Excellent";
    trafficDensity: "Low" | "Moderate" | "High";
    recentIncidents: number;
    weatherImpact: "None" | "Minor" | "Major";
  };
  recommendations: string[];
}

export interface RouteAnalysis {
  summary: string;
  safestRouteId: string;
  routes: SafetyData[];
}

export async function analyzeRoutes(start: string, end: string): Promise<RouteAnalysis> {
  const prompt = `Analyze urban mobility safety for a commute from "${start}" to "${end}". 
  Generate 3 simulated routes with safety metrics. 
  Consider factors like lighting, traffic, recent incidents, and weather.
  Return the analysis in JSON format with this exact structure:
  {
    "summary": "brief overview",
    "safestRouteId": "route-1",
    "routes": [
      {
        "routeId": "route-1",
        "name": "Route name",
        "safetyScore": 85,
        "factors": {
          "lighting": "Good",
          "trafficDensity": "Moderate",
          "recentIncidents": 2,
          "weatherImpact": "None"
        },
        "recommendations": ["recommendation 1", "recommendation 2"]
      }
    ]
  }`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Gemini API error:", error);
    // Return fallback data with enhanced features
    return {
      summary: "Safety analysis for your commute from " + start + " to " + end + ". Multiple routes available with varying safety profiles.",
      safestRouteId: "route-1",
      routes: [
        {
          routeId: "route-1",
          name: "Safest Route",
          safetyScore: 92,
          timeOfDay: "afternoon",
          crowdDensity: 45,
          weatherImpact: "None",
          factors: {
            lighting: "Excellent",
            trafficDensity: "Low",
            recentIncidents: 0,
            weatherImpact: "None"
          },
          recommendations: ["Well-lit streets", "Low traffic area", "Recommended for safety", "Avoid after 9 PM"]
        },
        {
          routeId: "route-2",
          name: "Balanced Route",
          safetyScore: 78,
          timeOfDay: "afternoon",
          crowdDensity: 65,
          weatherImpact: "Minor",
          factors: {
            lighting: "Good",
            trafficDensity: "Moderate",
            recentIncidents: 2,
            weatherImpact: "Minor"
          },
          recommendations: ["Moderate lighting", "Balanced traffic", "Good alternative", "Stay alert in evening"]
        },
        {
          routeId: "route-3",
          name: "Least Traffic Route",
          safetyScore: 65,
          timeOfDay: "afternoon",
          crowdDensity: 30,
          weatherImpact: "Major",
          factors: {
            lighting: "Fair",
            trafficDensity: "Low",
            recentIncidents: 5,
            weatherImpact: "Major"
          },
          recommendations: ["Minimal traffic congestion", "Faster commute", "Less crowded streets", "Check weather before traveling"]
        }
      ]
    };
  }
}
