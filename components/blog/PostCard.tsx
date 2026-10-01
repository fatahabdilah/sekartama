import Image from "next/image";
import type { Post } from "@/lib/posts";
import styles from "./PostCard.module.css";

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

function commentLabel(count: number) {
  if (count === 0) return "No Comments";
  return count === 1 ? "1 Comment" : `${count} Comments`;
}

export default function PostCard({ post }: { post: Post }) {
  // Article pages aren't designed yet, so the links are placeholders.
  const href = "#";

  return (
    <article className={styles.card}>
      <a href={href} className={styles.imageLink} tabIndex={-1} aria-hidden="true">
        <Image
          src={post.image.src}
          alt=""
          width={post.image.width}
          height={post.image.height}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 390px"
          className={styles.image}
        />
      </a>
      <h3 className={styles.title}>
        <a href={href}>{post.title}</a>
      </h3>
      <p className={styles.meta}>
        <time dateTime={post.date}>{dateFormat.format(new Date(post.date))}</time>
        <span aria-hidden="true">·</span>
        <span>{commentLabel(post.comments)}</span>
      </p>
      <p className={styles.excerpt}>{post.excerpt}</p>
      <a href={href} className={`btn btn-yellow ${styles.cta}`}>
        Baca Selengkapnya
      </a>
    </article>
  );
}
