import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

interface MessageProps {
    role: 'user' | 'agent';
    content: string;
}

export function MessageBubble({ role, content }: MessageProps) {
    const isAgent = role === 'agent';

    return (
        <div className={cn(
            "flex w-full gap-5 group transition-all duration-300 hover:translate-x-1",
            isAgent ? "justify-start" : "justify-end"
        )}>
            {isAgent && (
                <div className="w-10 h-10 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 shadow-lg group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all">
                    <Bot size={18} className="text-primary group-hover:text-white transition-colors" />
                </div>
            )}

            <div className={cn(
                "relative max-w-[85%] lg:max-w-[70%] rounded-3xl px-8 py-6 text-[15px] leading-7 shadow-sm transition-all duration-300",
                isAgent
                    ? "bg-[#1a1a2e] border border-white/5 text-gray-100 group-hover:shadow-2xl group-hover:border-white/10 group-hover:bg-[#1f1f35]"
                    : "bg-gradient-to-br from-primary to-purple-700 text-white shadow-xl shadow-primary/20 group-hover:scale-[1.01] group-hover:shadow-primary/40 font-medium"
            )}>
                <ReactMarkdown
                    components={{
                        p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-bold text-white shadow-black drop-shadow-sm">{children}</strong>,
                        h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 text-white border-b border-primary/30 pb-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-xl font-bold mb-3 text-white">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-lg font-bold mb-2 text-primary">{children}</h3>,
                        code: ({ children }) => <code className={cn("px-1.5 py-0.5 rounded text-xs font-mono border", isAgent ? "bg-black/30 text-primary border-primary/20" : "bg-white/20 text-white border-white/20")}>{children}</code>,
                        pre: ({ children }) => <pre className="bg-black/50 rounded-xl p-4 overflow-x-auto my-4 border border-white/10 shadow-inner text-sm">{children}</pre>,
                        ul: ({ children }) => <ul className="list-disc list-inside space-y-1.5 my-3 pl-2 marker:text-primary">{children}</ul>,
                        li: ({ children }) => <li className="text-inherit">{children}</li>
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>

            {!isAgent && (
                <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <User size={18} className="text-white" />
                </div>
            )}
        </div>
    );
}
