import Tesseract from 'tesseract.js';

/**
 * Função responsável por extrair texto da imagem via Tesseract.js
 * Retorna as linhas como array de strings.
 */
export async function extractTextFromImage(
    imageFile: File,
    onProgress: (progress: number, status: string) => void
): Promise<string[]> {
    try {
        const worker = await Tesseract.createWorker('por', 1, {
            logger: (m) => {
                if (m.status === 'recognizing text') {
                    onProgress(m.progress, m.status);
                } else if (m.status === 'loading tesseract core' || m.status === 'loading language traineddata') {
                    onProgress(m.progress || 0, 'initializing');
                }
            }
        });

        const { data: { text } } = await worker.recognize(imageFile);
        await worker.terminate();

        // Divide em linhas, remove vazias ou apenas com espaços
        const rawLines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        console.log("Linhas extraídas pelo OCR:", rawLines);
        return rawLines;
    } catch (error) {
        console.error("Erro no OCR:", error);
        throw new Error('Falha ao processar imagem.');
    }
}

/**
 * Filtra as linhas de texto bruto e encontra as que parecem ser endereços.
 */
export function filterAddressLines(lines: string[]): string[] {
    return lines.filter(line => {
        // Remove lixo comum no inicio ou fim
        const cleanLine = line.replace(/[^a-zA-Z0-9\s,.-]/g, '').trim();

        // Critério 1: Regex para procurar formato "Rua...", "Travessa..." etc
        const hasAddressPrefix = /\b(Rua|R\.|Av\.|Avenida|Estr\.|Estrada|Trav\.|Tv\.|Travessa|Praca|Praça|Rodovia|Rod\.|Al\.|Alameda)\b/i.test(cleanLine);

        // Critério 2: Regex procurando por um CEP (ex: 25908-683)
        const hasCep = /\b\d{5}-\d{3}\b/.test(cleanLine);

        // Critério 3: Regex procurando padrão de Cidade - Estado (ex: Magé - RJ)
        const hasCityState = /\b[A-Za-zÀ-ÖØ-öø-ÿ\s]+ - [A-Z]{2}\b/.test(cleanLine);

        // Critério 4: Termina com "Brasil"
        const endsWithBrasil = /\bBrasil\b/i.test(cleanLine);

        // Se a linha tem o prefixo de rua OU tem formato de final de endereço (CEP, estado, país) e é minimamente longa
        if ((hasAddressPrefix || hasCep || hasCityState || endsWithBrasil) && cleanLine.length > 15) {
            return true;
        }

        return false;
    }).map(line => {
        // Limpar lixos iniciais e manter caracteres acentuados
        let cleanLine = line.replace(/[^a-zA-Z0-9\s,.\-À-ÖØ-öø-ÿ]/g, '').trim();

        // Matcher que procura obrigatoriamente do Logradouro até a palavra "Brasil"
        // Ignorando datas anteriores como "18Fev2026" e sufixos como "Bs 016  74kmn60kmh"
        const addressMatch = cleanLine.match(/\b(Rua|R\.|Av\.|Avenida|Estr\.|Estrada|Trav\.|Tv\.|Travessa|Praca|Praça|Rodovia|Rod\.|Al\.|Alameda)\b[\s\S]*?\bBrasil\b/i);

        if (addressMatch) {
            return addressMatch[0].trim();
        }

        return cleanLine;
    });
}
