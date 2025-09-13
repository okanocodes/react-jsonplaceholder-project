// components/ui/Table.tsx
import React, { useMemo, useState } from "react";

export type SortDirection = "asc" | "desc" | null;
type Primitive = string | number | boolean | null | undefined;

interface TableProps<Row extends object> {
  headers: (keyof Row)[];
  rows: Row[];
  /**
   * Use renderCell when you need custom formatting per cell.
   */
  renderCell?: (
    value: Row[keyof Row],
    row: Row,
    header: keyof Row,
    rowIdx: number,
    cellIdx: number
  ) => React.ReactNode;

  getRowValue?: (row: Row, header: keyof Row) => Primitive;

  actions?: (row: Row, rowIdx: number) => React.ReactNode;

  rowIdKey?: keyof Row;
  rowIdPrefix?: string;

  initialSort?: { header: keyof Row; dir: Exclude<SortDirection, null> };
}

function Table<Row extends object>({
  headers,
  rows,
  renderCell,
  getRowValue,
  actions,
  rowIdKey = "id" as keyof Row,
  rowIdPrefix,
  initialSort,
}: TableProps<Row>) {
  const [sortHeader, setSortHeader] = useState<keyof Row | null>(
    initialSort?.header ?? null
  );
  const [sortDir, setSortDir] = useState<SortDirection>(
    initialSort?.dir ?? null
  );

  const toggleSort = (h: keyof Row) => {
    if (sortHeader !== h) {
      setSortHeader(h);
      setSortDir("asc");
      return;
    }
    if (sortDir === "asc") setSortDir("desc");
    else if (sortDir === "desc") {
      setSortHeader(null);
      setSortDir(null);
    } else setSortDir("asc");
  };

  const sortedRows = useMemo(() => {
    if (!sortHeader || !sortDir) return rows;

    const copy = [...rows];

    const toSortable = (row: Row): Primitive => {
      if (getRowValue) return getRowValue(row, sortHeader);
      return row[sortHeader] as unknown as Primitive;
    };

    const compareValues = (a: Primitive, b: Primitive): number => {
      if (a == null && b == null) return 0;
      if (a == null) return sortDir === "asc" ? 1 : -1;
      if (b == null) return sortDir === "asc" ? -1 : 1;

      if (typeof a === "number" && typeof b === "number") {
        return sortDir === "asc" ? a - b : b - a;
      }

      const sa = String(a).toLowerCase();
      const sb = String(b).toLowerCase();
      if (sa < sb) return sortDir === "asc" ? -1 : 1;
      if (sa > sb) return sortDir === "asc" ? 1 : -1;
      return 0;
    };

    copy.sort((rowA, rowB) =>
      compareValues(toSortable(rowA), toSortable(rowB))
    );

    return copy;
  }, [rows, sortHeader, sortDir, getRowValue]);

  return (
    <div className="h-[calc(100vh-200px)] overflow-auto rounded-box border border-base-content/5 bg-base-100">
      <table className="table table-pin-rows w-full">
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={String(header)}
                onClick={() => toggleSort(header)}
                className="cursor-pointer select-none"
                title="Click to sort (cycles asc/desc/none)"
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span>{String(header)}</span>
                  {sortHeader === header && sortDir && (
                    <span style={{ fontSize: 12 }}>
                      {sortDir === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
            ))}

            {actions && <th className="flex justify-end">Actions</th>}
          </tr>
        </thead>

        <tbody>
          {sortedRows.map((row, rowIdx) => {
            // use typed key access if provided
            const rawId = rowIdKey ? row[rowIdKey] : undefined;
            const rowIdValue =
              typeof rawId === "string" || typeof rawId === "number"
                ? rawId
                : rowIdx;
            const trId = rowIdPrefix
              ? `${rowIdPrefix}-${rowIdValue}`
              : undefined;
            const trKey = typeof rowIdValue === "number" ? rowIdValue : rowIdx;

            return (
              <tr key={trKey} id={trId} className="hover:bg-base-300">
                {headers.map((header, cellIdx) => {
                  const raw = row[header];
                  const content = renderCell
                    ? renderCell(raw, row, header, rowIdx, cellIdx)
                    : String((raw as unknown) ?? "");
                  return <td key={cellIdx}>{content}</td>;
                })}

                {actions && (
                  <td className="flex justify-end">{actions(row, rowIdx)}</td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
