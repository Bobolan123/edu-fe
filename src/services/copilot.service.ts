const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CopilotMessage {
    id: number;
    text: string;
    isBot: boolean;
    timestamp: string;
}

export interface CopilotResponse {
    answer: string;
    error?: string;
}

export const copilotService = {
    async sendMessage(message: string, courseId: string, lectureId: string): Promise<CopilotResponse> {
        try {
            const response = await fetch(`${API_URL}/copilot/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    courseId,
                    lectureId,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            return response.json();
        } catch (error) {
            console.error('Error sending message to Copilot:', error);
            throw error;
        }
    },

    async getMessageHistory(courseId: string, lectureId: string): Promise<CopilotMessage[]> {
        try {
            const response = await fetch(`${API_URL}/copilot/history?courseId=${courseId}&lectureId=${lectureId}`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            return response.json();
        } catch (error) {
            console.error('Error fetching message history:', error);
            throw error;
        }
    }
}; 