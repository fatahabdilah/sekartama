import type { Metadata } from "next";
import ProjectEditor from "@/components/admin/wp/ProjectEditor";

export const metadata: Metadata = { title: "Add New Project" };

export default function NewProjectPage() {
  return <ProjectEditor />;
}
