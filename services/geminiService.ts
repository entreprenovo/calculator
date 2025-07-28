
import { GoogleGenAI } from "@google/genai";
import { FormData } from '../types';
import { INDUSTRY_OPTIONS } from '../constants';

const parseInsights = (text: string): string[] => {
    return text
        .split("\n")
        .map((line) => line.trim().replace(/^\s*[-*]\s*/, ""))
        .filter((line) => line.length > 0);
};

export const generateInsights = async (data: FormData): Promise<string[]> => {
    try {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const industryName =
            INDUSTRY_OPTIONS.find((opt) => opt.value === data.industry)
                ?.label || "General Business";

        const totalWeeklyHours =
            data.leadGenHours +
            data.followUpHours +
            data.dataEntryHours +
            data.schedulingHours +
            data.reportingHours +
            data.emailHours;

        const prompt = `
            You are a world-class business automation consultant and copywriter. A potential client from the "${industryName}" industry has provided data from an ROI calculator.
            Your task is to generate 3 short, compelling, and actionable bullet points (using markdown) that highlight the most impactful benefits of AI automation for them.
            
            **Instructions:**
            1.  **Be Persuasive & Benefit-Oriented:** Don't just state facts. Frame each point around a tangible business outcome (e.g., "Supercharge your sales pipeline...", "Unlock strategic growth...", "Elevate your customer experience...").
            2.  **Use Specific Data:** Weave in the client's data to make your points concrete and personalized. Mention specific hour savings or task names.
            3.  **Keep it Concise:** Each bullet point should be a single, powerful sentence.
            4.  **Format:** Start each line with a hyphen (-). Do not include any introductory or concluding text, just the bullet points. Bold key phrases or numbers using markdown's **bold**.
            
            **Client Data:**
            - Industry: ${industryName}
            - Monthly Revenue: $${data.revenue.toLocaleString()}
            - Team Size: ${data.teamSize}
            - Total manual hours per week on repetitive tasks: ${totalWeeklyHours} hours
            - Key Tasks & Hours/Week: Lead Generation: ${data.leadGenHours} hrs, Customer Follow-ups: ${data.followUpHours} hrs, Data Entry & Admin: ${data.dataEntryHours} hrs, Scheduling: ${data.schedulingHours} hrs

            **Example Output:**
            - Reclaim **${data.leadGenHours + data.followUpHours} hours/week** from lead generation and follow-ups to let your sales team focus exclusively on closing deals and building relationships.
            - Eliminate **${data.dataEntryHours + data.schedulingHours} hours/week** of tedious administrative work, boosting team morale and unlocking more time for high-value strategic planning.
            - Enhance your client experience by automating routine communications, ensuring lightning-fast responses that build loyalty and drive repeat business.
        `;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const insightsText = response.text;
        return parseInsights(insightsText);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to communicate with the AI service.");
    }
};
