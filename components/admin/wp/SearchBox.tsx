type Props = { id: string; label: string; value?: string; hidden?: Record<string, string | undefined> };

/** p.search-box: a GET form, like WordPress's list-table search. */
export default function SearchBox({ id, label, value, hidden = {} }: Props) {
  return (
    <form method="get">
      {Object.entries(hidden).map(([name, val]) => val && <input key={name} type="hidden" name={name} value={val} />)}
      <p className="search-box">
        <label className="screen-reader-text" htmlFor={id}>
          {label}:
        </label>
        <input type="search" id={id} name="s" defaultValue={value} />
        <input type="submit" id="search-submit" className="button" value={label} />
      </p>
    </form>
  );
}
