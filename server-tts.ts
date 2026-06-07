import { Buffer } from 'buffer';

function splitTextIntoChunks(text: string, maxLen = 180): string[] {
  // Remove duplicate whitespaces
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLen) return [normalized];

  const chunks: string[] = [];
  let currentChunk = '';

  // Split by common punctuation first to preserve natural phrasing pauses
  const phrases = normalized.split(/(?<=[۔،.!?])\s+/);

  for (const phrase of phrases) {
    if (phrase.length <= maxLen) {
      if ((currentChunk + ' ' + phrase).trim().length <= maxLen) {
        currentChunk = (currentChunk + ' ' + phrase).trim();
      } else {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = phrase;
      }
    } else {
      // If a single phrase is longer than maxLen, split by words
      const words = phrase.split(' ');
      for (const word of words) {
        if ((currentChunk + ' ' + word).trim().length <= maxLen) {
          currentChunk = (currentChunk + ' ' + word).trim();
        } else {
          if (currentChunk) chunks.push(currentChunk);
          currentChunk = word;
        }
      }
    }
  }
  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

export const ttsService = {
  async generateSpeech(text: string, language: 'ur' | 'en', voice: 'male' | 'female' | 'zainab' | 'sarah' | 'asif' | 'john'): Promise<Buffer> {
    const customApiUrl = process.env.TTS_API_URL;
    const customApiKey = process.env.TTS_API_KEY;

    if (customApiUrl && customApiKey) {
      try {
        console.log(`[URH LABS TTS] Calling custom external TTS API: ${customApiUrl}`);
        const response = await fetch(customApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${customApiKey}`
          },
          body: JSON.stringify({ text, language, voice })
        });
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          return Buffer.from(arrayBuffer);
        }
        console.error(`[URH LABS TTS] Custom TTS API failed with status ${response.status}, falling back to free Google Translation TTS`);
      } catch (err) {
        console.error(`[URH LABS TTS] Custom TTS API crashed, falling back:`, err);
      }
    }

    // High quality Free Translation TTS fallback
    const chunks = splitTextIntoChunks(text, 180);
    const buffers: Buffer[] = [];

    // Map locales
    // 'ur' maps to ur-PK or ur. Google TTS supports tl=ur.
    const tl = language === 'ur' ? 'ur' : 'en';

    console.log(`[URH LABS TTS] Synthesizing ${chunks.length} text chunks using Google Translation engine (tl=${tl})`);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      // Google translation speech TTS endpoint
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${tl}&client=tw-ob&q=${encodeURIComponent(chunk)}`;
      
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36',
          }
        });

        if (!response.ok) {
          throw new Error(`Google TTS returned status ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        buffers.push(Buffer.from(arrayBuffer));
      } catch (err) {
        console.error(`[URH LABS TTS] Error fetching chunk ${i}:`, err);
        throw new Error(`Speech synthesis failed on chunk ${i+1}. Please try a shorter string or contact admin.`);
      }
    }

    if (buffers.length === 0) {
      throw new Error("No speech audio could be synthesized");
    }

    // Concatenate all sound files buffers
    return Buffer.concat(buffers);
  }
};
