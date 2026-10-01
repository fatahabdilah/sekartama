import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ProjectGrid from "@/components/projects/ProjectGrid";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Proyek",
  description: "Proyek pintu dan jendela UPVC yang telah dikerjakan CV. SEKAR TAMA di Jabodetabek dan sekitarnya.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero title="Proyek" />
      <ProjectGrid projects={projects} />
    </>
  );
}
