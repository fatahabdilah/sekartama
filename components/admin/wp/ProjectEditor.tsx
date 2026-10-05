import Link from "next/link";
import { deleteProject, saveProject } from "@/app/admin/actions";
import FeaturedImage from "./FeaturedImage";
import Postbox from "./Postbox";
import PublishBox from "./PublishBox";
import TitleField from "./TitleField";
import WpForm from "./WpForm";

export type ProjectRecord = { id: string; name: string; location: string; image: string; sort_order: number };

export default function ProjectEditor({ project, message }: { project?: ProjectRecord; message?: React.ReactNode }) {
  return (
    <div className="wrap">
      <h1 className="wp-heading-inline">{project ? "Edit Project" : "Add New Project"}</h1>
      {project && (
        <Link href="/admin/proyek/new" className="page-title-action">
          Add New Project
        </Link>
      )}
      <hr className="wp-header-end" />

      <WpForm action={saveProject} name="post" id="post" initialMessage={message}>
        {project && <input type="hidden" name="id" value={project.id} />}
        <div id="poststuff">
          <div id="post-body" className="metabox-holder columns-2">
            <div id="post-body-content" style={{ position: "relative" }}>
              <TitleField defaultValue={project?.name} placeholder="Project name" />
            </div>

            <div id="postbox-container-1" className="postbox-container">
              <div id="side-sortables" className="meta-box-sortables">
                <PublishBox isNew={!project} id={project?.id} deleteAction={deleteProject} />
                <FeaturedImage name="image" folder="projects" title="Project image" defaultValue={project?.image} />
                <Postbox id="pageparentdiv" title="Project Attributes">
                  <p className="post-attributes-label-wrapper menu-order-label-wrapper">
                    <label className="post-attributes-label" htmlFor="menu_order">
                      Order
                    </label>
                  </p>
                  <input name="menu_order" type="text" size={4} id="menu_order" defaultValue={project?.sort_order ?? 0} />
                  <p className="post-attributes-help-text">Lower numbers are shown first.</p>
                </Postbox>
              </div>
            </div>

            <div id="postbox-container-2" className="postbox-container">
              <div id="normal-sortables" className="meta-box-sortables">
                <Postbox id="project_data" title="Project details">
                  <table className="form-table" role="presentation">
                    <tbody>
                      <tr>
                        <th scope="row">
                          <label htmlFor="location">Location</label>
                        </th>
                        <td>
                          <input name="location" id="location" type="text" className="regular-text" defaultValue={project?.location} placeholder="Kecamatan Serpong, Kota Tangerang Selatan" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Postbox>
              </div>
            </div>
          </div>
          <br className="clear" />
        </div>
      </WpForm>
    </div>
  );
}
