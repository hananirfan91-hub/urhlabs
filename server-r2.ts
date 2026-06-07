import fs from 'fs';
import path from 'path';
import { supabase, isSupabaseConfigured } from './server-db';

console.log(`[URH LABS STORAGE] Storage backend initialized via ${isSupabaseConfigured ? 'Supabase Storage Buckets' : 'Local Workspace Filesystem'}`);

export const r2Service = {
  isConfigured: isSupabaseConfigured,

  async uploadAudio(
    userId: string,
    audioBuffer: Buffer,
    voice: string,
    lang: string,
    format: 'mp3' | 'mp4' = 'mp3'
  ): Promise<{ relativePath: string; playUrl: string; downloadUrl: string }> {
    const dateStr = new Date().toISOString().substring(0, 10); // YYYY-MM-DD
    const timestamp = Date.now();
    const filename = `${timestamp}-${voice}-${lang}.${format}`;
    const relativePath = `${userId}/${dateStr}/${filename}`;

    // 1. Supabase Storage Upload if configured
    if (supabase) {
      try {
        console.log(`[URH LABS STORAGE] Uploading audio file to Supabase Bucket "audio" under path: ${relativePath}`);
        
        // Convert Buffer to ArrayBuffer/Uint8Array for Supabase JS client compatibility
        const fileData = new Uint8Array(audioBuffer);
        const mimeType = format === 'mp3' ? 'audio/mpeg' : 'video/mp4';

        const { data, error } = await supabase.storage
          .from('audio')
          .upload(relativePath, fileData, {
            contentType: mimeType,
            upsert: true
          });

        if (error) {
          console.error("[URH LABS STORAGE] Supabase Storage upload failed, trying local fallback:", error.message);
        } else {
          // Get direct public URL
          const { data: { publicUrl } } = supabase.storage
            .from('audio')
            .getPublicUrl(relativePath);

          console.log(`[URH LABS STORAGE] Supabase Storage upload successful: ${publicUrl}`);
          return {
            relativePath: relativePath,
            playUrl: publicUrl,
            downloadUrl: `${publicUrl}?download=true`
          };
        }
      } catch (err) {
        console.error("[URH LABS STORAGE] Supabase Storage upload crashed, falling back to local files:", err);
      }
    }

    // 2. Local Filesystem fallback
    const targetDir = path.join(process.cwd(), 'public', 'audio', userId, dateStr);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetPath = path.join(targetDir, filename);
    await fs.promises.writeFile(targetPath, audioBuffer);

    // Development local URL paths (served from Express static routing)
    const urlPath = `/audio/${userId}/${dateStr}/${filename}`;
    
    console.log(`[URH LABS STORAGE] Saved audio locally: ${urlPath}`);
    return {
      relativePath: urlPath,
      playUrl: urlPath,
      downloadUrl: `${urlPath}?download=true`,
    };
  }
};
