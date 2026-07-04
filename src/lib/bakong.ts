import { BakongKHQR, khqrData, IndividualInfo, SourceInfo } from "bakong-khqr";

const BAKONG_TOKEN = process.env.BAKONG_TOKEN || "";
const BAKONG_MERCHANT_NAME = process.env.MERCHANT_NAME || "RESTLESS SOFTWARE";
const BAKONG_MERCHANT_CITY = process.env.MERCHANT_CITY || "Phnom Penh";
const BAKONG_ACCOUNT_ID = process.env.BAKONG_ACCOUNT_ID || "sokpheng_phoeurn@bkrt";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export interface KHQRResult {
  qrString: string;
  md5: string;
  deeplink: string;
  qrDataUrl: string;
}

export async function generateKHQR(options: {
  amount: number;
  currency: "USD" | "KHR";
  billNumber: string;
  productTitle: string;
}): Promise<KHQRResult> {
  const { amount, currency, billNumber } = options;

  const currencyCode = currency === "USD" ? khqrData.currency.usd : khqrData.currency.khr;

  // IndividualInfo constructor: (bakongAccountID, merchantName, merchantCity, optionalData)
  // Currency, amount, and other fields go inside optionalData
  const optionalData = {
    currency: currencyCode,
    amount,
    billNumber,
    mobileNumber: "85500000000",
    storeLabel: BAKONG_MERCHANT_NAME,
    terminalLabel: "Web",
    expirationTimestamp: Date.now() + 15 * 60 * 1000, // 15 min expiry
    merchantCategoryCode: "5999",
  };

  const individualInfo = new IndividualInfo(
    BAKONG_ACCOUNT_ID,
    BAKONG_MERCHANT_NAME,
    BAKONG_MERCHANT_CITY,
    optionalData
  );

  const khqr = new BakongKHQR();
  const response = khqr.generateIndividual(individualInfo);

  if (response.status.code !== 0 || !response.data?.qr) {
    throw new Error("Failed to generate KHQR: " + (response.status.message || "Unknown error"));
  }

  const qrString = response.data.qr;
  const md5 = response.data.md5;

  // Generate deeplink
  const sourceInfo = new SourceInfo(
    `${BASE_URL}/logo.png`,
    BAKONG_MERCHANT_NAME,
    `${BASE_URL}/checkout/success`
  );

  let deeplink = "";
  try {
    const deepLinkResponse = await BakongKHQR.generateDeepLink(
      "https://api-bakong.nbc.gov.kh/v1/generate_deeplink_by_qr",
      qrString,
      sourceInfo
    );
    if (deepLinkResponse.status.code === 0 && deepLinkResponse.data?.shortLink) {
      deeplink = deepLinkResponse.data.shortLink;
    }
  } catch {
    // Deeplink is optional
    console.warn("Failed to generate deeplink");
  }

  // Generate QR as data URL using the qrcode package
  const QRCode = await import("qrcode");
  const qrDataUrl = await QRCode.toDataURL(qrString, {
    width: 400,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  });

  return { qrString, md5: md5 || "", deeplink, qrDataUrl };
}

export async function checkPaymentStatus(md5: string): Promise<{
  paid: boolean;
  status: string;
  amount?: number;
  currency?: string;
}> {
  if (!BAKONG_TOKEN) {
    // Fallback: simulate payment check for demo
    return simulatePaymentCheck(md5);
  }

  try {
    const res = await fetch(
      `https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BAKONG_TOKEN}`,
        },
        body: JSON.stringify({ md5 }),
      }
    );

    const data = await res.json();

    if (data.responseCode === 0 && data.data) {
      return {
        paid: true,
        status: "PAID",
        amount: data.data.amount,
        currency: data.data.currency,
      };
    }

    return { paid: false, status: "UNPAID" };
  } catch (error) {
    console.error("Bakong API error:", error);
    return simulatePaymentCheck(md5);
  }
}

// Simulate payment for demo/development when no Bakong token is configured
async function simulatePaymentCheck(_md5: string): Promise<{
  paid: boolean;
  status: string;
  amount?: number;
  currency?: string;
}> {
  // Returns UNPAID by default — user can manually mark as paid via the API
  return { paid: false, status: "UNPAID" };
}

// Validate if a Bakong account exists
export async function checkBakongAccount(accountId: string): Promise<boolean> {
  try {
    const result = await BakongKHQR.checkBakongAccount(
      "https://api-bakong.nbc.gov.kh/v1/check_account_by_id",
      accountId
    );
    return result.bakongAccountExisted;
  } catch {
    return false;
  }
}
