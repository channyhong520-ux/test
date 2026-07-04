declare module "bakong-khqr" {
  interface KHQRCurrency {
    usd: number;
    khr: number;
  }

  export const khqrData: {
    currency: KHQRCurrency;
  };

  export class IndividualInfo {
    constructor(
      bakongAccountID: string,
      merchantName: string,
      merchantCity: string,
      optionalData?: {
        currency?: number;
        amount?: number;
        billNumber?: string;
        mobileNumber?: string;
        storeLabel?: string;
        terminalLabel?: string;
        expirationTimestamp?: number;
        merchantCategoryCode?: string;
        accountInformation?: string;
        acquiringBank?: string;
        purposeOfTransaction?: string;
        languagePreference?: string;
        merchantNameAlternateLanguage?: string;
        merchantCityAlternateLanguage?: string;
        upiMerchantAccount?: string;
      }
    );
  }

  export class SourceInfo {
    constructor(appIconUrl: string, appName: string, appDeepLinkCallback: string);
  }

  export interface KHQRResponse {
    status: {
      code: number;
      errorCode: number | null;
      message: string | null;
    };
    data: {
      qr?: string;
      md5?: string;
      shortLink?: string;
    } | null;
  }

  export class BakongKHQR {
    generateIndividual(individualInfo: IndividualInfo): KHQRResponse;
    generateMerchant(merchantInfo: IndividualInfo): KHQRResponse;
    static generateDeepLink(
      url: string,
      qr: string,
      sourceInfo?: SourceInfo
    ): Promise<KHQRResponse>;
    static verify(qr: string): { isValid: boolean };
    static decode(qr: string): KHQRResponse;
    static checkBakongAccount(
      url: string,
      accountID: string
    ): Promise<{ bakongAccountExisted: boolean }>;
  }
}
