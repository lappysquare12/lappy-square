/**
 * Helper to mask prices per client requirement:
 * "Price show nahi karni hai aapn ko ek digit dikhna hai
 *  Like 15000 ka hai to Aage pcihe xx lag jaaye aaisa kuch"
 * E.g.:
 *  15000 -> ₹1X,XXX
 *  45999 -> ₹4X,XXX
 *  9999  -> ₹9,XXX
 *  125000 -> ₹1,XX,XXX
 */
export function formatMaskedPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || isNaN(price)) {
    return '₹XX,XXX';
  }

  const rounded = Math.round(price);
  const str = rounded.toString();

  if (str.length <= 1) {
    return `₹${str}X`;
  }

  // First digit visible, rest replaced with 'X'
  const firstDigit = str[0];
  const maskedRest = 'X'.repeat(str.length - 1);
  const rawMasked = firstDigit + maskedRest;

  return formatIndianMasked(rawMasked);
}

function formatIndianMasked(s: string): string {
  if (s.length <= 3) return `₹${s}`;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  // Group rest by pairs of 2 from the right
  const formattedRest = rest.replace(/\B(?=([0-9X]{2})+(?![0-9X]))/g, ',');
  return `₹${formattedRest},${last3}`;
}
