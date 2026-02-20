interface OCRProgressBarProps {
    progress: number;
    status: string;
}

export function OCRProgressBar({ progress, status }: OCRProgressBarProps) {
    const percentage = Math.round(progress * 100);

    return (
        <div className="w-full max-w-md mx-auto my-8">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {status === 'recognizing text' ? 'Processando imagem...' : 'Inicializando OCR...'}
                </span>
                <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                    {percentage}%
                </span>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                    className="bg-primary-600 h-2.5 rounded-full transition-all duration-300 ease-out flex items-center justify-end"
                    style={{ width: `${percentage}%` }}
                >
                    <div className="w-full h-full bg-white/20 animate-pulse"></div>
                </div>
            </div>
            <p className="text-xs text-center text-slate-500 mt-3 animate-pulse">
                Lendo a imagem, por favor aguarde um momento.
            </p>
        </div>
    );
}
