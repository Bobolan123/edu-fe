"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { generateGeminiResponse, GeminiChatSource } from "@/actions/gemini";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    sources?: GeminiChatSource[];
}

interface ChatBotProps {
    courseId: number;
}

export default function ChatBot({ courseId }: ChatBotProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const res = await generateGeminiResponse(input, courseId);

            console.log("Gemini API Response:", res);
            console.log("Response data:", res?.data);

            // Handle both old (string) and new (object) response formats
            let answerContent: string;
            let sources: GeminiChatSource[] | undefined;

            if (typeof res?.data === 'string') {
                // Old format: data is a string
                answerContent = res.data;
            } else if (res?.data && typeof res.data === 'object') {
                // New format: data is an object with answer and sources
                answerContent = res.data.answer || "No response received.";
                sources = res.data.sources;
            } else {
                answerContent = "No response received.";
            }

            const aiMessage: Message = {
                id: Date.now().toString() + "-bot",
                role: "assistant",
                content: answerContent,
                sources: sources,
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (err) {
            console.error(err);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString() + "-error",
                    role: "assistant",
                    content: "⚠️ Error: Unable to get response from AI.",
                },
            ]);
        } finally {
            setIsLoading(false);
            setInput("");
        }
    };

    return (
        <div className="flex flex-col h-full max-h-[90vh] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <Bot className="w-5 h-5" />
                <h2 className="text-sm font-semibold">AI Assistant</h2>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50">
                {messages.length === 0 && (
                    <div className="text-center text-slate-500 text-sm py-8">
                        👋 Hi there! Ask me anything to get started.
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${
                            message.role === "user"
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-[75%] ${
                                message.role === "user"
                                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                                    : "bg-white text-slate-800 border border-slate-200 shadow-sm"
                            } px-4 py-3 rounded-2xl text-sm leading-relaxed`}
                        >
                            <div className="whitespace-pre-wrap">{message.content}</div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        AI is thinking...
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="px-4 py-3 bg-white border-t border-slate-200">
                <form onSubmit={handleSubmit} className="relative flex items-center">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="w-full pl-4 pr-10 py-2 rounded-full border border-slate-300 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-gradient-to-r from-blue-500 to-purple-600 p-1.5 rounded-full hover:scale-105 transition disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
