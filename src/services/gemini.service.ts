import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface GeminiMessage {
    id: number;
    text: string;
    isBot: boolean;
    timestamp: string;
}

export interface GeminiResponse {
    answer: string;
    error?: string;
}

export const geminiService = {
    async sendMessage(message: string, courseId: string, lectureId: string): Promise<GeminiResponse> {
        try {
            // Initialize the model
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            // Create a chat
            const chat = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: "You are an AI tutor assistant for an online learning platform. You help students understand course content and answer their questions about the current lecture.",
                    },
                    {
                        role: "model",
                        parts: "I understand that I am an AI tutor assistant. I will help students understand their course content and answer questions about their lectures in a clear, helpful, and educational manner.",
                    },
                ],
                generationConfig: {
                    maxOutputTokens: 1000,
                }
            });

            // Send message and get response
            const result = await chat.sendMessage(message);
            const response = await result.response;
            const text = response.text();

            return {
                answer: text
            };
        } catch (error) {
            console.error('Error sending message to Gemini:', error);
            throw error;
        }
    },

    async getMessageHistory(courseId: string, lectureId: string): Promise<GeminiMessage[]> {
        try {
            // For now, we'll return an empty array or get from localStorage
            // In a real app, you might want to store this in a database
            const storageKey = `gemini_chat_${courseId}_${lectureId}`;
            const storedMessages = localStorage.getItem(storageKey);
            return storedMessages ? JSON.parse(storedMessages) : [];
        } catch (error) {
            console.error('Error fetching message history:', error);
            throw error;
        }
    },

    saveMessageHistory(courseId: string, lectureId: string, messages: GeminiMessage[]) {
        try {
            const storageKey = `gemini_chat_${courseId}_${lectureId}`;
            localStorage.setItem(storageKey, JSON.stringify(messages));
        } catch (error) {
            console.error('Error saving message history:', error);
        }
    }
}; 