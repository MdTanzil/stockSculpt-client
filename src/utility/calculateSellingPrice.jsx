

const calculateSellingPrice = (buyingPrice, taxRate, profitPercentage) => {
  const taxAmount = buyingPrice * (taxRate / 100);

  const profitAmount = buyingPrice * (profitPercentage / 100);

  const sellingPrice = buyingPrice + taxAmount + profitAmount;

  return sellingPrice;
};

export default calculateSellingPrice;
