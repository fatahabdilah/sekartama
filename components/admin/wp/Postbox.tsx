"use client";

import { useState } from "react";

type Props = { id: string; title: string; children: React.ReactNode };

/** A meta box with WordPress's collapse toggle (.postbox / .closed). */
export default function Postbox({ id, title, children }: Props) {
  const [closed, setClosed] = useState(false);
  return (
    <div id={id} className={`postbox${closed ? " closed" : ""}`}>
      <div className="postbox-header">
        <h2 className="hndle">{title}</h2>
        <div className="handle-actions hide-if-no-js">
          <button
            type="button"
            className="handlediv"
            aria-expanded={!closed}
            onClick={() => setClosed((value) => !value)}
          >
            <span className="screen-reader-text">Toggle panel: {title}</span>
            <span className="toggle-indicator" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="inside">{children}</div>
    </div>
  );
}
