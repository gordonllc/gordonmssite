import { Client } from '@replit/object-storage';

let storage: Client | undefined;
function client() {
  if (!process.env.REPLIT_STORAGE_BUCKET_ID) throw new Error('Set REPLIT_STORAGE_BUCKET_ID to your Replit App Storage bucket ID.');
  return storage ??= new Client({ bucketId: process.env.REPLIT_STORAGE_BUCKET_ID });
}

export async function putImage(key: string, contents: Buffer) {
  const result = await client().uploadFromBytes(key, contents);
  if (!result.ok) throw new Error('App Storage upload failed.');
}

export async function getImage(key: string) {
  const result = await client().downloadAsBytes(key);
  if (!result.ok) {
    if (result.error.statusCode === 404) return null;
    throw new Error('App Storage download failed.');
  }
  return Array.isArray(result.value) ? result.value[0] : result.value;
}

export function imageType(bytes: Buffer) {
  if (bytes.length < 12) return null;
  if (bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'image/png';
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'image/jpeg';
  if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  if (bytes.toString('ascii', 4, 8) === 'ftyp' && ['avif', 'avis'].includes(bytes.toString('ascii', 8, 12))) return 'image/avif';
  return null;
}
