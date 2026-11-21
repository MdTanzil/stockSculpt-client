import jsPDF from "jspdf";
import "jspdf-autotable";
import formatDate from "./formatDate";
import { effectivePrice, orderSavings } from "./productPrice";

const BRAND = [44, 62, 80]; // #2c3e50
const BODY_TEXT = [51, 65, 85];
const MUTED_TEXT = [100, 116, 139];
const LIGHT_ROW = [248, 250, 252];
const LINE = [226, 232, 240];

const formatMoney = (value) => `$${(Number(value) || 0).toFixed(2)}`;

const shortId = (id) => (id ? String(id).slice(-6).toUpperCase() : "—");

const capitalize = (value) => {
  const text = String(value || "pending");
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Builds the invoice document (shared by the download and print flows).
const buildInvoiceDoc = (order, shop) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 14;

  // --- Header band ---
  pdf.setFillColor(...BRAND);
  pdf.rect(0, 0, pageWidth, 34, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.text("INVOICE", margin, 20);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.text(shop?.name || "StockSculpt", margin, 28);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text(
    `Invoice #${shortId(order._id)}`,
    pageWidth - margin,
    20,
    { align: "right" }
  );
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(
    `Date: ${formatDate(order.createdAt)}`,
    pageWidth - margin,
    28,
    { align: "right" }
  );

  // --- Details: issued by (left) / order (right) ---
  let leftY = 44;
  pdf.setTextColor(...MUTED_TEXT);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.text("ISSUED BY", margin, leftY);
  pdf.setTextColor(...BODY_TEXT);
  pdf.setFontSize(11);
  pdf.text(shop?.name || "StockSculpt", margin, leftY + 7);
  if (shop?.location) {
    pdf.setTextColor(...MUTED_TEXT);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(shop.location, margin, leftY + 13);
  }

  pdf.setTextColor(...MUTED_TEXT);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.text("ORDER", pageWidth - margin, leftY, { align: "right" });
  pdf.setTextColor(...BODY_TEXT);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(`Order ID: ${order._id || "—"}`, pageWidth - margin, leftY + 7, {
    align: "right",
  });
  pdf.text(
    `Status: ${capitalize(order.orderStatus)}`,
    pageWidth - margin,
    leftY + 13,
    { align: "right" }
  );
  // Who prepared the order — only shown when the server recorded it
  // (orders created before the createdBy field existed have none).
  const preparedBy = order.createdBy?.name;
  if (preparedBy) {
    pdf.text(
      `Prepared by: ${preparedBy}`,
      pageWidth - margin,
      leftY + 19,
      { align: "right" }
    );
  }

  // --- Items table ---
  const items = order.products || [];
  const body =
    items.length > 0
      ? items.map((item) => [
          item.product?.name || "Unknown product",
          item.quantity,
          formatMoney(effectivePrice(item.product)),
          formatMoney(
            effectivePrice(item.product) * (Number(item.quantity) || 0)
          ),
        ])
      : [["No items in this order", "", "", ""]];

  const tableY = preparedBy ? 72 : shop?.location ? 66 : 60;
  pdf.autoTable({
    startY: tableY,
    head: [["Item", "Qty", "Unit Price", "Amount"]],
    body,
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
    columnStyles: {
      0: { halign: "left" },
      1: { halign: "center", cellWidth: 20 },
      2: { halign: "right", cellWidth: 32 },
      3: { halign: "right", cellWidth: 32 },
    },
    margin: { left: margin, right: margin },
    tableLineColor: LINE,
    tableLineWidth: 0.1,
  });

  // --- Total ---
  const finalY = pdf.autoTable.previous.finalY;
  pdf.setDrawColor(...LINE);
  pdf.setLineWidth(0.5);
  pdf.line(pageWidth - margin - 70, finalY + 6, pageWidth - margin, finalY + 6);
  pdf.setTextColor(...BRAND);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text(
    `Total: ${formatMoney(order.totalPrice)}`,
    pageWidth - margin,
    finalY + 14,
    { align: "right" }
  );
  // What the customer saved on discounted items (line prices are the
  // sale prices, so the total already reflects the discount).
  const savings = orderSavings(items);
  if (savings > 0) {
    pdf.setTextColor(22, 163, 74);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text(
      `You saved: ${formatMoney(savings)}`,
      pageWidth - margin,
      finalY + 22,
      { align: "right" }
    );
  }

  // --- Footer on every page ---
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(...MUTED_TEXT);
    pdf.text(
      "Thank you for your business!",
      pageWidth / 2,
      285,
      { align: "center" }
    );
    pdf.text(
      `Generated with stockSculpt  |  Page ${i} of ${pageCount}`,
      pageWidth / 2,
      290,
      { align: "center" }
    );
  }

  return pdf;
};

// Download the invoice as a PDF file.
const generateInvoicePDF = (order, shop) => {
  const pdf = buildInvoiceDoc(order, shop);
  pdf.save(`invoice-${shortId(order._id)}.pdf`);
};

// Open the invoice in a new tab so it can be printed from the browser's
// built-in PDF viewer (jsPDF cannot send a document to the printer
// directly).
export const openInvoicePDF = (order, shop) => {
  const pdf = buildInvoiceDoc(order, shop);
  window.open(pdf.output("bloburl"), "_blank");
};

export default generateInvoicePDF;
