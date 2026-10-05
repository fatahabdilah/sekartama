import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/posts";
import styles from "./PostCard.module.css";

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

function commentLabel(count: number) {
  if (count === 0) return "No Comments";
  return count === 1 ? "1 Comment" : `${count} Comments`;
}

export default function PostCard({ post }: { post: Post }) {
  const href = `/blog/${post.slug}`;

  return (
    <article className={styles.card}>
      <Link href={href} className={styles.imageLink} tabIndex={-1} aria-hidden="true">
        <Image
          src={post.image.src}
          alt=""
          width={post.image.width}
          height={post.image.height}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 390px"
          className={styles.image}
        />
      </Link>
      <h3 className={styles.title}>
        <Link href={href}>{post.title}</Link>
      </h3>
      <p className={styles.meta}>
        <time dateTime={post.date}>{dateFormat.format(new Date(post.date))}</time>
        <span aria-hidden="true">·</span>
        <span>{commentLabel(post.comments)}</span>
      </p>
      <p className={styles.excerpt}>{post.excerpt}</p>
      <Link href={href} className={`btn btn-yellow ${styles.cta}`}>
        Baca Selengkapnya
      </Link>
    </article>
  );
}
