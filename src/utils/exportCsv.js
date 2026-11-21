// Build a CSV file from headers + rows and trigger a browser download.
// Cells containing a comma, quote or newline are quoted (RFC 4180).
const escapeCell = (value) => {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
};

const exportCsv = (filename, headers, rows) => {
  const lines = [headers, ...rows].map((row) =>
    row.map(escapeCell).join(",")
  );
  const blob = new Blob([lines.join("\r\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export default exportCsv;
