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
        return text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    } catch (error) {
        console.error("Erro no OCR:", error);
        throw new Error('Falha ao processar imagem.');
    }
}

/**
 * Filtra as linhas de texto bruto e encontra as que parecem ser endereços.
 * Usa um Regex base focado nos prefixos de ruas brasileiros.
 */
export function filterAddressLines(lines: string[]): string[] {
    // Regex para identificar início de endereços: Rua, R., Av., Avenida, Estr., Estrada, Travessa, Trav.
    // Permitimos letras maiúsculas/minúsculas.
    const addressRegex = /^(Rua|R\.|Av\.|Avenida|Estr\.|Estrada|Trav\.|Travessa|Praca|Praça|Rodovia|Rod\.|Al\.|Alameda)\s+/i;

    return lines.filter(line => {
        return addressRegex.test(line);
    }).map(line => {
        // Limpeza de caracteres ruidosos no final (comum em prints soltos)
        // Remove traços ou caracteres não alfanuméricos isolados no final.
        return line.replace(/[^a-zA-Z0-9\s,.-]$/g, '').trim();
    });
}
