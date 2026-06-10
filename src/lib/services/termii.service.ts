// src/lib/services/termii.service.ts

export function formatPhoneNumber(num: string): string {
  let clean = num.replace(/\D/g, "");
  if (clean.startsWith("0") && clean.length === 11) {
    clean = "234" + clean.slice(1);
  }
  if (clean.startsWith("234") && clean.length === 13) {
    return clean;
  }
  if (!clean.startsWith("234") && clean.length === 10) {
    clean = "234" + clean;
  }
  return clean;
}

export interface VerificationResult {
  isValid: boolean;
  reason?: string;
  ported?: boolean;
  operator?: string;
  warning?: string;
}

/**
 * Verifies if a phone number is valid and active using the Termii Status/Insight API.
 * If credentials are not set, it acts as a simulator sandbox.
 * 
 * @param phone Phone number to verify.
 * @param countryCode Two-letter ISO country code (default: "NG").
 */
export async function verifyPhoneNumber(
  phone: string,
  countryCode: string = "NG"
): Promise<VerificationResult> {
  const apiKey = process.env.TERMII_API_KEY;
  const baseUrl = process.env.TERMII_BASE_URL || "https://api.ng.termii.com";
  const formattedNum = formatPhoneNumber(phone);

  if (!formattedNum || formattedNum.length < 10) {
    return { isValid: false, reason: "Invalid phone number length/format." };
  }

  // If apiKey is missing, treat as simulated success in development (sandbox simulator)
  if (!apiKey) {
    console.log(`[Termii Service Sandbox] Verifying number: ${formattedNum}`);
    // Simulate invalid numbers if they end in "000" or are not 13 digits long (standard Nigerian format)
    if (formattedNum.endsWith("000") || formattedNum.length !== 13) {
      return {
        isValid: false,
        reason: "Invalid or non-existent number (Simulated Sandbox rejection).",
      };
    }
    return {
      isValid: true,
      ported: formattedNum.endsWith("99"),
      operator: formattedNum.endsWith("11") ? "Airtel" : "MTN",
    };
  }

  try {
    const url = `${baseUrl}/api/insight/number/query?phone_number=${formattedNum}&api_key=${apiKey}&country_code=${countryCode}`;
    const response = await fetch(url);

    // If Termii returns an HTTP error code (e.g. 401 Unauthorized, 403 Forbidden, 404, etc.)
    // because the status/insight API is not activated for this account,
    // we should NOT block the user registration. We should allow it, but log a warning.
    if (!response.ok) {
      console.warn(`Termii Status API returned HTTP ${response.status}. Defaulting to valid.`);
      return {
        isValid: true,
        warning: `Termii Status API returned HTTP ${response.status} (possibly not activated on this account).`,
      };
    }

    const data = (await response.json()) as any;

    if (data && data.status === false) {
      return {
        isValid: false,
        reason: data.message || "Termii reported number as invalid.",
      };
    }

    const result = data?.result?.[0];
    if (!result) {
      return {
        isValid: false,
        reason: "No lookup results found for this number.",
      };
    }

    // Checking if status within result indicates failure (e.g., 400, 422, etc.)
    if (result.status && result.status !== 200) {
      return {
        isValid: false,
        reason: `Verification failed with status code ${result.status}`,
      };
    }

    // Check operator details
    const operator = result.operatorDetail?.operatorName || "";
    const lineType = result.operatorDetail?.lineType || "";

    if (!operator || operator.toLowerCase() === "unknown" || !lineType) {
      return {
        isValid: false,
        reason: "Number has no associated network operator (likely fake or inactive).",
      };
    }

    return {
      isValid: true,
      ported: result.routeDetail?.ported === 1,
      operator: operator,
    };
  } catch (error: any) {
    console.error("Termii Status API request exception:", error);
    // On network failure or internal server error, fallback to valid to avoid blocking users
    return {
      isValid: true,
      warning: error?.message || "Termii API connection error",
    };
  }
}
