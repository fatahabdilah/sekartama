import Link from "next/link";
import type { Post } from "@/lib/posts";
import PostCard from "./PostCard";
import styles from "./BlogList.module.css";

type BlogListProps = {
  posts: Post[];
  page: number;
  totalPages: number;
  /** Rendered under the grid, e.g. a "see all" link. */
  children?: React.ReactNode;
};

const pageHref = (page: number) => (page === 1 ? "/blog" : `/blog/page/${page}`);

export default function BlogList({ posts, page, totalPages, children }: BlogListProps) {
  return (
    <section className={`section-wide ${styles.section}`}>
      <div className="container">
        <h2 className={`title ${styles.title}`}>Blog Terbaru Kami</h2>

        <div className={styles.grid}>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        {totalPages > 1 && (
          <nav className={styles.pagination} aria-label="Halaman blog">
            {page > 1 && (
              <Link href={pageHref(page - 1)} className={styles.pageLink}>
                « Prev
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) =>
              n === page ? (
                <span key={n} className={`${styles.pageLink} ${styles.current}`} aria-current="page">
                  {n}
                </span>
              ) : (
                <Link key={n} href={pageHref(n)} className={styles.pageLink}>
                  {n}
                </Link>
              ),
            )}
            {page < totalPages && (
              <Link href={pageHref(page + 1)} className={styles.pageLink}>
                Next »
              </Link>
            )}
          </nav>
        )}
        {children}
      </div>
    </section>
  );
}
