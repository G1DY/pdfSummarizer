export function chunkText(text, maxChunkSize = 1000) {
    const sentences = text.match(/[^.!?]+[.!?]*/g) || [];
    const chunks = [];
    let currentChunk = '';

    for (const sentence of sentences) {
        if ((currentChunk + sentence).length <= maxChunkSize) {
            currentChunk += sentence;
        } else {
            if (currentChunk.length > 0) {
                chunks.push(currentChunk.trim());
            }
            currentChunk = sentence;
        }
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
    }

    return chunks.length > 0 ? chunks : [text.substring(0, maxChunkSize)]; // Fallback for un-sentence-able text
}