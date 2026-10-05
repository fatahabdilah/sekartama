import type { Metadata } from "next";
import Link from "next/link";
import DeleteButton from "@/components/admin/wp/DeleteButton";
import ListTable from "@/components/admin/wp/ListTable";
import RowToggle from "@/components/admin/wp/RowToggle";
import SearchBox from "@/components/admin/wp/SearchBox";
import { Notice } from "@/components/admin/wp/WpForm";
import { requireAdmin } from "@/lib/admin";
import { deleteProject } from "../../actions";

export const metadata: Metadata = { title: "Projects" };

type Props = { searchParams: Promise<{ s?: string; deleted?: string }> };

const COLUMNS = [
  { id: "thumb", label: "Image" },
  { id: "title", label: "Name", primary: true },
  { id: "location", label: "Location" },
  { id: "menu_order", label: "Order" },
];

export default async function AdminProjectsPage({ searchParams }: Props) {
  const { s: search, deleted } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data: all } = await supabase.from("projects").select("id, name, location, image, sort_order").order("sort_order").order("created_at");
  const projects = (all ?? []).filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="wrap">
      <h1 className="wp-heading-inline">Projects</h1>
      <Link href="/admin/proyek/new" className="page-title-action">
        Add New Project
      </Link>
      {search && (
        <span className="subtitle">
          Search results for: <strong>{search}</strong>
        </span>
      )}
      <hr className="wp-header-end" />

      {deleted && <Notice type="success">1 project permanently deleted.</Notice>}

      <h2 className="screen-reader-text">Filter projects list</h2>
      <ul className="subsubsub">
        <li className="all">
          <Link href="/admin/proyek" className="current" aria-current="page">
            All <span className="count">({all?.length ?? 0})</span>
          </Link>
        </li>
      </ul>

      <SearchBox id="post-search-input" label="Search Projects" value={search} />

      <h2 className="screen-reader-text">Projects list</h2>
      <ListTable columns={COLUMNS} className="posts" itemCount={projects.length} empty="No projects found.">
        {projects.map((project) => (
          <tr key={project.id} id={`post-${project.id}`} className="iedit level-0 type-project status-publish hentry">
            <td className="thumb column-thumb" data-colname="Image">
              {project.image && <img src={project.image} alt="" width={50} height={50} />}
            </td>
            <td className="title column-title has-row-actions column-primary" data-colname="Name">
              <strong>
                <Link className="row-title" href={`/admin/proyek/${project.id}`} aria-label={`“${project.name}” (Edit)`}>
                  {project.name}
                </Link>
              </strong>
              <div className="row-actions">
                <span className="edit">
                  <Link href={`/admin/proyek/${project.id}`}>Edit</Link> |{" "}
                </span>
                <span className="trash">
                  <DeleteButton action={deleteProject} id={project.id} /> |{" "}
                </span>
                <span className="view">
                  <a href="/proyek" rel="bookmark" target="_blank">
                    View
                  </a>
                </span>
              </div>
              <RowToggle />
            </td>
            <td className="location column-location" data-colname="Location">
              {project.location}
            </td>
            <td className="menu_order column-menu_order" data-colname="Order">
              {project.sort_order}
            </td>
          </tr>
        ))}
      </ListTable>
      <div className="clear" />
    </div>
  );
}
