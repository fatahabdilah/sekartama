import BlogList from "./BlogList";
import PageHero from "@/components/PageHero";
import { getPosts } from "@/lib/data";
import { POSTS_PER_PAGE } from "@/lib/posts";

export async function getTotalBlogPages() {
  return Math.max(1, Math.ceil((await getPosts()).length / POSTS_PER_PAGE));
}

export async function BlogPage({ page }: { page: number }) {
  const [posts, totalPages] = await Promise.all([getPosts(), getTotalBlogPages()]);
  const start = (page - 1) * POSTS_PER_PAGE;
  return (
    <>
      <PageHero title="Blog" />
      <BlogList posts={posts.slice(start, start + POSTS_PER_PAGE)} page={page} totalPages={totalPages} />
    </>
  );
}
