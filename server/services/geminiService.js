import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI SDK if the API key is provided
const apiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_google_gemini_api_key' 
  ? process.env.GEMINI_API_KEY 
  : null;

let genAI = null;
let model = null;

if (apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  } catch (error) {
    console.error('Failed to initialize GoogleGenerativeAI:', error);
  }
}

/**
 * 1. Daily Insight Prompt
 * Given user's recent activities, generate one specific, encouraging tip.
 * Max 2 sentences. Be personal and actionable.
 */
export const getDailyInsight = async (activities = []) => {
  const fallbackTips = [
    "Switching to LED light bulbs reduces energy usage by up to 80% and lasts 25 times longer than incandescent bulbs.",
    "Unplugging electronics when they are not in use prevents 'vampire draw', which accounts for up to 10% of household energy bills.",
    "Eating a plant-based meal just one day a week saves approximately 1,500 gallons of water and reduces CO2 emissions.",
    "Carpooling or taking public transport once a week can reduce your transportation emissions by up to 20% annually.",
    "Washing clothes in cold water instead of hot saves about 75% of the energy needed for a load of laundry.",
    "Reducing shower time by just 2 minutes can save up to 10 gallons of water and lower your water heating bills."
  ];
  
  const randomFallback = fallbackTips[Math.floor(Math.random() * fallbackTips.length)];

  if (!model) {
    return randomFallback;
  }

  try {
    const prompt = `
      You are an encouraging environmental coach. 
      Here is a list of recent carbon-producing activities logged by the user in JSON format:
      ${JSON.stringify(activities)}
      
      Generate one specific, encouraging tip to help them reduce their carbon footprint.
      Rules:
      - Max 2 sentences.
      - Must be personal and actionable.
      - Address the categories they logged (e.g. TRANSPORT, FOOD, ENERGY, SHOPPING).
      - Do not include markdown code block formatting in your final text response.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim() || randomFallback;
  } catch (error) {
    console.error('Error generating daily insight from Gemini:', error);
    return randomFallback;
  }
};

/**
 * 2. Baseline Analysis Prompt
 * User completed onboarding quiz [JSON results]. Give estimated annual CO2 and a 3-bullet breakdown.
 */
export const getBaselineAnalysis = async (quizResults, estimatedAnnualCo2) => {
  const fallbackBreakdown = [
    "Your emissions are estimated at " + estimatedAnnualCo2 + " kg CO2/year.",
    "Transportation is likely your highest emission area. Consider using public transport or carpooling.",
    "Your diet and energy habits contribute moderately. Eating plant-based meals occasionally will make a substantial difference."
  ];

  if (!model) {
    return fallbackBreakdown.join('\n');
  }

  try {
    const prompt = `
      You are an environmental expert analyzing a user's carbon footprint onboarding quiz results.
      The user's quiz answers:
      ${JSON.stringify(quizResults)}
      
      The calculated estimated annual CO2 is: ${estimatedAnnualCo2} kg.
      
      Provide a baseline analysis containing:
      1. An initial opening sentence summary of their estimated footprint.
      2. Exactly 3 short bullet points breaking down where they stand and comparing their usage to the average person in India (who emits roughly 1,900 kg CO2/year) or global averages.
      
      Keep it brief, encouraging, and clear. Do not include HTML formatting. Just return plain text with bullets.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    return text || fallbackBreakdown.join('\n');
  } catch (error) {
    console.error('Error generating baseline analysis from Gemini:', error);
    return fallbackBreakdown.join('\n');
  }
};

/**
 * 3. Activity Tip Prompt
 * User logged [description, co2Kg]. Give one micro-action next time to reduce. One sentence only.
 */
export const getActivityTip = async (description, co2Kg, category) => {
  const fallbackTips = {
    TRANSPORT: "Try biking or taking public transport for trips under 5 kilometers.",
    FOOD: "Try incorporating more plant-based proteins like lentils or tofu into your meals next time.",
    ENERGY: "Remember to turn off lights and unplug appliances when you leave a room.",
    SHOPPING: "Consider buying high-quality, durable clothes or second-hand items next time."
  };

  const defaultFallback = fallbackTips[category] || "Try to plan ahead to reduce emissions on your next similar task.";

  if (!model) {
    return defaultFallback;
  }

  try {
    const prompt = `
      The user just logged a new activity:
      Description: "${description}"
      CO2 Impact: ${co2Kg} kg CO2
      Category: ${category}
      
      Give one micro-action they can take next time to reduce or avoid this specific carbon emission.
      Rules:
      - Strictly one sentence only.
      - Be direct, specific, and positive.
      - Do not wrap in quotes or code blocks.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim() || defaultFallback;
  } catch (error) {
    console.error('Error generating activity tip from Gemini:', error);
    return defaultFallback;
  }
};
