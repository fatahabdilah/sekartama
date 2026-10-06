import type { Metadata } from "next";
import Link from "next/link";
import ChatStatusNotice from "@/components/admin/wp/ChatStatusNotice";
import Postbox from "@/components/admin/wp/Postbox";
import { activityDate, plural } from "@/lib/admin-format";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  const { supabase } = await requireAdmin();
  const count = async (table: string) => (await supabase.from(table).select("*", { count: "exact", head: true })).count ?? 0;
  const [posts, products, projects, recent, settings] = await Promise.all([
    count("posts"),
    count("products"),
    count("projects"),
    supabase.from("posts").select("id, title, date, slug").eq("published", true).order("date", { ascending: false }).limit(5),
    supabase.from("settings").select("key"),
  ]);
  const saved = new Set(settings.data?.map((row) => row.key));

  return (
    <div className="wrap">
      <h1>Dashboard</h1>
      <ChatStatusNotice supabase={supabase} />

      <div id="dashboard-widgets-wrap">
        <div id="dashboard-widgets" className="metabox-holder">
          <div id="postbox-container-1" className="postbox-container">
            <div id="normal-sortables" className="meta-box-sortables">
              <Postbox id="dashboard_right_now" title="At a Glance">
                <div className="main">
                  <ul>
                    <li className="post-count">
                      <Link href="/admin/blog">{plural(posts, "Post", "Posts")}</Link>
                    </li>
                    <li className="product-count">
                      <Link href="/admin/produk">{plural(products, "Product", "Products")}</Link>
                    </li>
                    <li className="project-count">
                      <Link href="/admin/proyek">{plural(projects, "Project", "Projects")}</Link>
                    </li>
                  </ul>
                  <p id="wp-version-message">
                    <span id="wp-version">Content is stored in Supabase and published to the site when you save.</span>
                  </p>
                </div>
              </Postbox>

              <Postbox id="dashboard_activity" title="Activity">
                <div id="activity-widget">
                  <div id="published-posts" className="activity-block">
                    <h3>Recently Published</h3>
                    {recent.data?.length ? (
                      <ul>
                        {recent.data.map((post) => (
                          <li key={post.id}>
                            <span>{activityDate(post.date)}</span> <Link href={`/admin/blog/${post.id}`}>{post.title}</Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No activity yet!</p>
                    )}
                  </div>
                </div>
              </Postbox>
            </div>
          </div>

          <div id="postbox-container-2" className="postbox-container">
            <div id="side-sortables" className="meta-box-sortables">
              <Postbox id="dashboard_site_settings" title="Site Settings">
                <ul>
                  <li>
                    <Link href="/admin/kontak">Contact</Link> — {saved.has("contact") ? "saved" : "using the built-in defaults"}
                  </li>
                  <li>
                    <Link href="/admin/chat">Chat AI</Link> — {saved.has("chat") ? "saved" : "using the built-in defaults"}
                  </li>
                </ul>
                {posts + products + projects === 0 && (
                  <div className="notice notice-warning inline">
                    <p>The database is empty. Run supabase/seed.sql in the Supabase SQL Editor to import the site content.</p>
                  </div>
                )}
              </Postbox>
            </div>
          </div>

          <div id="postbox-container-3" className="postbox-container">
            <div id="column3-sortables" className="meta-box-sortables empty-container" />
          </div>
          <div id="postbox-container-4" className="postbox-container">
            <div id="column4-sortables" className="meta-box-sortables empty-container" />
          </div>
        </div>
      </div>
    </div>
  );
}
