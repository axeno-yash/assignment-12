export function roundMoney(value) {
  return Math.round(Number(value) || 0);
}

export function formatMoney(value) {
  return String(roundMoney(value));
}
