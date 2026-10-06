import type { ProductCategory } from "@/lib/products";
import type { Project } from "@/lib/projects";
import type { Contact } from "@/lib/site";

export type ChatConfig = {
  enabled: boolean;
  /** Gemini model id; empty falls back to GEMINI_MODEL / gemini-2.5-flash. */
  model: string;
  temperature: number;
  /** Name shown in the chat header and used in its labels. */
  botName: string;
  greeting: string;
  /** Placeholder of the message input. */
  placeholder: string;
  /** Instructions for the model, sent as-is. `{phone}` is replaced with the WhatsApp number from Contact. */
  systemPrompt: string;
  /** Append the current products, projects, and contact details from the site to the system prompt. */
  includeSiteData: boolean;
};

export const defaultChatConfig: ChatConfig = {
  enabled: true,
  model: "",
  temperature: 0.4,
  botName: "Sekar",
  greeting: "Halo! Saya Sekar, asisten AI resmi dari CV. SEKAR TAMA CONTRACTION yang siap membantu Anda.",
  placeholder: "Ketik pesan Anda...",
  systemPrompt: 'Kamu adalah Sekar, asisten AI resmi dari CV. SEKAR TAMA CONTRACTION. Tugasmu adalah melayani pengunjung website dengan ramah dan memberikan informasi akurat mengenai produk UPVC.\nPROFIL PERUSAHAAN:\n- Berdiri sejak: 2019 (Pengalaman 6+ tahun).\n- Fokus utama: Penyediaan produk dan pemasangan kusen, pintu, dan jendela UPVC.\n- Layanan Unggulan: Free Survei & Free Pengiriman wilayah Jabodetabek, Instalasi Profesional.\n- Alamat: Gg. Waru, Serpong, Tangerang Selatan.\n- Kontak: admin@sekartama-upvc.com | WhatsApp: +62 851-5606-5079.\nDATA PRODUK & HARGA ESTIMASI:\n1. Pintu UPVC:\n   - Ekonomis: Mulai Rp 1.600.000.\n   - Swing: Mulai Rp 2.195.000.\n   - Geser/Sliding: Mulai Rp 2.312.000.\n   - Kupu-kupu: Mulai Rp 3.300.000.\n   - Lipat/Folding: Mulai Rp 4.900.000.\n2. Jendela UPVC:\n   - Kaca Mati (Fixed): Mulai Rp 600.000.\n   - Swing: Mulai Rp 1.176.000.\n   - Jungkit: Mulai Rp 1.244.000.\n   - Geser: Mulai Rp 2.350.000.\nATURAN MENJAWAB (PENTING):\n1. Jawablah dalam Bahasa Indonesia yang sopan dan sangat singkat (maksimal 2 kalimat).\n2. JIKA KAMU TIDAK TAHU jawabannya atau pertanyaan terlalu teknis/spesifik, JANGAN MENGARANG. Langsung berikan instruksi: \"Mohon maaf, untuk informasi lebih detail silakan hubungi admin kami via WhatsApp di +62 851-5606-5079.\"\n3. Jika ditanya harga, sebutkan estimasi di atas dan arahkan ke WhatsApp untuk penawaran resmi.',
  includeSiteData: false,
};

export function buildSystemPrompt(
  config: ChatConfig,
  categories: ProductCategory[],
  projects: Project[],
  contact: Contact,
) {
  const prompt = config.systemPrompt.trim().replaceAll("{phone}", contact.phone);
  if (!config.includeSiteData) return prompt;

  // Built from the same data the site renders, so these details never drift from the pages.
  const productLines = categories
    .map(
      (category) =>
        `${category.title}:\n` +
        category.products.map((p) => `- ${p.name}: mulai dari ${p.price} (${p.priceSize}), ukuran custom`).join("\n"),
    )
    .join("\n\n");
  const projectLines = projects.map((p) => `- ${p.name} (${p.location})`).join("\n");

  return `${prompt}

DATA TERKINI DARI WEBSITE
PRODUK DAN HARGA (harga "mulai dari", semua ukuran bisa custom)
${productLines}

CONTOH PROYEK
${projectLines}

KONTAK
- Alamat: ${contact.address}
- Telepon & WhatsApp: ${contact.phone} (${contact.whatsappUrl})
- Email: ${contact.email}
- Instagram: ${contact.instagramHandle}`;
}
