import exportCsv from "@/utils/exportCsv";

// Columns for the product import file, in order. Only name, price and
// stock are required; the rest may be left empty.
export const PRODUCT_CSV_HEADERS = [
  "name",
  "price",
  "discountPrice",
  "stock",
  "lowStockThreshold",
  "category",
  "barcode",
  "description",
];

// Parse CSV text (RFC 4180): quoted fields may contain commas, quotes
// (doubled) and newlines; lines end with LF or CRLF. Returns
// { headers, rows, error } — headers are the lowercased, trimmed first
// line; each row maps header names to cell values and carries `row`,
// the physical line number where the row starts in the file (header is
// line 1), so errors can point at the row in the user's file. Fully
// blank lines are skipped, not reported.
export const parseCsv = (text) => {
  const records = [];
  let record = [];
  let field = "";
  let inQuotes = false;
  let fieldStarted = false;
  let lineNo = 1;
  let recordStartLine = 1;
  const pushField = () => {
    record.push(field);
    field = "";
    fieldStarted = false;
  };
  const pushRecord = () => {
    pushField();
    // A line with only empty cells is a blank line — skip it.
    if (record.some((cell) => cell.trim() !== "")) {
      records.push({ cells: record, line: recordStartLine });
    }
    record = [];
  };

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        if (char === "\n") lineNo++;
        field += char;
      }
    } else if (char === '"' && !fieldStarted && field === "") {
      inQuotes = true;
      fieldStarted = true;
    } else if (char === ",") {
      pushField();
    } else if (char === "\n") {
      pushRecord();
      lineNo++;
      recordStartLine = lineNo;
    } else if (char === "\r") {
      // CRLF: the \n that follows ends the line; a lone \r does too.
      if (text[i + 1] !== "\n") {
        pushRecord();
        lineNo++;
        recordStartLine = lineNo;
      }
    } else {
      field += char;
      fieldStarted = true;
    }
  }
  if (inQuotes) {
    return { headers: [], rows: [], error: "The file has an unclosed quote." };
  }
  // Last line without a trailing newline.
  if (field !== "" || fieldStarted || record.length > 0) pushRecord();
  if (records.length === 0) {
    return { headers: [], rows: [], error: "The file is empty." };
  }

  // Headers match case-insensitively, but known columns keep their
  // canonical spelling — the server reads `discountPrice` and
  // `lowStockThreshold`, not their lowercased forms.
  const CANONICAL_HEADERS = {
    discountprice: "discountPrice",
    lowstockthreshold: "lowStockThreshold",
  };
  const headers = records[0].cells.map((h) => {
    const key = h.trim().toLowerCase();
    return CANONICAL_HEADERS[key] || key;
  });
  const rows = records.slice(1).map(({ cells, line }) => {
    const row = { row: line };
    headers.forEach((header, j) => {
      row[header] = cells[j] ?? "";
    });
    return row;
  });
  return { headers, rows, error: null };
};

// The template file: the headers plus two example rows (one plain, one
// with a discount price and a barcode). Download via the shared CSV
// exporter so the format matches what the reports export.
export const downloadProductCsvTemplate = () => {
  exportCsv("product-import-template.csv", PRODUCT_CSV_HEADERS, [
    [
      "Wireless Headphones",
      "89",
      "",
      "32",
      "10",
      "Electronics",
      "WH-001",
      "Over-ear Bluetooth headphones",
    ],
    [
      "Cotton T-Shirt",
      "19",
      "15",
      "120",
      "",
      "Clothing",
      "",
      "Soft cotton tee",
    ],
  ]);
};
