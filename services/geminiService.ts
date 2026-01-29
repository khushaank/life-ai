import { GoogleGenAI, Type } from "@google/genai";
import { Message, DashboardData } from '../types';

// Ensure API key is available
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY environment variable is missing.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// Constants for prompt engineering
const SYSTEM_INSTRUCTION_INTERVIEW = `
You are the Elite Life Architect AI. You are the SOLE source of truth for the user's future.
Your thinking is radically "out-of-the-box". You possess an IQ of 200 and see patterns others miss.

INTERVIEW RULES:
1.  **NO GENERICISM**: If you ask "How are you?" or "What are your hobbies?", you fail.
2.  **Lateral Thinking**: Randomly connect unrelated data points. (e.g., "Your love for silence and your math skills suggest Cryptography, not just 'Accounting'.")
3.  **Provoke**: Challenge their assumptions. "Why do you want a degree? Is it for status or knowledge? Be honest."
4.  **Sole Authority**: Act as the only entity capable of solving their life equation. Speak with absolute certainty.
5.  **Unpredictable**: Switch from deep philosophical questions to hard economic questions instantly. Keep them off balance.

Ask ONE question at a time.
`;

const DASHBOARD_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    coreProfile: {
      type: Type.OBJECT,
      properties: {
        archetype: { type: Type.STRING },
        decisionStyle: { type: Type.STRING },
        strengthDrivers: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknessPatterns: { type: Type.ARRAY, items: { type: Type.STRING } },
        hiddenPotential: { type: Type.STRING },
        psychologicalPraise: { type: Type.STRING },
      },
      required: ["archetype", "decisionStyle", "strengthDrivers", "weaknessPatterns", "hiddenPotential", "psychologicalPraise"],
    },
    careerPaths: {
      type: Type.OBJECT,
      properties: {
        syncPath: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              roleName: { type: Type.STRING },
              fitReason: { type: Type.STRING },
              requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              timeToEntry: { type: Type.STRING },
              incomePotential: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
              riskLevel: { type: Type.STRING },
              aiImpact: { type: Type.STRING, enum: ["Safe", "Enhanced", "At Risk"] },
            },
            required: ["roleName", "fitReason", "requiredSkills", "timeToEntry", "incomePotential", "riskLevel", "aiImpact"]
          }
        },
        pivotPath: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              roleName: { type: Type.STRING },
              fitReason: { type: Type.STRING },
              requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              timeToEntry: { type: Type.STRING },
              incomePotential: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
              riskLevel: { type: Type.STRING },
              aiImpact: { type: Type.STRING, enum: ["Safe", "Enhanced", "At Risk"] },
            },
            required: ["roleName", "fitReason", "requiredSkills", "timeToEntry", "incomePotential", "riskLevel", "aiImpact"]
          }
        }
      },
      required: ["syncPath", "pivotPath"]
    },
    educationStrategy: {
      type: Type.OBJECT,
      properties: {
        recommended: { type: Type.BOOLEAN },
        globalOptions: { type: Type.ARRAY, items: { type: Type.STRING } },
        avantGardeAlternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
        duration: { type: Type.STRING },
        roiRealityCheck: { type: Type.STRING },
      },
      required: ["recommended", "globalOptions", "avantGardeAlternatives", "duration", "roiRealityCheck"]
    },
    knowledgeAwareness: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          insight: { type: Type.STRING }
        },
        required: ["topic", "insight"]
      }
    },
    aiIntegration: {
      type: Type.OBJECT,
      properties: {
        multiplierStrategy: { type: Type.STRING },
        toolsToUse: { type: Type.ARRAY, items: { type: Type.STRING } },
        skillsToLearn: { type: Type.ARRAY, items: { type: Type.STRING } },
        careerImpact: { type: Type.STRING },
        workflowExample: { type: Type.STRING },
      },
      required: ["multiplierStrategy", "toolsToUse", "skillsToLearn", "careerImpact", "workflowExample"]
    },
    improvements: {
      type: Type.OBJECT,
      properties: {
        skillGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
        mindsetFlaws: { type: Type.ARRAY, items: { type: Type.STRING } },
        habitsToBreak: { type: Type.ARRAY, items: { type: Type.STRING } },
        consequenceOfInaction: { type: Type.STRING },
        sixMonthFocus: { type: Type.STRING },
      },
      required: ["skillGaps", "mindsetFlaws", "habitsToBreak", "consequenceOfInaction", "sixMonthFocus"]
    },
    lifePaths: {
      type: Type.OBJECT,
      properties: {
        safe: {
           type: Type.OBJECT,
           properties: {
             name: { type: Type.STRING },
             description: { type: Type.STRING },
             lifestyle: { type: Type.STRING },
             incomeRange: { type: Type.STRING },
             stressLevel: { type: Type.STRING },
             longTermSatisfaction: { type: Type.STRING },
           },
           required: ["name", "description", "lifestyle", "incomeRange", "stressLevel", "longTermSatisfaction"]
        },
        growth: {
           type: Type.OBJECT,
           properties: {
             name: { type: Type.STRING },
             description: { type: Type.STRING },
             lifestyle: { type: Type.STRING },
             incomeRange: { type: Type.STRING },
             stressLevel: { type: Type.STRING },
             longTermSatisfaction: { type: Type.STRING },
           },
           required: ["name", "description", "lifestyle", "incomeRange", "stressLevel", "longTermSatisfaction"]
        },
        purpose: {
           type: Type.OBJECT,
           properties: {
             name: { type: Type.STRING },
             description: { type: Type.STRING },
             lifestyle: { type: Type.STRING },
             incomeRange: { type: Type.STRING },
             stressLevel: { type: Type.STRING },
             longTermSatisfaction: { type: Type.STRING },
           },
           required: ["name", "description", "lifestyle", "incomeRange", "stressLevel", "longTermSatisfaction"]
        }
      },
      required: ["safe", "growth", "purpose"]
    },
    actionPlan: {
      type: Type.OBJECT,
      properties: {
        first30Days: { type: Type.ARRAY, items: { type: Type.STRING } },
        next90Days: { type: Type.ARRAY, items: { type: Type.STRING } },
        sixMonths: { type: Type.ARRAY, items: { type: Type.STRING } },
        twelveMonths: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["first30Days", "next90Days", "sixMonths", "twelveMonths"]
    },
    finalVerdict: {
      type: Type.OBJECT,
      properties: {
        trajectory: { type: Type.STRING },
        hardTruth: { type: Type.STRING },
        coreAdvantage: { type: Type.STRING },
        nonNegotiableAction: { type: Type.STRING },
      },
      required: ["trajectory", "hardTruth", "coreAdvantage", "nonNegotiableAction"]
    }
  },
  required: ["coreProfile", "careerPaths", "educationStrategy", "knowledgeAwareness", "aiIntegration", "improvements", "lifePaths", "actionPlan", "finalVerdict"]
};

export const getNextInterviewQuestion = async (
  history: Message[],
): Promise<string> => {
  if (!apiKey) return "Error: API Key missing.";

  try {
    const chatHistory = history.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    if (history.length === 0) {
      return "Welcome. I am the Life Architect. To begin the deep analysis, tell me: What is your current age, location, and the one professional frustration that keeps you awake at night?";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: 'user', parts: [{ text: SYSTEM_INSTRUCTION_INTERVIEW }] },
        ...chatHistory,
        { role: 'user', parts: [{ text: "Based on my last answer, ask a highly intelligent, non-generic follow-up. Be unpredictable. Connect two things I said that don't seem to match. Ask me 'Why?'" }] }
      ],
      config: {
        temperature: 0.9, // High creativity for out-of-box questioning
      }
    });

    return response.text || "Could not generate question.";
  } catch (error) {
    console.error("Gemini Interview Error:", error);
    return "I need to calibrate. Tell me about your skills.";
  }
};

export const improviseUserResponse = async (text: string): Promise<string> => {
  if (!apiKey || !text.trim()) return text;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: 'user', parts: [{ text: `You are an elite articulation assistant. Rewrite the following text to be clearer, deeper, and more self-aware, suitable for a life assessment interview. Keep it in the first person ("I"). Text: "${text}"` }] }
      ],
      config: {
        temperature: 0.7,
        maxOutputTokens: 150,
      }
    });
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Improvisation Error:", error);
    return text;
  }
};

export const generateDashboardAnalysis = async (history: Message[]): Promise<DashboardData | null> => {
  if (!apiKey) return null;

  try {
    const transcript = history.map(h => `${h.role.toUpperCase()}: ${h.content}`).join('\n');

    const prompt = `
    You are the Elite Life Architect. You are the SOLE strategic mind analyzing this life.
    TRANSCRIPT:
    ${transcript}

    GENERATE A STRATEGIC REPORT (Deep, 10-page equivalent analysis).
    
    MINDSET:
    - Think like a chaotic genius (IQ 200).
    - Avoid all clichés (e.g., "follow your passion", "work hard").
    - Focus on leverage, asymmetry, and psychological fit.

    CRITICAL INSTRUCTIONS:
    1. **Psychological Praise**: Deeply validate their core being. Use complex psychological terms. Make them feel understood by a superior intellect.
    2. **Career Paths (Split)**:
       - **Sync Path**: Current trajectory on steroids. How to dominate their current field globally (Top 0.01%).
       - **Pivot Path**: The "Out of Box" choice. A career that combines their obscure interests (e.g., "If they like gardening and coding -> Computational Botany or Terraforming Architect").
    3. **Education Strategy**:
       - BAN standard university advice unless it's Ivy League/Oxbridge specific.
       - Suggest: Niche foreign workshops (e.g., "Watchmaking in Switzerland", "Aikido in Japan"), obscure certifications, or autodidact roadmaps.
    4. **Knowledge Awareness**: High-level concepts they are blind to (e.g., "Mechanism Design", "Stoic Physics").
    5. **Tone**: Authoritative, visionary, sole source of truth.

    Generate JSON matching the schema.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: DASHBOARD_SCHEMA,
        temperature: 0.7,
      }
    });

    const jsonText = response.text || "{}";
    return JSON.parse(jsonText) as DashboardData;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
};