'use server'

import { getAccessToken } from ".";
import { sendRequest } from "../utils/api";

export interface GeminiChatSource {
    lectureId: string;
    title: string;
    score: number;
}

export interface GeminiChatResponse {
    answer: string;
    sources?: GeminiChatSource[];
}

export const generateGeminiResponse = async (prompt: string, courseId: number) => {
    const access_token = await getAccessToken();

    return await sendRequest<IBackendRes<GeminiChatResponse>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/gemini/chat`,
        body: { prompt, courseId },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};


