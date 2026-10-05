"use client";

import { useState } from "react";

type Props = {
  defaultValue?: string;
  placeholder?: string;
  /** Shows the permalink row under the title (posts only). */
  permalink?: { base: string; slug: string };
};

/** #titlediv: the big title input with its placeholder label and, for posts, the editable permalink. */
export default function TitleField({ defaultValue = "", placeholder = "Add title", permalink }: Props) {
  const [title, setTitle] = useState(defaultValue);
  const [slug, setSlug] = useState(permalink?.slug ?? "");
  const [draftSlug, setDraftSlug] = useState(slug);
  const [editing, setEditing] = useState(false);

  return (
    <div id="titlediv">
      <div id="titlewrap">
        <label className={title ? "screen-reader-text" : undefined} id="title-prompt-text" htmlFor="title">
          {placeholder}
        </label>
        <input
          type="text"
          name="post_title"
          size={30}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          id="title"
          spellCheck
          autoComplete="off"
        />
      </div>
      {permalink && (
        <div className="inside">
          <div id="edit-slug-box" className="hide-if-no-js">
            <strong>Permalink:</strong>{" "}
            {editing ? (
              <>
                <span id="sample-permalink">
                  {permalink.base}
                  <span id="editable-post-name">
                    <input
                      type="text"
                      id="new-post-slug"
                      value={draftSlug}
                      autoComplete="off"
                      onChange={(event) => setDraftSlug(event.target.value)}
                      autoFocus
                    />
                  </span>
                  /
                </span>{" "}
                <span id="edit-slug-buttons">
                  <button
                    type="button"
                    className="save button button-small"
                    onClick={() => {
                      setSlug(draftSlug.trim());
                      setEditing(false);
                    }}
                  >
                    OK
                  </button>{" "}
                  <button type="button" className="cancel button-link" onClick={() => setEditing(false)}>
                    Cancel
                  </button>
                </span>
              </>
            ) : (
              <>
                <span id="sample-permalink">
                  {slug ? (
                    <a href={`${permalink.base}${slug}`} target="_blank" rel="noreferrer">
                      {permalink.base}
                      <span id="editable-post-name">{slug}</span>/
                    </a>
                  ) : (
                    <>
                      {permalink.base}
                      <span id="editable-post-name">(generated from the title)</span>
                    </>
                  )}
                </span>
                &lrm;{" "}
                <span id="edit-slug-buttons">
                  <button
                    type="button"
                    className="edit-slug button button-small hide-if-no-js"
                    aria-label="Edit permalink"
                    onClick={() => {
                      setDraftSlug(slug);
                      setEditing(true);
                    }}
                  >
                    Edit
                  </button>
                </span>
              </>
            )}
          </div>
          <input type="hidden" name="post_name" value={slug} />
        </div>
      )}
    </div>
  );
}
