// The price a customer actually pays: the discount price when one is
// set and below the regular price, otherwise the regular price. The
// server has the same rule in utils/effectivePrice.js — keep them
// in sync.
export const effectivePrice = (product) => {
  const price = Number(product?.price) || 0;
  const discount = Number(product?.discountPrice);
  if (Number.isFinite(discount) && discount >= 0 && discount < price) {
    return discount;
  }
  return price;
};

export const hasDiscount = (product) =>
  effectivePrice(product) < (Number(product?.price) || 0);

// How much a customer saves on one unit of this product (0 when there
// is no discount).
export const unitSavings = (product) =>
  Math.max(0, (Number(product?.price) || 0) - effectivePrice(product));

// Total savings across order/cart lines shaped { product, quantity }.
export const orderSavings = (lines) =>
  (lines || []).reduce(
    (sum, line) =>
      sum + unitSavings(line.product) * (Number(line.quantity) || 0),
    0
  );
