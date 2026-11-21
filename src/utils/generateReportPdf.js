import jsPDF from "jspdf";
import "jspdf-autotable";
import formatDate from "./formatDate";

// Generic one-table report PDF, styled like the invoice PDF
// (generateInvoicePDF.js): navy header band, striped table, footer with
// page numbers on every page. Used by the Reports page exports.
const BRAND = [44, 62, 80]; // #2c3e50
const BODY_TEXT = [51, 65, 85];
const MUTED_TEXT = [100, 116, 139];
const LIGHT_ROW = [248, 250, 252];
const LINE = [226, 232, 240];

const generateReportPdf = ({
  title,
  subtitle,
  shopName,
  headers,
  rows,
  filename,
  footer,
}) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 14;

  // --- Header band ---
  pdf.setFillColor(...BRAND);
  pdf.rect(0, 0, pageWidth, 34, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text(title, margin, 20);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.text(shopName || "StockSculpt", margin, 28);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(
    `Generated: ${formatDate(new Date())}`,
    pageWidth - margin,
    20,
    { align: "right" }
  );
  if (subtitle) {
    pdf.text(subtitle, pageWidth - margin, 28, { align: "right" });
  }

  // --- Table ---
  pdf.autoTable({
    startY: 44,
    head: [headers],
    body: rows.length
      ? rows
      : [headers.map((_, i) => (i === 0 ? "No data available" : ""))],
    theme: "striped",
    headStyles: {
      fillColor: BRAND,
      textColor: 255,
      fontStyle: "bold",
      fontSize: 10,
      cellPadding: 4,
    },
    bodyStyles: {
      fontSize: 10,
      cellPadding: 4,
      textColor: BODY_TEXT,
    },
    alternateRowStyles: { fillColor: LIGHT_ROW },
    margin: { left: margin, right: margin },
    tableLineColor: LINE,
    tableLineWidth: 0.1,
  });

  // --- Optional totals line under the table ---
  if (footer) {
    const finalY = pdf.autoTable.previous.finalY;
    pdf.setTextColor(...BRAND);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text(footer, pageWidth - margin, finalY + 12, { align: "right" });
  }

  // --- Footer on every page ---
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(...MUTED_TEXT);
    pdf.text(
      `Generated with stockSculpt  |  Page ${i} of ${pageCount}`,
      pageWidth / 2,
      290,
      { align: "center" }
    );
  }

  pdf.save(filename);
};

export default generateReportPdf;
