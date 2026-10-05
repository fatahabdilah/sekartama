import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ProjectGrid from "@/components/projects/ProjectGrid";
import { getProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Proyek",
  description: "Proyek pintu dan jendela UPVC yang telah dikerjakan CV. SEKAR TAMA di Jabodetabek dan sekitarnya.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <>
      <PageHero title="Proyek" />
      <ProjectGrid projects={projects} />
    </>
  );
}
