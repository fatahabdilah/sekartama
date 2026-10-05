import type { Metadata } from "next";
import PostEditor from "@/components/admin/wp/PostEditor";
import { siteOrigin } from "@/lib/admin-origin";

export const metadata: Metadata = { title: "Add New Post" };

export default async function NewPostPage() {
  return <PostEditor origin={await siteOrigin()} />;
}
