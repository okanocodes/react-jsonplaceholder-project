import React, { useMemo, useState } from "react";

export type SortDirection = "asc" | "desc" | null;

interface TableProps<T extends object> {
  headers: (keyof T)[];
  rows: T[];
  /**
   * If provided, used to render a specific cell. Fully typed.
   */
  getCellValue?: (
    row: T,
    header: keyof T,
    rowIdx: number,
    cellIdx: number
  ) => React.ReactNode;

  /**
   * Optional function to compute a sortable value for a given row/header.
   * If omitted, table will use row[header] (stringified) for sorting.
   */
  getRowValue?: (row: T, header: keyof T) => unknown;

  renderCell?: (
    row: T,
    header: keyof T,
    rowIdx: number,
    cellIdx: number
  ) => React.ReactNode; // kept for backward compat (calls before fallback)

  actions?: (row: T, rowIdx: number) => React.ReactNode;

  /**
   * Optional prefix used for the row id attribute: `${rowIdPrefix}-${row.id}`.
   * If row has no `id` property, falls back to `rowIdx+1`.
   */
  rowIdPrefix?: string;
}

function Table<T extends object>({
  headers,
  rows,
  renderCell,
  actions,
  getRowValue,
  getCellValue,
  rowIdPrefix,
}: TableProps<T>) {
  const [sortHeader, setSortHeader] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);

  const toggleSort = (h: keyof T) => {
    if (sortHeader !== h) {
      setSortHeader(h);
      setSortDir("asc");
      return;
    }
    // same header: cycle asc -> desc -> none
    if (sortDir === "asc") setSortDir("desc");
    else if (sortDir === "desc") {
      setSortHeader(null);
      setSortDir(null);
    } else setSortDir("asc");
  };

  const sortedRows = useMemo(() => {
    if (!sortHeader || !sortDir) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const aRec = a as unknown as Record<string, unknown>;
      const bRec = b as unknown as Record<string, unknown>;

      const avRaw = getRowValue
        ? getRowValue(a, sortHeader)
        : aRec[String(sortHeader)];
      const bvRaw = getRowValue
        ? getRowValue(b, sortHeader)
        : bRec[String(sortHeader)];

      const av = avRaw as unknown;
      const bv = bvRaw as unknown;

      if (av == null && bv == null) return 0;
      if (av == null) return sortDir === "asc" ? 1 : -1;
      if (bv == null) return sortDir === "asc" ? -1 : 1;

      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }

      const sa = String(av).toLowerCase();
      const sb = String(bv).toLowerCase();
      if (sa < sb) return sortDir === "asc" ? -1 : 1;
      if (sa > sb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [rows, sortHeader, sortDir, getRowValue]);

  return (
    <div className="h-[calc(100vh-200px)] overflow-auto rounded-box border border-base-content/5 bg-base-100">
      <table className="table table-pin-rows">
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
            const rowRecord = row as unknown as Record<string, unknown>;
            const rawId = rowRecord["id"];
            const rowIdValue =
              typeof rawId === "number" || typeof rawId === "string"
                ? rawId
                : rowIdx + 1;

            const trId = rowIdPrefix
              ? `${rowIdPrefix}-${rowIdValue}`
              : undefined;
            const trKey = typeof rowIdValue === "number" ? rowIdValue : rowIdx;

            return (
              <tr key={trKey} className="hover:bg-base-300" id={trId}>
                {headers.map((header, cellIdx) => {
                  // Priority: getCellValue -> renderCell (compat) -> fallback (safe index)
                  const content = getCellValue
                    ? getCellValue(row, header, rowIdx, cellIdx)
                    : renderCell
                      ? renderCell(row, header, rowIdx, cellIdx)
                      : String(
                          (row as unknown as Record<string, unknown>)[
                            String(header)
                          ] ?? ""
                        );

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
