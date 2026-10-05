"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { uploadImage } from "../upload";
import Postbox from "./Postbox";

type Props = { name: string; folder: string; defaultValue?: string[] };

/** "Product gallery" meta box: ordered images, the first one is the cover. */
export default function GalleryBox({ name, folder, defaultValue = [] }: Props) {
  const [urls, setUrls] = useState(defaultValue);
  const [status, setStatus] = useState<{ uploading?: boolean; error?: string }>({});
  const fileInput = useRef<HTMLInputElement>(null);

  async function onFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;
    setStatus({ uploading: true });
    try {
      for (const file of files) {
        const { url } = await uploadImage(file, folder);
        setUrls((prev) => [...prev, url]);
      }
      setStatus({});
    } catch (error) {
      setStatus({ error: error instanceof Error ? error.message : "The image could not be uploaded." });
    }
  }

  function move(index: number, delta: number) {
    setUrls((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(index + delta, 0, item);
      return next;
    });
  }

  return (
    <Postbox id="product_images_container" title="Product gallery">
      <ul className="sekar-gallery">
        {urls.map((url, index) => (
          <li key={`${url}-${index}`}>
            <img src={url} alt="" />
            <input type="hidden" name={name} value={url} />
            <div className="gallery-actions">
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move left">
                ←
              </button>
              <button
                type="button"
                className="remove"
                onClick={() => setUrls((prev) => prev.filter((_, i) => i !== index))}
                aria-label="Remove image"
              >
                Delete
              </button>
              <button type="button" onClick={() => move(index, 1)} disabled={index === urls.length - 1} aria-label="Move right">
                →
              </button>
            </div>
          </li>
        ))}
      </ul>
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
      <p className="add_product_images hide-if-no-js">
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            fileInput.current?.click();
          }}
        >
          Add product gallery images
        </a>
      </p>
      <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={onFiles} />
    </Postbox>
  );
}
