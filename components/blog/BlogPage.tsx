import BlogList from "./BlogList";
import PageHero from "@/components/PageHero";
import { posts, POSTS_PER_PAGE } from "@/lib/posts";

export const totalBlogPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));

export function BlogPage({ page }: { page: number }) {
  const start = (page - 1) * POSTS_PER_PAGE;
  return (
    <>
      <PageHero title="Blog" />
      <BlogList posts={posts.slice(start, start + POSTS_PER_PAGE)} page={page} totalPages={totalBlogPages} />
    </>
  );
}
