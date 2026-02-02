import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { subject, htmlContent, to, sender } = await req.json();

    // In testing, 'sender' will be 'onboarding@resend.dev'
    // In production, it will be your verified domain
    const fromAddress = sender || "marketing@analytics.com.ng";

    const payload = to.map((email: string) => ({
      from: `Test Admin <${fromAddress}>`,
      to: [email],
      subject: subject,
      html: htmlContent,
    }));

    const data = await resend.batch.send(payload);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
