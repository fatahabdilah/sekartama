import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogList from "@/components/blog/BlogList";
import PostContent from "@/components/blog/PostContent";
import PageHero from "@/components/PageHero";
import { getPost, getPosts } from "@/lib/data";
import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };

const dateFormat = new Intl.DateTimeFormat("id-ID", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export async function generateStaticParams() {
  return (await getPosts()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      url: `/blog/${post.slug}`,
      ...(post.image.src && { images: [{ url: post.image.src, width: post.image.width, height: post.image.height }] }),
    },
  };
}

export default async function PostPage({ params }: Props) {
  const slug = (await params).slug;
  const posts = await getPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const post = posts[index];
  // Posts are newest first, so the previous (older) post is the next one in the list.
  const previous = posts[index + 1];
  const next = posts[index - 1];
  const recent = posts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <PageHero title="Blog" />
      <article className={`container ${styles.article}`}>
        <Link href="/blog" className={styles.back}>
          ← Kembali ke Blog
        </Link>
        <h1 className={styles.title}>{post.title}</h1>
        <time dateTime={post.date} className={styles.date}>
          {dateFormat.format(new Date(post.date))}
        </time>
        {post.image.src && (
          <Image
            src={post.image.src}
            alt=""
            width={post.image.width}
            height={post.image.height}
            sizes="(max-width: 840px) 100vw, 800px"
            className={styles.image}
            priority
          />
        )}
        <div className={styles.body}>
          <PostContent content={post.content || post.excerpt} />
        </div>

        {(previous || next) && (
          <nav className={styles.postNav} aria-label="Navigasi artikel">
            {previous ? (
              <Link href={`/blog/${previous.slug}`} className={styles.postNavLink}>
                <span>← Artikel sebelumnya</span>
                {previous.title}
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`/blog/${next.slug}`} className={`${styles.postNavLink} ${styles.postNavNext}`}>
                <span>Artikel berikutnya →</span>
                {next.title}
              </Link>
            )}
          </nav>
        )}
      </article>

      {recent.length > 0 && (
        <BlogList posts={recent} page={1} totalPages={1}>
          <div className={styles.seeAll}>
            <Link href="/blog" className="btn btn-yellow">
              Lihat Semua Blog
            </Link>
          </div>
        </BlogList>
      )}
    </>
  );
}
