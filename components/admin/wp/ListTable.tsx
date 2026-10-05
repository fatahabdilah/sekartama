type Column = { id: string; label: string; primary?: boolean; className?: string };

type Props = {
  columns: Column[];
  className: string;
  itemCount: number;
  /** Rows (<tr>) — each needs a cell per column. */
  children: React.ReactNode;
  empty: string;
};

function Head({ columns }: { columns: Column[] }) {
  return (
    <tr>
      {columns.map((column) => (
        <th
          key={column.id}
          scope="col"
          id={column.id}
          className={`manage-column column-${column.id}${column.primary ? " column-primary" : ""}${column.className ? ` ${column.className}` : ""}`}
        >
          {column.label}
        </th>
      ))}
    </tr>
  );
}

function Nav({ position, itemCount }: { position: "top" | "bottom"; itemCount: number }) {
  return (
    <div className={`tablenav ${position}`}>
      <div className="tablenav-pages one-page">
        <span className="displaying-num">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>
      <br className="clear" />
    </div>
  );
}

/** WP_List_Table markup: tablenav, striped widefat table, repeated header in tfoot. */
export default function ListTable({ columns, className, itemCount, children, empty }: Props) {
  return (
    <>
      <Nav position="top" itemCount={itemCount} />
      <table className={`wp-list-table widefat fixed striped table-view-list ${className}`}>
        <thead>
          <Head columns={columns} />
        </thead>
        <tbody id="the-list">
          {itemCount === 0 ? (
            <tr className="no-items">
              <td className="colspanchange" colSpan={columns.length}>
                {empty}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
        <tfoot>
          <Head columns={columns} />
        </tfoot>
      </table>
      <Nav position="bottom" itemCount={itemCount} />
    </>
  );
}
