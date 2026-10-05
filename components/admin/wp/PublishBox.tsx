"use client";

import { useState } from "react";
import DeleteButton from "./DeleteButton";
import Postbox from "./Postbox";
import SubmitButton from "./SubmitButton";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type Props = {
  isNew: boolean;
  deleteAction?: (formData: FormData) => Promise<void>;
  id?: string;
  /** Posts get the full box: draft status, Save Draft, Preview, and the publish date. */
  post?: { published: boolean; date: string; viewHref?: string };
};

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

const today = () => new Date().toISOString().slice(0, 10);

export default function PublishBox({ isNew, deleteAction, id, post }: Props) {
  const wasPublished = post ? post.published && !isNew : true;
  const [status, setStatus] = useState<"publish" | "draft">(post && !post.published ? "draft" : "publish");
  const [pendingStatus, setPendingStatus] = useState(status);
  const [editingStatus, setEditingStatus] = useState(false);

  const [date, setDate] = useState(post?.date || today());
  const [dateTouched, setDateTouched] = useState(!isNew);
  const [editingDate, setEditingDate] = useState(false);
  const [mm, setMm] = useState(date.slice(5, 7));
  const [jj, setJj] = useState(date.slice(8, 10));
  const [aa, setAa] = useState(date.slice(0, 4));

  const primaryValue = wasPublished ? status : "publish";
  const primaryLabel = isNew || !wasPublished ? "Publish" : "Update";

  return (
    <Postbox id="submitdiv" title="Publish">
      <div className="submitbox" id="submitpost">
        <div id="minor-publishing">
          {post && (
            <div id="minor-publishing-actions">
              <div id="save-action">
                {!wasPublished && (
                  <SubmitButton name="post_status" formValue="draft" value="Save Draft" className="button" id="save-post" />
                )}
              </div>
              {post.viewHref && (
                <div id="preview-action">
                  <a className="preview button" href={post.viewHref} target="_blank" rel="noreferrer">
                    Preview<span className="screen-reader-text"> (opens in a new tab)</span>
                  </a>
                </div>
              )}
              <div className="clear" />
            </div>
          )}

          <div id="misc-publishing-actions">
            <div className="misc-pub-section misc-pub-post-status">
              Status: <span id="post-status-display">{status === "publish" ? "Published" : "Draft"}</span>{" "}
              {post && wasPublished && !editingStatus && (
                <a
                  href="#post_status"
                  className="edit-post-status hide-if-no-js"
                  role="button"
                  onClick={(event) => {
                    event.preventDefault();
                    setPendingStatus(status);
                    setEditingStatus(true);
                  }}
                >
                  <span aria-hidden="true">Edit</span> <span className="screen-reader-text">Edit status</span>
                </a>
              )}
              {editingStatus && (
                <div id="post-status-select">
                  <label htmlFor="post_status" className="screen-reader-text">
                    Set status
                  </label>
                  <select
                    id="post_status"
                    value={pendingStatus}
                    onChange={(event) => setPendingStatus(event.target.value as "publish" | "draft")}
                  >
                    <option value="publish">Published</option>
                    <option value="draft">Draft</option>
                  </select>{" "}
                  <a
                    href="#post_status"
                    className="save-post-status hide-if-no-js button"
                    onClick={(event) => {
                      event.preventDefault();
                      setStatus(pendingStatus);
                      setEditingStatus(false);
                    }}
                  >
                    OK
                  </a>{" "}
                  <a
                    href="#post_status"
                    className="cancel-post-status hide-if-no-js button-cancel"
                    onClick={(event) => {
                      event.preventDefault();
                      setEditingStatus(false);
                    }}
                  >
                    Cancel
                  </a>
                </div>
              )}
            </div>

            <div className="misc-pub-section misc-pub-visibility" id="visibility">
              Visibility: <span id="post-visibility-display">Public</span>
            </div>

            {post && (
              <div className="misc-pub-section curtime misc-pub-curtime">
                <span id="timestamp">
                  {dateTouched ? (
                    <>
                      {wasPublished ? "Published on: " : "Schedule for: "}
                      <b>{formatDate(date)}</b>
                    </>
                  ) : (
                    <>
                      Publish <b>immediately</b>
                    </>
                  )}
                </span>{" "}
                {!editingDate && (
                  <a
                    href="#edit_timestamp"
                    className="edit-timestamp hide-if-no-js"
                    role="button"
                    onClick={(event) => {
                      event.preventDefault();
                      setEditingDate(true);
                    }}
                  >
                    <span aria-hidden="true">Edit</span> <span className="screen-reader-text">Edit date and time</span>
                  </a>
                )}
                {editingDate && (
                  <fieldset id="timestampdiv">
                    <legend className="screen-reader-text">Date and time</legend>
                    <div className="timestamp-wrap">
                      <label>
                        <span className="screen-reader-text">Month</span>
                        <select className="form-required" id="mm" value={mm} onChange={(e) => setMm(e.target.value)}>
                          {MONTHS.map((name, index) => {
                            const value = String(index + 1).padStart(2, "0");
                            return (
                              <option key={value} value={value}>
                                {value}-{name}
                              </option>
                            );
                          })}
                        </select>
                      </label>{" "}
                      <label>
                        <span className="screen-reader-text">Day</span>
                        <input type="text" id="jj" value={jj} onChange={(e) => setJj(e.target.value)} size={2} maxLength={2} autoComplete="off" className="form-required" />
                      </label>
                      ,{" "}
                      <label>
                        <span className="screen-reader-text">Year</span>
                        <input type="text" id="aa" value={aa} onChange={(e) => setAa(e.target.value)} size={4} maxLength={4} autoComplete="off" className="form-required" />
                      </label>
                    </div>
                    <p>
                      <a
                        href="#edit_timestamp"
                        className="save-timestamp hide-if-no-js button"
                        onClick={(event) => {
                          event.preventDefault();
                          const candidate = `${aa.padStart(4, "0")}-${mm}-${jj.padStart(2, "0")}`;
                          if (!Number.isNaN(Date.parse(candidate))) {
                            setDate(candidate);
                            setDateTouched(true);
                          }
                          setEditingDate(false);
                        }}
                      >
                        OK
                      </a>{" "}
                      <a
                        href="#edit_timestamp"
                        className="cancel-timestamp hide-if-no-js button-cancel"
                        onClick={(event) => {
                          event.preventDefault();
                          setEditingDate(false);
                        }}
                      >
                        Cancel
                      </a>
                    </p>
                  </fieldset>
                )}
                <input type="hidden" name="post_date" value={dateTouched ? date : today()} />
              </div>
            )}
          </div>
          <div className="clear" />
        </div>

        <div id="major-publishing-actions">
          <div id="delete-action">
            {!isNew && deleteAction && id && <DeleteButton action={deleteAction} id={id} inForm className="submitdelete deletion" />}
          </div>
          <div id="publishing-action">
            <SubmitButton
              spinner
              name="post_status"
              formValue={primaryValue}
              value={primaryLabel}
              className="button button-primary button-large"
              id="publish"
            />
          </div>
          <div className="clear" />
        </div>
      </div>
    </Postbox>
  );
}
