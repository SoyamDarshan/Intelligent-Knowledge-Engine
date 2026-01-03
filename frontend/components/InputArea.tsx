import React, { useState, KeyboardEvent } from 'react';
import { SendHorizontal, Paperclip, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputAreaProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

export function InputArea({ onSend, disabled }: InputAreaProps) {
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (input.trim() && !disabled) {
            onSend(input);
            setInput("");
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-6 pb-10 pt-4 relative z-50">
            <div className={cn(
                "relative flex items-end gap-3 p-4 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl transition-all duration-300 group",
                "hover:border-primary/30 hover:shadow-[0_0_40px_rgba(168,85,247,0.1)]",
                "focus-within:bg-black/60 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:shadow-[0_0_60px_rgba(168,85,247,0.15)]"
            )}>
                <button
                    disabled={disabled}
                    className="p-3 text-muted-foreground hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95"
                    title="Attach File"
                >
                    <Paperclip size={20} />
                </button>

                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="I Know Everything You Tell Me..."
                    className="flex-1 max-h-48 min-h-[24px] bg-transparent border-0 focus:ring-0 resize-none py-3 px-2 text-[16px] text-white placeholder:text-muted-foreground font-medium leading-relaxed"
                    disabled={disabled}
                    rows={1}
                    style={{ height: 'auto' }} // In real app, consider react-textarea-autosize
                />

                <button
                    onClick={handleSend}
                    disabled={!input.trim() || disabled}
                    className={cn(
                        "p-3 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-lg",
                        input.trim()
                            ? "bg-primary text-white shadow-primary/30 hover:bg-primary/90 hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                            : "bg-white/5 text-white/20 cursor-not-allowed"
                    )}
                >
                    {input.trim() ? <SendHorizontal size={20} className="ml-0.5" /> : <Sparkles size={20} />}
                </button>
            </div>
            <div className="text-center mt-4 text-[11px] font-medium text-muted-foreground/50 tracking-wider uppercase">
                AI-Generated • Verify Important Info
            </div>
        </div>
    );
}
