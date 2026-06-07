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
  async generateSpeech(text: string, language: 'ur' | 'en', voice: 'male' | 'female' | 'zainab' | 'sarah' | 'asif' | 'john' | 'ayesha'): Promise<Buffer> {
    const customApiUrl = process.env.TTS_API_URL;
    const customApiKey = process.env.TTS_API_KEY;

    if (customApiUrl && customApiKey) {
      const gender = (voice === 'male' || voice === 'asif' || voice === 'john') ? 'male' : 'female';
      try {
        console.log(`[URH LABS TTS] Calling custom external TTS API: ${customApiUrl} with voice: ${voice}`);
        let response = await fetch(customApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${customApiKey}`
          },
          body: JSON.stringify({ 
            text, 
            language, 
            voice,
            voice_type: voice,
            gender: gender,
            vocal_gender: gender
          })
        });

        // If the custom API does not support exact custom strings and returns an error (like 400 or 422), 
        // retry gracefully with the standard 'male' or 'female' values to maintain service continuity!
        if (!response.ok && (response.status === 400 || response.status === 422)) {
          console.warn(`[URH LABS TTS] Custom TTS returned status ${response.status}. Retrying with sanitized legacy gender voice '${gender}'...`);
          response = await fetch(customApiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${customApiKey}`
            },
            body: JSON.stringify({ 
              text, 
              language, 
              voice: gender,
              voice_type: gender,
              gender: gender,
              vocal_gender: gender
            })
          });
        }

        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          return Buffer.from(arrayBuffer);
        }
        console.error(`[URH LABS TTS] Custom TTS API failed with status ${response.status}, falling back to Free Google Translation TTS`);
      } catch (err) {
        console.error(`[URH LABS TTS] Custom TTS API crashed, falling back:`, err);
      }
    }

    // High quality Free Translation TTS fallback
    const chunks = splitTextIntoChunks(text, 180);
    const buffers: Buffer[] = [];

    // Map locales to offer regional/vocal dialect distinctions
    let tl = language === 'ur' ? 'ur' : 'en';
    if (language === 'en') {
      if (voice === 'john') {
        tl = 'en-au'; // Australian English for professional male accent
      } else if (voice === 'sarah') {
        tl = 'en-gb'; // British English for Sarah
      } else {
        tl = 'en'; // Standard English US
      }
    }

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
