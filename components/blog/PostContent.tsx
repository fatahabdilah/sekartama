import { sanitizeArticle } from "@/lib/html";
import styles from "./PostContent.module.css";

// Article bodies are HTML from the admin's classic editor; sanitized again here as a second line of defence.
export default function PostContent({ content }: { content: string }) {
  return <div className={styles.content} dangerouslySetInnerHTML={{ __html: sanitizeArticle(content) }} />;
}
