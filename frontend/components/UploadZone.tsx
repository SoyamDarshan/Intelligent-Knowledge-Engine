import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function UploadZone() {
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [fileName, setFileName] = useState("");

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setFileName(file.name);
        setStatus('uploading');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('http://localhost:8000/api/ingest/', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                setStatus('success');
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
            }
        } catch (e) {
            console.error(e);
            setStatus('error');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt', '.md']
        },
        maxFiles: 1
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                "relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300",
                "h-40 flex flex-col items-center justify-center text-center p-4",
                "hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] hover:scale-[1.02]",
                isDragActive
                    ? "border-primary bg-primary/10 shadow-[inner_0_0_20px_rgba(168,85,247,0.2)]"
                    : "border-white/10 bg-black/20 hover:border-primary/50 hover:bg-black/30",
                status === 'error' && "border-red-500/50 bg-red-500/5"
            )}
        >
            <input {...getInputProps()} />

            {status === 'idle' && (
                <>
                    <div className="p-3 rounded-xl bg-white/5 mb-3 group-hover:bg-primary/20 group-hover:text-white transition-all duration-300">
                        <UploadCloud className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm text-gray-300 font-bold group-hover:text-white transition-colors">
                        Drop Knowledge
                    </p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1 tracking-wide group-hover:text-primary/70 transition-colors">
                        PDF / TXT • Max 10MB
                    </p>
                </>
            )}

            {status === 'uploading' && (
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <span className="text-xs font-bold text-primary animate-pulse tracking-widest uppercase">Ingesting Neurodata...</span>
                </div>
            )}

            {status === 'success' && (
                <div className="flex flex-col items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-full">
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className="text-xs font-bold text-emerald-400 tracking-wide uppercase">Ingestion Complete</span>
                </div>
            )}

            {status === 'error' && (
                <div className="flex flex-col items-center gap-3">
                    <div className="p-2 bg-red-500/20 rounded-full">
                        <AlertCircle className="w-6 h-6 text-red-400" />
                    </div>
                    <span className="text-xs font-bold text-red-400 tracking-wide uppercase">Ingestion Failed</span>
                </div>
            )}
        </div>
    );
}
