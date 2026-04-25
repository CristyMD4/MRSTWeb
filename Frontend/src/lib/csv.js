export function downloadCsv(filename, rows) {
  const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const headers = Object.keys(rows[0] || {});
  const csv = [
    headers.map(escape).join(","),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
