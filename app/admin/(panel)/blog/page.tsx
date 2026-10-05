import type { Metadata } from "next";
import Link from "next/link";
import DeleteButton from "@/components/admin/wp/DeleteButton";
import ListTable from "@/components/admin/wp/ListTable";
import RowToggle from "@/components/admin/wp/RowToggle";
import SearchBox from "@/components/admin/wp/SearchBox";
import { Notice } from "@/components/admin/wp/WpForm";
import { listDate } from "@/lib/admin-format";
import { requireAdmin } from "@/lib/admin";
import { deletePost } from "../../actions";

export const metadata: Metadata = { title: "Posts" };

type Props = { searchParams: Promise<{ post_status?: string; s?: string; deleted?: string }> };

const COLUMNS = [
  { id: "title", label: "Title", primary: true },
  { id: "author", label: "Author" },
  { id: "date", label: "Date" },
];

export default async function AdminPostsPage({ searchParams }: Props) {
  const { post_status: status, s: search, deleted } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data: all } = await supabase
    .from("posts")
    .select("id, slug, title, date, published")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  const posts = (all ?? []).filter(
    (post) =>
      (status === "publish" ? post.published : status === "draft" ? !post.published : true) &&
      (!search || post.title.toLowerCase().includes(search.toLowerCase())),
  );
  const counts = {
    all: all?.length ?? 0,
    publish: all?.filter((post) => post.published).length ?? 0,
    draft: all?.filter((post) => !post.published).length ?? 0,
  };
  const views = [
    { key: undefined, label: "All", count: counts.all },
    { key: "publish", label: "Published", count: counts.publish },
    { key: "draft", label: "Drafts", count: counts.draft },
  ].filter((view) => view.key === undefined || view.count > 0);

  return (
    <div className="wrap">
      <h1 className="wp-heading-inline">Posts</h1>
      <Link href="/admin/blog/new" className="page-title-action">
        Add New Post
      </Link>
      {search && (
        <span className="subtitle">
          Search results for: <strong>{search}</strong>
        </span>
      )}
      <hr className="wp-header-end" />

      {deleted && <Notice type="success">1 post permanently deleted.</Notice>}

      <h2 className="screen-reader-text">Filter posts list</h2>
      <ul className="subsubsub">
        {views.map((view, index) => (
          <li key={view.label} className={view.key ?? "all"}>
            <Link
              href={view.key ? `/admin/blog?post_status=${view.key}` : "/admin/blog"}
              className={status === view.key ? "current" : undefined}
              aria-current={status === view.key ? "page" : undefined}
            >
              {view.label} <span className="count">({view.count})</span>
            </Link>
            {index < views.length - 1 && " |"}
          </li>
        ))}
      </ul>

      <SearchBox id="post-search-input" label="Search Posts" value={search} hidden={{ post_status: status }} />

      <h2 className="screen-reader-text">Posts list</h2>
      <ListTable columns={COLUMNS} className="posts" itemCount={posts.length} empty="No posts found.">
        {posts.map((post) => (
          <tr key={post.id} id={`post-${post.id}`} className={`iedit author-self level-0 type-post status-${post.published ? "publish" : "draft"} hentry`}>
            <td className="title column-title has-row-actions column-primary page-title" data-colname="Title">
              <strong>
                <Link className="row-title" href={`/admin/blog/${post.id}`} aria-label={`“${post.title}” (Edit)`}>
                  {post.title}
                </Link>
                {!post.published && (
                  <>
                    {" "}
                    — <span className="post-state">Draft</span>
                  </>
                )}
              </strong>
              <div className="row-actions">
                <span className="edit">
                  <Link href={`/admin/blog/${post.id}`} aria-label={`Edit “${post.title}”`}>
                    Edit
                  </Link>{" "}
                  |{" "}
                </span>
                <span className="trash">
                  <DeleteButton action={deletePost} id={post.id} />{" "}
                  {post.published && "| "}
                </span>
                {post.published && (
                  <span className="view">
                    <a href={`/blog/${post.slug}`} rel="bookmark" target="_blank" aria-label={`View “${post.title}”`}>
                      View
                    </a>
                  </span>
                )}
              </div>
              <RowToggle />
            </td>
            <td className="author column-author" data-colname="Author">
              admin
            </td>
            <td className="date column-date" data-colname="Date">
              {post.published ? "Published" : "Last Modified"}
              <br />
              {listDate(post.date)}
            </td>
          </tr>
        ))}
      </ListTable>
      <div id="ajax-response" />
      <div className="clear" />
    </div>
  );
}
