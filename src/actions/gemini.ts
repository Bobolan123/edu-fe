import { sendRequest } from "../../utils/api";

export const generateGeminiResponse = async (prompt: string) => {
    return await sendRequest<IBackendRes<string>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/gemini/chat`,
        body: { prompt },
    });
};


