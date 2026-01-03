"use client";

import { ChatWindow } from '@/components/ChatWindow';

export default function Home() {
    return (
        <main className="h-full w-full bg-background relative flex">
            {/* Ambient Background Glows - Subtler but present */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Full Screen Chat Window - No floating card to avoid sizing issues */}
            <ChatWindow />
        </main>
    );
}
