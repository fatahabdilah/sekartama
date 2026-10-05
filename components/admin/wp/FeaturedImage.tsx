"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { uploadImage } from "../upload";
import Postbox from "./Postbox";

type Props = {
  name: string;
  folder: string;
  title?: string;
  defaultValue?: string;
  /** When set, the image's pixel size is submitted under these field names. */
  sizeNames?: { width: string; height: string };
  defaultSize?: { width: number; height: number };
};

/** The "Featured image" meta box. Uploads go straight to the Supabase media bucket. */
export default function FeaturedImage({ name, folder, title = "Featured image", defaultValue = "", sizeNames, defaultSize }: Props) {
  const [url, setUrl] = useState(defaultValue);
  const [size, setSize] = useState(defaultSize ?? { width: 1200, height: 800 });
  const [status, setStatus] = useState<{ uploading?: boolean; error?: string }>({});
  const fileInput = useRef<HTMLInputElement>(null);

  function choose(event: React.MouseEvent) {
    event.preventDefault();
    fileInput.current?.click();
  }

  async function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setStatus({ uploading: true });
    try {
      const uploaded = await uploadImage(file, folder);
      setUrl(uploaded.url);
      setSize({ width: uploaded.width, height: uploaded.height });
      setStatus({});
    } catch (error) {
      setStatus({ error: error instanceof Error ? error.message : "The image could not be uploaded." });
    }
  }

  return (
    <Postbox id="postimagediv" title={title}>
      {url ? (
        <>
          <p className="hide-if-no-js">
            <a href="#" id="set-post-thumbnail" aria-describedby="set-post-thumbnail-desc" onClick={choose}>
              <img width={266} src={url} className="attachment-266x266 size-266x266" alt="" style={{ height: "auto" }} />
            </a>
          </p>
          <p className="hide-if-no-js howto" id="set-post-thumbnail-desc">
            Click the image to edit or update
          </p>
          <p className="hide-if-no-js">
            <a
              href="#"
              id="remove-post-thumbnail"
              onClick={(event) => {
                event.preventDefault();
                setUrl("");
              }}
            >
              Remove {title.toLowerCase()}
            </a>
          </p>
        </>
      ) : (
        <p className="hide-if-no-js">
          <a href="#" id="set-post-thumbnail" onClick={choose}>
            Set {title.toLowerCase()}
          </a>
        </p>
      )}
      {status.uploading && (
        <p>
          <span className="spinner is-active" style={{ float: "none", margin: "0 6px 0 0" }} />
          Uploading…
        </p>
      )}
      {status.error && (
        <div className="notice notice-error inline">
          <p>{status.error}</p>
        </div>
      )}
      <input ref={fileInput} type="file" accept="image/*" hidden onChange={onFile} />
      <input type="hidden" name={name} value={url} />
      {sizeNames && (
        <>
          <input type="hidden" name={sizeNames.width} value={size.width} />
          <input type="hidden" name={sizeNames.height} value={size.height} />
        </>
      )}
    </Postbox>
  );
}
