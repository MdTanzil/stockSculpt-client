// Subscription date helpers for the UI. Mirrors the server's rules
// (utils/subscriptionExpiry.js) — keep GRACE_DAYS in sync with it.

// Extra days a shop keeps its paid plan after the end date, to pay
// before the subscription is cancelled automatically.
export const GRACE_DAYS = 5;

export const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

// Same month math as the server (setMonth), so an end date previewed
// in the admin dialog is exactly the date that gets stored.
export const addMonths = (date, months) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
};

export const graceEndDate = (endDate) => addDays(endDate, GRACE_DAYS);

// True while a paid plan is past its end date but inside the grace
// period. Past the grace period the server cancels the subscription on
// the next shop read, so the client never sees that state.
export const isInGrace = (shop, now = new Date()) => {
  if (!shop || shop.subscriptionPlan !== "premium") return false;
  if (!shop.subscriptionEndDate) return false;
  const end = new Date(shop.subscriptionEndDate);
  if (Number.isNaN(end.getTime())) return false;
  return now > end && now <= graceEndDate(end);
};
