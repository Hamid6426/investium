export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  // Ensure the phone number starts with +92 and is followed by 9 digits
  return /^\+92\d{10}$/.test(phone);
}

export function normalizePhone(phone: string): string {
  // Trim the phone number to remove any extra spaces
  let normalized = phone.trim();

  // If the number starts with '0', remove the leading '0' and add the country code +92
  if (normalized.startsWith("0")) {
    normalized = normalized.slice(1); // Remove the leading '0'
  }

  // Add the Pakistan country code +92
  return `+92${normalized}`;
}

export function randomString(n: number) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + n);
}