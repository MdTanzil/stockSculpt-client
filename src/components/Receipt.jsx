/* eslint-disable react/prop-types */
// Thermal-style receipt, like a supershop prints: narrow (300px on
// screen, about 80mm on paper), plain black on white, monospace. Shown
// as a preview after a POS sale and printed with window.print() — the
// @media print rules in index.css hide everything except this element.
// Inline styles only, so the receipt looks the same on screen, in
// print, and in dark mode.
import formatDate from "@/utils/formatDate";
import { effectivePrice, orderSavings } from "@/utils/productPrice";

const formatMoney = (value) => `$${(Number(value) || 0).toFixed(2)}`;

const shortId = (id) => (id ? String(id).slice(-6).toUpperCase() : "—");

const capitalize = (value) => {
  const text = String(value || "");
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
};

const divider = { borderTop: "1px dashed #000", margin: "8px 0" };

const Receipt = ({ order, shop }) => {
  const items = order?.products || [];
  const preparedBy = order?.createdBy?.name;
  // What the customer saved on discounted items (0 when nothing was
  // on sale). Computed from the products' current prices, like the
  // line amounts.
  const savings = orderSavings(items);

  return (
    <div
      id="receipt-print"
      className="receipt-print-area"
      style={{
        width: 300,
        margin: "0 auto",
        padding: "16px 12px",
        backgroundColor: "#fff",
        color: "#000",
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 13,
        lineHeight: 1.5,
        textAlign: "left",
      }}
    >
      <div style={{ textAlign: "center", fontWeight: 700, fontSize: 17 }}>
        {shop?.name || "StockSculpt"}
      </div>
      {shop?.location && (
        <div style={{ textAlign: "center" }}>{shop.location}</div>
      )}
      <div style={divider} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Order #{shortId(order?._id)}</span>
        <span>{formatDate(order?.createdAt)}</span>
      </div>
      {preparedBy && <div>Prepared by: {preparedBy}</div>}
      <div style={divider} />
      {items.map((item, index) => (
        <div key={index} style={{ marginBottom: 4 }}>
          <div>{item.product?.name || "Unknown product"}</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>
              {item.quantity} x {formatMoney(effectivePrice(item.product))}
            </span>
            <span>
              {formatMoney(
                effectivePrice(item.product) * (Number(item.quantity) || 0)
              )}
            </span>
          </div>
        </div>
      ))}
      <div style={divider} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: 700,
          fontSize: 15,
        }}
      >
        <span>TOTAL</span>
        <span>{formatMoney(order?.totalPrice)}</span>
      </div>
      {savings > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 700,
          }}
        >
          <span>You saved</span>
          <span>{formatMoney(savings)}</span>
        </div>
      )}
      {order?.paymentMethod && (
        <div>Payment: {capitalize(order.paymentMethod)}</div>
      )}
      <div style={divider} />
      <div style={{ textAlign: "center" }}>
        Thank you for shopping with us!
      </div>
    </div>
  );
};

export default Receipt;
