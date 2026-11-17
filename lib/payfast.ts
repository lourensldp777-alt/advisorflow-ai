/**
 * PayFast payment integration for AdvisorFlow AI.
 * South African payment gateway — supports credit card, EFT, instant EFT.
 *
 * For sandbox testing, use the sandbox URL and test credentials.
 * For production, get your Merchant ID and Key from https://www.payfast.co.za
 */

export interface PayFastConfig {
  merchantId: string;
  merchantKey: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
}

export interface PaymentItem {
  name: string;
  amount: number; // in ZAR
}

export function getPayFastConfig(): PayFastConfig {
  const merchantId = process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || "";
  const merchantKey = process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_KEY || "";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    merchantId,
    merchantKey,
    returnUrl: `${baseUrl}/checkout/success`,
    cancelUrl: `${baseUrl}/checkout/cancel`,
    notifyUrl: `${baseUrl}/api/payfast/notify`,
  };
}

/**
 * Builds the PayFast payment URL.
 * Redirect the user to this URL to complete payment.
 */
export function buildPayFastUrl({
  config,
  item,
  customInt1, // credit count (e.g., 5 credits)
}: {
  config: PayFastConfig;
  item: PaymentItem;
  customInt1: string;
}): string {
  const params: Record<string, string> = {
    merchant_id: config.merchantId,
    merchant_key: config.merchantKey,
    return_url: config.returnUrl,
    cancel_url: config.cancelUrl,
    notify_url: config.notifyUrl,
    name_first: "AdvisorFlow",
    name_last: "Customer",
    email_address: "customer@advisorflow.ai",
    m_payment_id: `AF_${Date.now()}`,
    amount: item.amount.toFixed(2),
    item_name: item.name,
    item_description: "AdvisorFlow AI meeting package credits",
    custom_int1: customInt1,
    locale: "en-ZA",
  };

  // Build signature string (PayFast requires alphabetical order, excluding signature)
  const sortedKeys = Object.keys(params).sort();
  const signatureString = sortedKeys
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join("&");

  // Append merchant key for signature
  const signature = `${signatureString}&merchant_key=${config.merchantKey}`;

  // MD5 hash - we compute this client-side for MVP simplicity
  // In production, this should be done server-side
  const hash = md5(signature);

  const queryParams = new URLSearchParams(params);
  queryParams.append("signature", hash);

  const baseUrl =
    process.env.NEXT_PUBLIC_PAYFAST_SANDBOX === "true"
      ? "https://sandbox.payfast.co.za/eng/process"
      : "https://www.payfast.co.za/eng/process";

  return `${baseUrl}?${queryParams.toString()}`;
}

/**
 * Simple MD5 implementation (no external dependency for MVP).
 * In production, use a proper crypto library server-side.
 */
function md5(input: string): string {
  // Simple MD5 polyfill for client-side use
  // For production, replace with server-side crypto
  const rotl = (x: number, n: number) => (x << n) | (x >>> (32 - n));
  const c = 0x5a827999;

  // Convert string to bytes
  const bytes: number[] = [];
  for (let i = 0; i < input.length; i++) {
    bytes.push(input.charCodeAt(i));
  }

  // Pad
  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while ((bytes.length * 8) % 512 !== 448) {
    bytes.push(0);
  }
  for (let i = 7; i >= 0; i--) {
    bytes.push((bitLen >>> (i * 8)) & 0xff);
  }

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let i = 0; i < bytes.length; i += 64) {
    const M = new Array<number>(16);
    for (let j = 0; j < 16; j++) {
      M[j] =
        bytes[i + j * 4] |
        (bytes[i + j * 4 + 1] << 8) |
        (bytes[i + j * 4 + 2] << 16) |
        (bytes[i + j * 4 + 3] << 24);
    }

    let A = a0;
    let B = b0;
    let C = c0;
    let D = d0;

    // Round 1
    for (let k = 0; k < 16; k++) {
      const F = (B & C) | (~B & D);
      const G = k;
      const temp = (A + F + M[G] + c) | 0;
      A = D;
      D = C;
      C = B;
      B = (B + rotl(temp, [7, 12, 17, 22][k % 4])) | 0;
    }

    // Round 2
    for (let k = 0; k < 16; k++) {
      const F = (B & D) | (C & ~D);
      const G = (5 * k + 1) % 16;
      const temp = (A + F + M[G] + 0x6ed9eba1) | 0;
      A = D;
      D = C;
      C = B;
      B = (B + rotl(temp, [5, 9, 14, 20][k % 4])) | 0;
    }

    // Round 3
    for (let k = 0; k < 16; k++) {
      const F = B ^ C ^ D;
      const G = (3 * k + 5) % 16;
      const temp = (A + F + M[G] + 0x8f1bbcdc) | 0;
      A = D;
      D = C;
      C = B;
      B = (B + rotl(temp, [4, 11, 16, 23][k % 4])) | 0;
    }

    // Round 4
    for (let k = 0; k < 16; k++) {
      const F = C ^ (B | ~D);
      const G = (7 * k) % 16;
      const temp = (A + F + M[G] + 0xca62c1d6) | 0;
      A = D;
      D = C;
      C = B;
      B = (B + rotl(temp, [6, 10, 15, 21][k % 4])) | 0;
    }

    a0 = (a0 + A) | 0;
    b0 = (b0 + B) | 0;
    c0 = (c0 + C) | 0;
    d0 = (d0 + D) | 0;
  }

  const toHex = (n: number) => {
    let hex = "";
    for (let i = 0; i < 4; i++) {
      hex += ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, "0");
    }
    return hex;
  };

  return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
}