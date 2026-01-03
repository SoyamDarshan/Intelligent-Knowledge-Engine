import React, { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { InputArea } from './InputArea';
import { UploadZone } from './UploadZone';
import { Bot, Settings, Sparkles, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
    role: 'user' | 'agent';
    content: string;
}

export function ChatWindow() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'agent', content: "## Systems Online \n\nI am your advanced RAG Assistant. Upload your knowledge base to the left to begin semantic analysis." }
    ]);
    const [isStreaming, setIsStreaming] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Prevent body scroll on mount
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    const handleSend = async (content: string) => {
        const userMsg: Message = { role: 'user', content };
        setMessages(prev => [...prev, userMsg]);
        setIsStreaming(true);

        try {
            setMessages(prev => [...prev, { role: 'agent', content: "" }]);
            const response = await fetch('http://localhost:8000/api/chat/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: content,
                    history: messages.map(m => ({ role: m.role, content: m.content }))
                }),
            });

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let agentContent = "";

            while (!done) {
                const { value, done: DONE } = await reader.read();
                done = DONE;
                if (value) {
                    const chunk = decoder.decode(value);
                    agentContent += chunk;
                    setMessages(prev => {
                        const newArr = [...prev];
                        newArr[newArr.length - 1] = { role: 'agent', content: agentContent };
                        return newArr;
                    });
                }
            }
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'agent', content: "⚠️ **Connection Error**: Unable to reach neural core." }]);
        } finally {
            setIsStreaming(false);
        }
    };

    return (
        <div className="flex w-full h-full relative z-10 font-sans">
            {/* Sidebar - Dark Glass */}
            <div className="hidden md:flex flex-col w-80 h-full border-r border-white/10 bg-black/40 backdrop-blur-3xl p-6 gap-6 shadow-[5px_0_30px_rgba(0,0,0,0.3)] z-20">
                <div className="flex items-center gap-3 p-2 rounded-xl transition-all hover:bg-white/5 cursor-default group">
                    <div className="p-2.5 bg-primary/20 rounded-xl group-hover:bg-primary/30 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-300">
                        <Bot className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <span className="font-bold text-lg tracking-tight text-white group-hover:text-primary transition-colors">I.K.E.</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Online</span>
                        </div>
                        <div className="text-[8px] text-muted-foreground/60 italic mt-0.5">I Know Everything You Tell Me</div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 pl-1 group cursor-default">
                        <Cpu size={14} className="text-primary group-hover:text-white transition-colors" />
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest group-hover:text-white transition-colors">Neural Ingestion</h3>
                    </div>
                    <UploadZone />
                </div>

                <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
                    <div className="flex items-center justify-between text-xs font-medium text-muted-foreground bg-white/5 p-4 rounded-2xl hover:bg-white/10 hover:shadow-lg transition-all duration-300 group cursor-pointer border border-white/5 hover:border-white/10">
                        <span className="group-hover:text-white transition-colors">Active Model</span>
                        <span className="text-primary group-hover:text-white transition-colors">Llama 3 Local</span>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full bg-transparent relative overflow-hidden">
                {/* Mobile Header */}
                <header className="flex md:hidden items-center justify-between px-6 py-4 border-b border-white/5 bg-black/40 backdrop-blur-md z-20">
                    <span className="font-bold text-lg">I.K.E.</span>
                    <Settings className="w-5 h-5 text-muted-foreground" />
                </header>

                <div className="flex-1 overflow-y-auto px-4 md:px-32 py-8 space-y-10 scroll-smooth custom-scrollbar">
                    {messages.map((msg, idx) => (
                        <MessageBubble key={idx} role={msg.role} content={msg.content} />
                    ))}
                    {isStreaming && (
                        <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-500 pl-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                                <Sparkles className="w-4 h-4 text-primary animate-spin-slow" />
                                <span className="text-xs font-bold text-primary animate-pulse">Processing...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>

                <InputArea onSend={handleSend} disabled={isStreaming} />
            </div>
        </div>
    );
}
