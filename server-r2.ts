import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const isR2Configured = !!(
  process.env.R2_ENDPOINT &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY &&
  process.env.R2_BUCKET_NAME
);

let s3Client: S3Client | null = null;
const bucketName = process.env.R2_BUCKET_NAME || 'urhlabs-audio';

if (isR2Configured) {
  try {
    s3Client = new S3Client({
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
      region: 'auto',
    });
    console.log("[URH LABS R2] Initialized Cloudflare R2 Bucket client");
  } catch (err) {
    console.error("[URH LABS R2] Failed to initialize S3 client:", err);
  }
} else {
  console.log("[URH LABS R2] Using Local Filesystem Fallback (uploads will be saved to public/audio)");
}

export const r2Service = {
  isConfigured: isR2Configured,

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
    const relativePath = `audio/${userId}/${dateStr}/${filename}`;

    if (s3Client) {
      try {
        const uploadParams = {
          Bucket: bucketName,
          Key: relativePath,
          Body: audioBuffer,
          ContentType: format === 'mp3' ? 'audio/mpeg' : 'video/mp4',
        };
        await s3Client.send(new PutObjectCommand(uploadParams));

        // In a real R2 setup, we can generate real presigned urls or return direct CDN with signed tokens
        // Playback expires in 1 hour (3600 seconds), download with content-disposition in 5 minutes (300 seconds)
        // Note: For presigning, we can use GetObjectCommand
        const { GetObjectCommand } = await import('@aws-sdk/client-s3');
        const playCommand = new GetObjectCommand({ Bucket: bucketName, Key: relativePath });
        const downloadCommand = new GetObjectCommand({
          Bucket: bucketName,
          Key: relativePath,
          ResponseContentDisposition: `attachment; filename="${filename}"`,
        });

        const playUrl = await getSignedUrl(s3Client, playCommand, { expiresIn: 3600 });
        const downloadUrl = await getSignedUrl(s3Client, downloadCommand, { expiresIn: 300 });

        return { relativePath, playUrl, downloadUrl };
      } catch (err) {
        console.error("R2 Upload failed:", err);
        // Fall back to local storage if bucket upload fails
      }
    }

    // Local Filesystem fallback
    const targetDir = path.join(process.cwd(), 'public', 'audio', userId, dateStr);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetPath = path.join(targetDir, filename);
    await fs.promises.writeFile(targetPath, audioBuffer);

    // Development local URL paths
    const urlPath = `/audio/${userId}/${dateStr}/${filename}`;
    
    // Play & download URLs are straightforward local server paths
    return {
      relativePath: urlPath,
      playUrl: urlPath,
      downloadUrl: `${urlPath}?download=true`,
    };
  }
};
