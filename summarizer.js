export async function summarizeText(text, mode, apiKey = null) {
    if (mode === 'online' && apiKey) {
        return await summarizeOnline(text, apiKey);
    } else {
        return summarizeOffline(text);
    }
}

async function summarizeOnline(text, apiKey) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Summarize the following text:

${text}`
                    }]
                }]
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Gemini API error: ${response.status} - ${errorData.error.message}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error summarizing with Gemini API:', error);
        throw new Error('Failed to get summary from Gemini API. Check your API key and internet connection.');
    }
}

function summarizeOffline(text) {
    // Basic extractive summarization based on sentence scoring (word frequency)
    const sentences = text.match(/[^.!?]+[.!?]*/g) || [];
    if (sentences.length === 0) {
        return 'No content to summarize.';
    }

    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const wordFrequency = {};
    words.forEach(word => {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });

    const sentenceScores = {};
    sentences.forEach((sentence, index) => {
        let score = 0;
        const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
        sentenceWords.forEach(word => {
            score += wordFrequency[word] || 0;
        });
        sentenceScores[index] = score;
    });

    // Sort sentences by score in descending order
    const sortedSentences = Object.keys(sentenceScores).sort((a, b) => sentenceScores[b] - sentenceScores[a]);

    // Take the top 30% of sentences, or a minimum of 3 sentences
    const numSentences = Math.max(3, Math.ceil(sentences.length * 0.3));
    const topSentences = sortedSentences.slice(0, numSentences).map(index => sentences[index]);

    // Restore original order
    topSentences.sort((a, b) => sentences.indexOf(a) - sentences.indexOf(b));

    return topSentences.join(' ');
}