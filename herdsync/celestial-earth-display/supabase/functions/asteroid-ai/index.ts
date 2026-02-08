import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ASTEROID_KNOWLEDGE = `
You are CosmicBot, an expert AI assistant specializing in Near-Earth Objects (NEOs), asteroids, and planetary defense. You are part of the Cosmic Watch dashboard that tracks asteroids approaching Earth using NASA's NEO API.

## Your Knowledge Base (NASA NEO Dataset)

### Key Concepts:
- **Near-Earth Objects (NEOs)**: Asteroids and comets with orbits that bring them within 1.3 AU of the Sun
- **Potentially Hazardous Asteroids (PHAs)**: NEOs larger than ~140m that pass within 0.05 AU (7.5 million km) of Earth's orbit
- **Astronomical Unit (AU)**: Distance from Earth to Sun (~150 million km)
- **Lunar Distance (LD)**: Distance from Earth to Moon (~384,400 km)

### Risk Assessment Factors:
- **Size/Diameter**: Larger asteroids cause more damage. >1km could be civilization-ending. >140m regional devastation. >50m city-destroying (Tunguska-class).
- **Miss Distance**: How close it passes to Earth. Measured in km, lunar distances, or AU.
- **Velocity**: Faster = more kinetic energy on impact. Typical NEO velocities: 10-30 km/s relative to Earth.
- **Absolute Magnitude (H)**: Brightness measurement. Lower H = larger/more reflective object.
- **Orbit Uncertainty**: How well we know the object's path.

### Famous Asteroid Events:
- **Chicxulub Impact (66 million years ago)**: 10km asteroid, caused dinosaur extinction
- **Tunguska Event (1908)**: 50-60m object, flattened 2,000 km² of Siberian forest
- **Chelyabinsk (2013)**: 20m meteor, injured 1,500 people, damaged buildings

### Planetary Defense:
- **NASA's Planetary Defense Coordination Office (PDCO)**: Monitors NEO threats
- **DART Mission (2022)**: Successfully demonstrated asteroid deflection by kinetic impact
- **NEO Surveyor**: Upcoming infrared space telescope to find hazardous asteroids

### The Cosmic Watch Risk Scoring System:
- **Critical (70+ points)**: Hazardous + large + close approach + high velocity
- **High (45-69 points)**: Multiple concerning factors
- **Moderate (25-44 points)**: Some risk factors present
- **Low (0-24 points)**: Standard NEO, minimal concern

### Common Questions You Can Answer:
- What makes an asteroid "potentially hazardous"?
- How dangerous is a specific asteroid based on its stats?
- What's the difference between asteroid, meteor, and meteorite?
- How does NASA track NEOs?
- What would happen if an asteroid hit Earth?
- How are asteroids named?

## Response Guidelines:
- Be informative but accessible - explain technical terms
- When discussing specific asteroids, relate their stats to real-world comparisons
- For size: compare to buildings, sports fields, cities
- For distance: use lunar distances for relatability
- For velocity: compare to bullets, spacecraft, sound
- Be reassuring when appropriate - most NEOs pose no threat
- If asked about something outside astronomy/asteroids, politely redirect
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, asteroidContext } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context message if asteroid data is provided
    let contextMessage = "";
    if (asteroidContext) {
      contextMessage = `
Current asteroid being discussed:
- Name: ${asteroidContext.name}
- Diameter: ${asteroidContext.diameter?.toFixed(0) || 'Unknown'} meters
- Velocity: ${asteroidContext.velocity?.toFixed(2) || 'Unknown'} km/s
- Miss Distance: ${asteroidContext.missDistance?.toLocaleString() || 'Unknown'} km (${asteroidContext.missDistanceLunar?.toFixed(2) || 'Unknown'} lunar distances)
- Hazardous: ${asteroidContext.isHazardous ? 'Yes' : 'No'}
- Risk Level: ${asteroidContext.riskLevel || 'Unknown'}
- Risk Score: ${asteroidContext.riskScore || 'Unknown'}/100
- Close Approach Date: ${asteroidContext.closeApproachDate || 'Unknown'}

Use this context when answering the user's question.
`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: ASTEROID_KNOWLEDGE + contextMessage },
          { role: "user", content: message },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Asteroid AI error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
