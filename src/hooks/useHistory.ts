import { useState } from 'react';

const HISTORY_KEY = '@localizador/history';

export function useHistory() {
    const [history, setHistory] = useState<string[]>(() => {
        try {
            const stored = localStorage.getItem(HISTORY_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Falha ao parsear histórico', e);
        }
        return [];
    });

    // Adicionar novos endereços garantindo que não há duplicados imediatos na lista final
    const addToHistory = (newAddresses: string[]) => {
        setHistory(prev => {
            const updatedList = [...newAddresses, ...prev];
            const uniqueList = Array.from(new Set(updatedList)); // Remove duplicações
            localStorage.setItem(HISTORY_KEY, JSON.stringify(uniqueList));
            return uniqueList;
        });
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem(HISTORY_KEY);
    };

    return {
        history,
        addToHistory,
        clearHistory
    };
}
