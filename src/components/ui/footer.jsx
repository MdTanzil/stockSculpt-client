/* eslint-disable react/prop-types */

export function Footer() {
  return (
    <footer className="py-4 bg-[#445760] text-white">
      <p
        className="leading-6 text-center font-thin
      "
      >
        © {new Date().getFullYear()} StockSculpt | All rights reserved.
      </p>
    </footer>
  );
}
