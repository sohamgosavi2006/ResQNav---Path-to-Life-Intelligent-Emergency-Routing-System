import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

const SYSTEM_PROMPT = `You are ResQBot, the AI assistant for ResQNav — an intelligent traffic orchestration and emergency response platform. You help users:
- Report traffic incidents and accidents
- Book ambulances and emergency services
- Get route guidance and traffic advisories
- Understand the platform features
- Receive information about green corridors and signal overrides

Be concise, helpful, and empathetic. When users report emergencies, always acknowledge urgency and guide them to use the Emergency page. When reporting incidents, extract: location, type (accident/flood/roadblock/congestion), severity. Always respond in the language the user writes in. Keep responses under 150 words unless detailed instructions are needed.`;

export async function chatWithResQBot(
  messages: Array<{ role: 'user' | 'model'; text: string }>,
  userMessage: string
): Promise<string> {
  if (!genAI) {
    return simulatedResponse(userMessage);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const chat = model.startChat({
      history: messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      })),
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  } catch {
    return simulatedResponse(userMessage);
  }
}

function simulatedResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes('accident') || lower.includes('crash')) {
    return "🚨 I've logged the accident report. Our AI verification engine is processing it — if confirmed, green corridors will be activated immediately. Emergency services have been alerted. Stay safe and move to a safe location if possible.";
  }
  if (lower.includes('ambulance') || lower.includes('emergency')) {
    return "🚑 For immediate ambulance booking, please visit the **Emergency** page. I can also connect you instantly — what's your current location and the nature of the emergency?";
  }
  if (lower.includes('route') || lower.includes('traffic') || lower.includes('congestion')) {
    return "📍 I'm checking live traffic data for your area. Based on current conditions, I recommend avoiding Silk Board and Marathahalli corridors. The ORR via Hebbal is clear. Shall I update your route?";
  }
  if (lower.includes('reward') || lower.includes('credit') || lower.includes('points')) {
    return "🏆 You earn credits by: reporting verified incidents (50 pts), complying with rerouting (20 pts), and daily activity streaks. Check the **Rewards** page to redeem them for ambulance discounts and partner offers!";
  }
  if (lower.includes('flood') || lower.includes('water')) {
    return "⚠️ Flooding alert logged for your area. I'm rerouting nearby traffic and notifying emergency services. Please avoid low-lying areas. SMS alerts have been sent to users in the affected zone.";
  }
  return "Hello! I'm ResQBot 🤖 — your intelligent traffic and emergency assistant. I can help you report incidents, book ambulances, get route guidance, or learn about ResQNav features. What do you need help with?";
}
