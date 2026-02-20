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
                    "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-colors duration-300 ease-in-out",
                    "hover:bg-primary-50 hover:border-primary-500 dark:hover:bg-slate-900",
                    isLoading ? "opacity-50 cursor-not-allowed" : "",
                    isDragActive ? "border-primary-500 bg-primary-50 dark:bg-slate-900" : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
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
                    <UploadCloud className={clsx("w-12 h-12 mb-4", isDragActive ? "text-primary-600" : "text-slate-500 dark:text-slate-400")} />
                    <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <span className="text-primary-600 dark:text-primary-500">Clique para enviar</span> ou arraste e solte
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        PNG, JPG, JPEG (Imagens de relatórios)
                    </p>
                </div>
            </label>
        </div>
    );
}
