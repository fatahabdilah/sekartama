import type { Metadata } from "next";
import { BlogPage } from "@/components/blog/BlogPage";

export const metadata: Metadata = {
  title: "Blog",
  description: "Artikel seputar kusen, pintu, dan jendela UPVC dari CV. SEKAR TAMA.",
};

export default function Blog() {
  return <BlogPage page={1} />;
}
