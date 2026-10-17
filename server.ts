import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

// Local overrides are server-only and ignored by Git. Existing deployment env wins.
dotenv.config({ path: '.env.local' });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini SDK if API key is available
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (err) {
    console.warn('Could not initialize the AI provider. Check server configuration.');
  }
}

// Fallback response engine for flood response when offline or key is pending
function generateFallbackResponse(userPrompt: string, context: any): string {
  const q = userPrompt.toLowerCase();
  const stage = context?.riverStageMeters ?? 51.8;
  const bridgeOpen = context?.bridgeIsOpen ?? true;

  if (q.includes('bridge') || q.includes('purab')) {
    if (!bridgeOpen) {
      return `CRITICAL ADVISORY: Purab Bridge is currently CLOSED to all wheeled vehicles due to rapid 75cm flood inundation. Rescue Teams RT-01 and RT-02 are rerouting via the southern high embankment corridor toward Community Shelter. Motorized rescue boats (BT-01) remain active in the adjacent Saryu water channel.`;
    } else {
      return `PURAB BRIDGE STATUS: Purab Bridge is currently open, but river water is at ${stage}m (Warning Level: 51.5m). We recommend advance transit for non-essential traffic now before potential cresting at T+05.`;
    }
  }

  if (q.includes('low-lying') || q.includes('priority') || q.includes('naya tola') || q.includes('moti basti')) {
    return `LOW-LYING ZONE EVACUATION PRIORITY:
1. Priority 1 (CRITICAL): Naya Tola (Elevation: 45.0m, Lead Time: ~20 mins). Water depth is rising rapidly; immediate evacuation to School Shelter (62m) is recommended.
2. Priority 2 (HIGH): Moti Basti (Elevation: 46.2m, Lead Time: ~35 mins). Advance wheeled transport is staging at Southern Bund.
3. Priority 3 (MODERATE): Nadi Nagar (Elevation: 48.0m, Lead Time: ~55 mins).
*Key Rule*: Help must arrive before disaster strikes. Do not wait for roads to be submerged beyond 30cm before dispatching boats.`;
  }

  if (q.includes('shelter') || q.includes('where to go') || q.includes('bed')) {
    return `SAFE RELIEF SHELTERS STATUS:
- Government Model School Shelter: Elevation 62.0m | Capacity: 36 beds | Medical post: Active | VHF: Ch 16 (156.800 MHz).
- South Sector Community Shelter: Elevation 59.0m | Capacity: 32 beds | Food & water reserves: Verified | VHF: Ch 06.
- Relief Camp Alpha: Elevation 58.0m | High embankment zone | Capacity: 30 beds.
*Routing Advice*: If you are in Purab or East sectors, proceed toward School Shelter along the elevated ridge.`;
  }

  if (q.includes('river') || q.includes('overflow') || q.includes('embankment') || q.includes('breach')) {
    return `RIVER OVERFLOW & HYDRAULIC MECHANISM:
The Saryu River current stage is ${stage}m.
- Normal River Level: 48.0m
- Warning Level: 51.5m (Bank saturation begins)
- Danger Level: 53.0m (Freeboard buffer eroded)
- Embankment Crest: 54.5m (Overtopping & breach point)
When the river level exceeds 53.0m, water begins spilling over unpaved weir sections. The flood wave moves downstream at ~1.4 m/s, reaching low-lying Naya Tola in under 25 minutes. Pre-emptive evacuation is vital.`;
  }

  if (q.includes('offline') || q.includes('checklist') || q.includes('kit') || q.includes('contact')) {
    return `OFFLINE SAFETY ESSENTIALS:
- All critical shelter coordinates and VHF radio frequencies are cached offline in your browser.
- Pack IDs in watertight plastic bags, 4L clean drinking water per person, and 7-day medications.
- Turn off main electrical switches before evacuation.
- Emergency Helplines: NDRF (1078), Police/Ambulance (112), District Control (1077). VHF Emergency Radio: Ch 16 (156.800 MHz).`;
  }

  return `BUBBLES FLOOD DISPATCH & SITE INTELLIGENCE ADVISORY:
Current River Stage: ${stage}m | Basin: Saryu & Surma-Dihing.
All rescue resources (Teams RT-01/RT-02, Boats BT-01/BT-02) are coordinated under Contract Net Protocol.
Low-lying settlements (Naya Tola 45m, Moti Basti 46m) have highest priority. You can ask specifically about:
1. "Which low-lying areas need evacuation first?"
2. "Is Purab Bridge passable?"
3. "Nearest shelter locations and bed availability"
4. "How does the river overflow breach occur?"
5. "What exercises and simulation scenarios can I run?"`;
}

// POST /api/chat: Context-aware AI chatbot endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context = {} } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required.' });
      return;
    }

    // Try server-side Gemini if a valid API key is present
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && !apiKey.startsWith('MY_')) {
      try {
        const client = ai || new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const systemPrompt = `You are BUBBLES Operational AI, the comprehensive intelligence and navigation engine for the BUBBLES disaster-management and flood-response portal.
Current Real-Time Context:
- River Stage: ${context?.riverStageMeters ?? 51.8}m (Normal: 48m, Warning: 51.5m, Danger: 53m, Crest: 54.5m)
- Bridge Status: Purab Bridge is ${context?.bridgeIsOpen ? 'OPEN' : 'CLOSED due to 75cm flood current'}
- Simulation Time: ${context?.simulationTime ?? 'T+04 min'}
- Lowest Elevation Wards: Naya Tola (45.0m), Moti Basti (46.2m), Nadi Nagar (48.0m)
- Safe Shelters: School Shelter (62m, 26 beds free), Community Shelter (59m, 24 beds free), Relief Camp Alpha (58m, 24 beds free)
- Website Capabilities: Exercises (Scenarios 01-03), Real-Time Simulation Canvas, Side-by-Side Google GIS & 3D Cesium Terrain, River Overflow Physics Diagram, Dynamic Risk Heatmap Overlay, Pre-Disaster Low-Lying Evacuation Planner, Geolocation Shelters, Bilingual Audio Radio Dispatch with Civil Defense Siren, Offline Safety Pack & Printable Dossier.
Guidelines:
- Give concise, authoritative, structured, and helpful responses.
- Help users navigate and understand any feature, scenario, algorithm, or data point on the website.
- Cite specific elevations, lead times, page routes, and shelter locations.
- Mention offline preparedness and official emergency lines (NDRF 1078, ERSS 112, VHF Ch 16).`;

        const geminiPromise = client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }],
            },
          ],
        });

        // 4-second timeout race
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 4000)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);
        const reply = response.text || generateFallbackResponse(message, context);
        res.json({ reply, source: 'gemini' });
        return;
      } catch (geminiError: any) {
        console.warn('AI provider unavailable; using the exercise fallback.');
      }
    }

    // Heuristic domain-expert fallback response
    const fallback = generateFallbackResponse(message, context);
    res.json({ reply: fallback, source: 'expert_knowledge_base' });
  } catch (err: any) {
    res.status(500).json({ error: 'Unable to process the request.' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BUBBLES server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
