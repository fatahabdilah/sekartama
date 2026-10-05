import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectEditor, { type ProjectRecord } from "@/components/admin/wp/ProjectEditor";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "Edit Project" };

const MESSAGES: Record<string, string> = { published: "Project published.", updated: "Project updated." };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ message?: string }> };

export default async function EditProjectPage({ params, searchParams }: Props) {
  const { supabase } = await requireAdmin();
  const [{ id }, { message }] = await Promise.all([params, searchParams]);
  const { data: project } = await supabase.from("projects").select("*").eq("id", id).maybeSingle<ProjectRecord>();
  if (!project) notFound();

  const notice = message && MESSAGES[message] && (
    <>
      {MESSAGES[message]}{" "}
      <a href="/proyek" target="_blank" rel="noreferrer">
        View project
      </a>
    </>
  );
  return <ProjectEditor key={JSON.stringify(project)} project={project} message={notice || undefined} />;
}
