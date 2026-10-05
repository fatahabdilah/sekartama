import { createBrowserSupabase } from "@/lib/supabase/browser";
import { MEDIA_BUCKET } from "@/lib/supabase/env";

const MAX_BYTES = 5 * 1024 * 1024;

/** Uploads an image to the public media bucket and returns its URL and pixel size. */
export async function uploadImage(file: File, folder: string) {
  if (!file.type.startsWith("image/")) throw new Error("File harus berupa gambar.");
  if (file.size > MAX_BYTES) throw new Error("Ukuran gambar maksimal 5 MB.");

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const supabase = createBrowserSupabase();
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw new Error(error.message);

  const url = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
  const bitmap = await createImageBitmap(file);
  const size = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return { url, ...size };
}
