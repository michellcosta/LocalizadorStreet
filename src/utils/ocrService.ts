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
 * Usa um Regex base focado nos prefixos de ruas brasileiros.
 */
export function filterAddressLines(lines: string[]): string[] {
    // Como as imagens variam muito em fonte e nitidez, vamos relaxar.
    // Manteremos apenas linhas que não parecem lixo puro curto.
    // Se tiver pelo menos 8 caracteres e conter letras na composição, consideraremos útil de ser mostrado ao usuário

    return lines.filter(line => {
        // Remover lixo pontual
        const cleanLine = line.replace(/[^a-zA-Z0-9\s,.-]/g, '').trim();

        // Pelo menos 8 caracteres e deve conter pelo menos uma letra
        if (cleanLine.length >= 8 && /[a-zA-Z]/.test(cleanLine)) {
            return true;
        }
        return false;
    }).map(line => {
        // Retorna a linha limpando somente os caracteres ruidosos residuais de prints
        return line.replace(/[^a-zA-Z0-9\s,.-]/g, '').trim();
    });
}
