import { useState } from 'react';
import { Camera, Map, Trash2, Github, ChevronDown, ChevronUp } from 'lucide-react';
import { UploadDropzone } from './components/UploadDropzone';
import { OCRProgressBar } from './components/OCRProgressBar';
import { AddressCard } from './components/AddressCard';
import { extractTextFromImage, filterAddressLines } from './utils/ocrService';
import { useHistory } from './hooks/useHistory';

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ value: 0, status: '' });
  const [addresses, setAddresses] = useState<string[]>([]);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  const { history, addToHistory, clearHistory } = useHistory();

  const handleFileSelect = async (file: File) => {
    // Generate preview
    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    setIsProcessing(true);
    setAddresses([]);
    setProgress({ value: 0, status: 'initializing' });

    try {
      const allLines = await extractTextFromImage(file, (val, status) => {
        setProgress({ value: val, status });
      });

      const foundAddresses = filterAddressLines(allLines);
      setAddresses(foundAddresses);

      if (foundAddresses.length > 0) {
        addToHistory(foundAddresses);
      }
    } catch (error) {
      alert('Ocorreu um erro ao processar a imagem. Tente novamente.');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setImage(null);
    setAddresses([]);
    setProgress({ value: 0, status: '' });
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <header className="fixed top-0 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 text-white p-2 rounded-xl">
              <Map size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
              Localizador Street
            </h1>
          </div>
          <a
            href="https://github.com/michellcosta/LocalizadorStreet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Github size={24} />
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-12">

        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            OCR <span className="text-primary-600">→</span> Street View
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Envie uma imagem de relatório e visualize os endereços diretamente no Street View em segundos.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-6 sm:p-10 mb-8 transition-all">

          {!image && (
            <UploadDropzone onFileSelect={handleFileSelect} isLoading={isProcessing} />
          )}

          {image && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Camera size={20} className="text-primary-600" /> Imagem Analisada
                </h3>
                <button
                  onClick={resetAll}
                  disabled={isProcessing}
                  className="text-sm px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Enviar outra imagem
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 aspect-[21/9] sm:aspect-[21/7]">
                <img
                  src={image}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>

              {isProcessing && (
                <OCRProgressBar progress={progress.value} status={progress.status} />
              )}
            </div>
          )}
        </div>

        {/* Resultados */}
        {!isProcessing && addresses.length > 0 && (
          <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Endereços Encontrados ({addresses.length})
            </h3>
            <div className="grid gap-4">
              {addresses.map((addr, idx) => (
                <AddressCard key={`new-${idx}`} address={addr} />
              ))}
            </div>
          </div>
        )}

        {/* Histórico Local */}
        {!isProcessing && history.length > 0 && (
          <div className="mt-16 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-200 hover:text-primary-600 transition-colors"
              >
                Histórico Recente
                {isHistoryExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              <button
                onClick={clearHistory}
                className="flex items-center gap-2 text-sm px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
              >
                <Trash2 size={16} /> Limpar
              </button>
            </div>

            {isHistoryExpanded && (
              <div className="grid gap-3 opacity-90 animate-in slide-in-from-top-4 fade-in duration-300">
                {history.map((addr, idx) => (
                  <AddressCard key={`hist-${idx}`} address={addr} />
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
