/**
 * Validation for the (demo) certificate checkout. Payments are not connected yet:
 * nothing here charges, stores or sends card details.
 */

export const digitsOnly = (value: string) => value.replace(/\D/g, "");

/** Luhn checksum used by all major card networks. */
export function isValidCardNumber(value: string): boolean {
  const digits = digitsOnly(value);
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

/** Groups digits in fours while typing: "4242424242424242" → "4242 4242 4242 4242". */
export function formatCardNumber(value: string): string {
  return digitsOnly(value).slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");
}

/** Accepts MM/YY for the current month or later. */
export function isValidExpiry(value: string, now: Date = new Date()): boolean {
  const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(value.trim());
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const current = now.getFullYear() * 12 + now.getMonth();
  return year * 12 + (month - 1) >= current;
}

/** Inserts the slash while typing: "1228" → "12/28". */
export function formatExpiry(value: string): string {
  const digits = digitsOnly(value).slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export function isValidCvc(value: string): boolean {
  return /^\d{3,4}$/.test(value.trim());
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
