import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";

// Target of the front-end admin bar's "Edit Post" link, which only knows the slug.
export default async function EditPostBySlug({ params }: { params: Promise<{ slug: string }> }) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("posts").select("id").eq("slug", (await params).slug).maybeSingle();
  if (!data) notFound();
  redirect(`/admin/blog/${data.id}`);
}
