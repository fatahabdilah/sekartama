"use client";

/** The mobile "Show more details" toggle on list-table rows. */
export default function RowToggle() {
  return (
    <button
      type="button"
      className="toggle-row"
      onClick={(event) => event.currentTarget.closest("tr")?.classList.toggle("is-expanded")}
    >
      <span className="screen-reader-text">Show more details</span>
    </button>
  );
}
