"use server";

import { updateTag } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { plainText, sanitizeArticle } from "@/lib/html";
import type { ChatConfig } from "@/lib/assistant";
import { GEMINI_KEY } from "@/lib/secrets";
import type { ContactSettings } from "@/lib/site";
import { REMEMBER_COOKIE } from "@/lib/supabase/cookies";
import { CONTENT_TAG, isSupabaseConfigured } from "@/lib/supabase/env";
import { createAuthClient } from "@/lib/supabase/server";

export type FormState = { error?: string; message?: string };

/** Login form state; the page turns `code` into WordPress's wording. */
export type LoginState = { code?: LoginError; login?: string };
export type LoginError =
  | "empty_username"
  | "empty_password"
  | "invalid"
  | "not_confirmed"
  | "not_admin"
  | "no_tables"
  | "not_configured"
  | "rate_limited";

const ADMIN_EMAIL_DOMAIN = "sekartama-upvc.com";
const YEAR = 60 * 60 * 24 * 365;

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();
const int = (formData: FormData, key: string, fallback = 0) => {
  const value = Number.parseInt(text(formData, key), 10);
  return Number.isFinite(value) ? value : fallback;
};

// A bare username like "admin" signs in as admin@sekartama-upvc.com.
const toEmail = (login: string) => (login.includes("@") ? login : `${login}@${ADMIN_EMAIL_DOMAIN}`);

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function excerptFrom(html: string) {
  const plain = plainText(html);
  return plain.length > 110 ? `${plain.slice(0, 110).trimEnd()}…` : plain;
}

// Public pages cache Supabase reads under CONTENT_TAG; expire it so the change shows on the next visit.
function published() {
  updateTag(CONTENT_TAG);
}

// Auth ------------------------------------------------------------------------

export async function signIn(_: LoginState, formData: FormData): Promise<LoginState> {
  const login = text(formData, "log");
  const password = String(formData.get("pwd") ?? "");
  if (!isSupabaseConfigured) return { code: "not_configured", login };
  if (!login) return { code: "empty_username", login };
  if (!password) return { code: "empty_password", login };

  const remember = formData.get("rememberme") === "forever";
  const cookieStore = await cookies();
  cookieStore.set(REMEMBER_COOKIE, remember ? "1" : "0", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    ...(remember ? { maxAge: YEAR } : {}),
  });

  const supabase = await createAuthClient({ remember });
  const { data, error } = await supabase.auth.signInWithPassword({ email: toEmail(login), password });
  if (error?.code === "email_not_confirmed") return { code: "not_confirmed", login };
  if (error?.status === 429) return { code: "rate_limited", login };
  if (error) return { code: "invalid", login };

  const { data: admin, error: adminError } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (adminError || !admin) {
    await supabase.auth.signOut();
    return { code: adminError ? "no_tables" : "not_admin", login };
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login?loggedout=true");
}

export async function requestPasswordReset(_: FormState, formData: FormData): Promise<FormState> {
  const login = text(formData, "user_login");
  if (!login) return { error: "Please enter a username or email address." };
  if (!isSupabaseConfigured) return { error: "Supabase is not configured." };

  const headerList = await headers();
  const origin = `${headerList.get("x-forwarded-proto") ?? "http"}://${headerList.get("host")}`;
  const supabase = await createAuthClient();
  const { error } = await supabase.auth.resetPasswordForEmail(toEmail(login), {
    redirectTo: `${origin}/admin/auth/callback?next=/admin/reset-password`,
  });
  if (error?.status === 429) return { error: "Too many password reset requests. Please try again later." };
  if (error) return { error: "The email could not be sent. Please try again later." };
  redirect("/admin/login?checkemail=confirm");
}

export async function resetPassword(_: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("pass1") ?? "");
  if (password.length < 8) return { error: "The password must be at least 8 characters long." };

  const supabase = await createAuthClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  await supabase.auth.signOut();
  redirect("/admin/login?password=changed");
}

// Blog ------------------------------------------------------------------------

export async function savePost(_: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  const title = text(formData, "post_title");
  const content = sanitizeArticle(String(formData.get("content") ?? ""));
  const slug = slugify(text(formData, "post_name") || title);
  const isPublished = text(formData, "post_status") !== "draft";

  if (!title) return { error: "Please enter a title." };
  if (!slug || slug === "page") return { error: "That permalink is not valid." };

  const row = {
    title,
    slug,
    date: text(formData, "post_date") || new Date().toISOString().slice(0, 10),
    content,
    excerpt: excerptFrom(content),
    image_url: text(formData, "image_url"),
    image_width: int(formData, "image_width", 1200),
    image_height: int(formData, "image_height", 800),
    published: isPublished,
    updated_at: new Date().toISOString(),
  };

  if (!id) {
    const { data, error } = await supabase.from("posts").insert(row).select("id").single();
    if (error) return { error: error.code === "23505" ? "Another post already uses this permalink." : error.message };
    published();
    redirect(`/admin/blog/${data.id}?message=${isPublished ? "published" : "draft"}`);
  }

  const { error } = await supabase.from("posts").update(row).eq("id", id);
  if (error) return { error: error.code === "23505" ? "Another post already uses this permalink." : error.message };
  published();
  // Like post.php, reload the editor with a message so every field reflects what was saved.
  redirect(`/admin/blog/${id}?message=${isPublished ? "updated" : "draft"}`);
}

export async function deletePost(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("posts").delete().eq("id", text(formData, "id"));
  published();
  redirect("/admin/blog?deleted=1");
}

// Products --------------------------------------------------------------------

export async function saveProduct(_: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  const name = text(formData, "post_title");
  if (!name) return { error: "Please enter a product name." };

  const row = {
    category_slug: text(formData, "category_slug"),
    name,
    description: text(formData, "description"),
    price: text(formData, "price"),
    price_size: text(formData, "price_size"),
    images: formData.getAll("images").map(String).filter(Boolean),
    sort_order: int(formData, "menu_order"),
  };

  if (!id) {
    const { data, error } = await supabase.from("products").insert(row).select("id").single();
    if (error) return { error: error.message };
    published();
    redirect(`/admin/produk/${data.id}?message=published`);
  }

  const { error } = await supabase.from("products").update(row).eq("id", id);
  if (error) return { error: error.message };
  published();
  redirect(`/admin/produk/${id}?message=updated`);
}

export async function deleteProduct(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("products").delete().eq("id", text(formData, "id"));
  published();
  redirect("/admin/produk?deleted=1");
}

function categoryFields(formData: FormData) {
  const title = text(formData, "name");
  return {
    title,
    slug: slugify(text(formData, "slug") || title),
    meta_description: text(formData, "description"),
    sort_order: int(formData, "menu_order"),
  };
}

function categoryError(error: { code?: string; message: string }) {
  return error.code === "23505" ? "A category with this slug already exists." : error.message;
}

export async function createCategory(_: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const row = categoryFields(formData);
  if (!row.title) return { error: "A name is required for this term." };
  if (!row.slug) return { error: "The slug is not valid." };

  if (!text(formData, "menu_order")) {
    const { data } = await supabase.from("product_categories").select("sort_order").order("sort_order", { ascending: false }).limit(1);
    row.sort_order = (data?.[0]?.sort_order ?? -1) + 1;
  }
  const { error } = await supabase.from("product_categories").insert(row);
  if (error) return { error: categoryError(error) };

  published();
  redirect(`/admin/produk/kategori?added=${Date.now()}`);
}

export async function saveCategory(_: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const original = text(formData, "original_slug");
  const row = categoryFields(formData);
  if (!row.title) return { error: "A name is required for this term." };
  if (!row.slug) return { error: "The slug is not valid." };

  // Renaming the slug cascades to the products in this category (foreign key ON UPDATE CASCADE).
  const { error } = await supabase.from("product_categories").update(row).eq("slug", original);
  if (error) return { error: categoryError(error) };

  published();
  redirect(`/admin/produk/kategori/${row.slug}?message=updated`);
}

export async function deleteCategory(formData: FormData) {
  const { supabase } = await requireAdmin();
  const slug = text(formData, "id");
  const { count } = await supabase.from("products").select("*", { count: "exact", head: true }).eq("category_slug", slug);
  if (count) redirect(`/admin/produk/kategori?error=has_products&count=${count}`);

  await supabase.from("product_categories").delete().eq("slug", slug);
  published();
  redirect("/admin/produk/kategori?deleted=1");
}

// Projects --------------------------------------------------------------------

export async function saveProject(_: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const id = text(formData, "id");
  const name = text(formData, "post_title");
  if (!name) return { error: "Please enter a project name." };

  const row = {
    name,
    location: text(formData, "location"),
    image: text(formData, "image"),
    sort_order: int(formData, "menu_order"),
  };

  if (!id) {
    const { data, error } = await supabase.from("projects").insert(row).select("id").single();
    if (error) return { error: error.message };
    published();
    redirect(`/admin/proyek/${data.id}?message=published`);
  }

  const { error } = await supabase.from("projects").update(row).eq("id", id);
  if (error) return { error: error.message };
  published();
  redirect(`/admin/proyek/${id}?message=updated`);
}

export async function deleteProject(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("projects").delete().eq("id", text(formData, "id"));
  published();
  redirect("/admin/proyek?deleted=1");
}

// Settings --------------------------------------------------------------------

async function saveSetting(key: string, value: object) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (!error) published();
  return error;
}

export async function saveContact(_: FormState, formData: FormData): Promise<FormState> {
  const whatsapp = text(formData, "whatsapp").replace(/\D/g, "").replace(/^0/, "62");
  if (!/^\d{8,15}$/.test(whatsapp)) return { error: "The WhatsApp number is not valid. Example: 6285156065079" };

  const value: ContactSettings = {
    address: text(formData, "address"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    whatsapp,
    instagram: text(formData, "instagram").replace(/^@/, ""),
  };
  const error = await saveSetting("contact", value);
  return error ? { error: error.message } : { message: "Settings saved." };
}

export async function saveChat(_: FormState, formData: FormData): Promise<FormState> {
  const model = text(formData, "model");
  if (model && !/^[\w.-]+$/.test(model)) return { error: "The model name is not valid." };

  const temperature = Number(text(formData, "temperature"));
  if (!Number.isFinite(temperature) || temperature < 0 || temperature > 2) {
    return { error: "Temperature must be between 0 and 2." };
  }

  const value: ChatConfig = {
    enabled: formData.get("enabled") === "on",
    model,
    temperature,
    greeting: text(formData, "greeting"),
    companyInfo: text(formData, "companyInfo"),
    rules: text(formData, "rules"),
  };
  if (!value.greeting) return { error: "Please enter a greeting." };

  // Blank keeps the saved key; the checkbox removes it.
  const apiKey = text(formData, "gemini_api_key");
  if (apiKey || formData.get("remove_gemini_key") === "on") {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.rpc("set_secret", { p_key: GEMINI_KEY, p_value: apiKey });
    if (error) return { error: `The API key could not be saved: ${error.message}` };
  }

  const error = await saveSetting("chat", value);
  return error ? { error: error.message } : { message: "Settings saved." };
}
