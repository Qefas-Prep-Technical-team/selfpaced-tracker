import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { subject, previewText, htmlContent, to } = await req.json();

    const data = await resend.emails.send({
      from: "Marketing <marketing@analytics.com.ng>", // Must be a verified domain in Resend
      to: [to],
      subject: subject,
      text: previewText, // Fallback text
      html: htmlContent, // This is where your EmailPreview HTML goes
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
