"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { sendRequest } from "../../../../utils/api";
import { generateGeminiResponse } from "@/actions/gemini";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

export default function ChatBot() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
            const res: IBackendRes<string> = await generateGeminiResponse(input)

            const aiMessage: Message = {
                id: Date.now().toString() + "-bot",
                role: "assistant",
                content: res?.data || "No response received.",
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
        <div className="flex flex-col h-56 bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Message Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bot className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-700 mb-2">
                            Welcome to AI Assistant
                        </h2>
                        <p className="text-slate-500 max-w-md mx-auto">
                            I'm here to help you with any questions or tasks.
                            Start a conversation by typing a message below.
                        </p>
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex items-start space-x-3 ${
                            message.role === "user"
                                ? "flex-row-reverse space-x-reverse"
                                : ""
                        }`}
                    >
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                message.role === "user"
                                    ? "bg-gradient-to-r from-green-500 to-emerald-600"
                                    : "bg-gradient-to-r from-blue-500 to-purple-600"
                            }`}
                        >
                            {message.role === "user" ? (
                                <User className="w-4 h-4 text-white" />
                            ) : (
                                <Bot className="w-4 h-4 text-white" />
                            )}
                        </div>
                        <div
                            className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-4 py-3 ${
                                message.role === "user"
                                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                                    : "bg-white text-slate-800 shadow-sm border border-slate-200"
                            }`}
                        >
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                {message.content}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-200">
                            <div className="flex items-center space-x-2">
                                <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                                <span className="text-sm text-slate-500">
                                    AI is thinking...
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="bg-white border-t border-slate-200 px-4 py-4">
                <form
                    onSubmit={handleSubmit}
                    className="flex items-center space-x-3"
                >
                    <div className="flex-1 relative">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
