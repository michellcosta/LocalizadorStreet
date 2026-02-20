import { Copy, MapPin, Navigation } from 'lucide-react';

interface AddressCardProps {
    address: string;
}

export function AddressCard({ address }: AddressCardProps) {

    const handleCopy = () => {
        navigator.clipboard.writeText(address);
    };

    const mapQuery = encodeURIComponent(address);
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
    const streetViewLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}&layer=c`;

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
            <div className="flex-1 pr-4 mb-4 sm:mb-0">
                <div className="flex items-start gap-3">
                    <div className="mt-1 bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg text-primary-600 dark:text-primary-400">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                            {address}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                    onClick={handleCopy}
                    title="Copiar endereço"
                    className="p-2.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <Copy size={18} />
                </button>
                <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                    <MapPin size={16} />
                    Maps
                </a>
                <a
                    href={streetViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors shadow-sm shadow-primary-500/20"
                >
                    <Navigation size={16} />
                    Street View
                </a>
            </div>
        </div>
    );
}
