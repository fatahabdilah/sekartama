import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostEditor, { type PostRecord } from "@/components/admin/wp/PostEditor";
import { requireAdmin } from "@/lib/admin";
import { siteOrigin } from "@/lib/admin-origin";

export const metadata: Metadata = { title: "Edit Post" };

const MESSAGES: Record<string, string> = { published: "Post published.", updated: "Post updated.", draft: "Post draft updated." };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ message?: string }> };

export default async function EditPostPage({ params, searchParams }: Props) {
  const { supabase } = await requireAdmin();
  const [{ id }, { message }] = await Promise.all([params, searchParams]);
  const { data: post } = await supabase.from("posts").select("*").eq("id", id).maybeSingle<PostRecord>();
  if (!post) notFound();

  const notice = message && MESSAGES[message] && (
    <>
      {MESSAGES[message]}{" "}
      {post.published && (
        <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">
          View post
        </a>
      )}
    </>
  );
  return <PostEditor key={post.updated_at} post={post} origin={await siteOrigin()} message={notice || undefined} />;
}
