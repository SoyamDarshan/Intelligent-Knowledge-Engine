import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "RAG Agent Interface",
    description: "Advanced Agentic Chat Interface",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="h-screen w-screen overflow-hidden bg-background text-foreground">
                {children}
            </body>
        </html>
    );
}
