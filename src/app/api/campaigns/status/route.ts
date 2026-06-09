import { NextRequest, NextResponse } from "next/server";

// Helper to format Nigerian phone numbers to Termii format: 2348030000000
function formatPhoneNumber(num: string): string {
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

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.TERMII_API_KEY;
    const baseUrl = process.env.TERMII_BASE_URL || "https://api.ng.termii.com";

    const { searchParams } = new URL(req.url);
    const phoneNumberInput = searchParams.get("phone_number");
    const countryCode = searchParams.get("country_code") || "NG";

    if (!phoneNumberInput) {
      return NextResponse.json({ error: "phone_number parameter is required" }, { status: 400 });
    }

    const formattedNum = formatPhoneNumber(phoneNumberInput);

    if (!apiKey) {
      // Sandbox Simulator responses for different carriers
      let operatorName = "MTN Nigeria";
      let operatorCode = "MTN";
      
      if (formattedNum.endsWith("11") || formattedNum.endsWith("22")) {
        operatorName = "Airtel Nigeria";
        operatorCode = "Airtel";
      } else if (formattedNum.endsWith("33")) {
        operatorName = "Globacom (Glo)";
        operatorCode = "Glo";
      } else if (formattedNum.endsWith("44")) {
        operatorName = "9mobile";
        operatorCode = "9mobile";
      }

      return NextResponse.json({
        result: [
          {
            routeDetail: {
              number: formattedNum,
              ported: formattedNum.endsWith("99") ? 1 : 0
            },
            countryDetail: {
              countryCode: "234",
              mobileCountryCode: "621",
              iso: countryCode
            },
            operatorDetail: {
              operatorCode: operatorCode,
              operatorName: operatorName,
              mobileNumberCode: "30",
              mobileRoutingCode: "40",
              carrierIdentificationCode: "23444",
              lineType: "Mobile"
            },
            format: {
              universalNumberFormat: "+" + formattedNum
            },
            status: 200,
            refId: `REF-${Date.now()}`
          }
        ],
        status: true,
        message: "Completed Successfully (Sandbox Mode)."
      });
    }

    const url = `${baseUrl}/api/insight/number/query?phone_number=${formattedNum}&api_key=${apiKey}&country_code=${countryCode}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Termii Status API returned HTTP status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GET Number Portability Status Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to query number status" },
      { status: 500 }
    );
  }
}
