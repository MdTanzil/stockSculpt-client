// Low-stock rule, mirroring utils/lowStock.js on the server: a product
// is low on stock when its stock is at or below its own threshold, or
// 5 when it has none set.
export const DEFAULT_LOW_STOCK_THRESHOLD = 5;

export const lowStockThreshold = (product) =>
  product?.lowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD;

export const isLowStock = (product) =>
  Number(product?.stock) <= lowStockThreshold(product);
