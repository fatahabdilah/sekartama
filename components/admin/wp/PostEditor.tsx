import Link from "next/link";
import { deletePost, savePost } from "@/app/admin/actions";
import { longDateTime } from "@/lib/admin-format";
import ClassicEditor from "./ClassicEditor";
import FeaturedImage from "./FeaturedImage";
import PublishBox from "./PublishBox";
import TitleField from "./TitleField";
import WpForm from "./WpForm";

export type PostRecord = {
  id: string;
  slug: string;
  title: string;
  date: string;
  content: string;
  image_url: string;
  image_width: number;
  image_height: number;
  published: boolean;
  updated_at: string;
};

type Props = { post?: PostRecord; origin: string; message?: React.ReactNode };

/** post.php / post-new.php with the classic editor. */
export default function PostEditor({ post, origin, message }: Props) {
  return (
    <div className="wrap">
      <h1 className="wp-heading-inline">{post ? "Edit Post" : "Add New Post"}</h1>
      {post && (
        <Link href="/admin/blog/new" className="page-title-action">
          Add New Post
        </Link>
      )}
      <hr className="wp-header-end" />

      <WpForm action={savePost} name="post" id="post" initialMessage={message}>
        {post && <input type="hidden" name="id" value={post.id} />}
        <div id="poststuff">
          <div id="post-body" className="metabox-holder columns-2">
            <div id="post-body-content" style={{ position: "relative" }}>
              <TitleField defaultValue={post?.title} permalink={{ base: `${origin}/blog/`, slug: post?.slug ?? "" }} />
              <ClassicEditor
                name="content"
                defaultValue={post?.content}
                lastEdited={post ? `Last edited by admin on ${longDateTime(post.updated_at)}` : undefined}
              />
            </div>

            <div id="postbox-container-1" className="postbox-container">
              <div id="side-sortables" className="meta-box-sortables">
                <PublishBox
                  isNew={!post}
                  id={post?.id}
                  deleteAction={deletePost}
                  post={{
                    published: post?.published ?? false,
                    date: post?.date ?? "",
                    viewHref: post ? `/blog/${post.slug}` : undefined,
                  }}
                />
                <FeaturedImage
                  name="image_url"
                  folder="blog"
                  defaultValue={post?.image_url}
                  sizeNames={{ width: "image_width", height: "image_height" }}
                  defaultSize={post ? { width: post.image_width, height: post.image_height } : undefined}
                />
              </div>
            </div>

            <div id="postbox-container-2" className="postbox-container">
              <div id="normal-sortables" className="meta-box-sortables" />
            </div>
          </div>
          <br className="clear" />
        </div>
      </WpForm>
    </div>
  );
}
