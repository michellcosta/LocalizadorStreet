import { UploadCloud } from 'lucide-react';
import { useCallback, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface UploadDropzoneProps {
    onFileSelect: (file: File) => void;
    isLoading: boolean;
}

export function UploadDropzone({ onFileSelect, isLoading }: UploadDropzoneProps) {
    const [isDragActive, setIsDragActive] = useState(false);

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isLoading) setIsDragActive(true);
    }, [isLoading]);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (isLoading) return;

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                onFileSelect(file);
                e.dataTransfer.clearData();
            } else {
                alert('Por favor, selecione um arquivo de imagem.');
            }
        }
    }, [onFileSelect, isLoading]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files[0]);
        }
    }, [onFileSelect]);

    return (
        <div
            className={twMerge(
                clsx(
                    "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ease-in-out",
                    "hover:bg-slate-50/50 hover:border-primary-400 dark:hover:bg-slate-900/50",
                    isLoading ? "opacity-50 cursor-not-allowed border-slate-200 dark:border-slate-800" : "",
                    isDragActive ? "border-primary-500 bg-primary-50/50 dark:bg-slate-900/80 scale-[1.02]" : "border-slate-300/60 dark:border-slate-700/60 bg-white/40 dark:bg-slate-950/40"
                )
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
                id="file-upload"
                disabled={isLoading}
            />
            <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className={clsx("w-14 h-14 mb-4 transition-colors", isDragActive ? "text-primary-600" : "text-slate-400 dark:text-slate-500")} />
                    <p className="mb-2 text-base font-medium text-slate-700 dark:text-slate-300">
                        <span className="text-primary-600 dark:text-primary-500 font-semibold">Clique para enviar</span> ou arraste e solte
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400/80 font-medium">
                        PNG, JPG, JPEG (Imagens de relatórios)
                    </p>
                </div>
            </label>
        </div>
    );
}
