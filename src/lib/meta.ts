import { COURSE_ROWS, WEBSITE_URL } from "@/lib/constants/whatsapp";

const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v22.0";
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;

type MetaSendPayload = Record<string, unknown>;

async function sendMetaMessage(payload: MetaSendPayload) {
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PHONE_NUMBER_ID}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      ...payload,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Meta API error:", data);
    throw new Error(data?.error?.message || "Failed to send WhatsApp message");
  }

  return data;
}

export async function sendMetaText(to: string, body: string) {
  return sendMetaMessage({
    to,
    type: "text",
    text: {
      preview_url: false,
      body,
    },
  });
}

export async function sendMetaCourseList(to: string, customerName?: string) {
  return sendMetaMessage({
    to,
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: "QEFAS Courses",
      },
      body: {
        text: `Hello ${customerName || "there"}, please choose a class to continue.`,
      },
      footer: {
        text: "Select a class below",
      },
      action: {
        button: "View classes",
        sections: [
          {
            title: "Available Classes",
            rows: COURSE_ROWS,
          },
        ],
      },
    },
  });
}

export async function sendMetaWebsiteButton(to: string, customerName?: string) {
  return sendMetaMessage({
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: `Hello ${customerName || "there"}, you can visit our website below.`,
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: "open_website",
              title: "Open Website",
            },
          },
        ],
      },
    },
  });
}

export async function sendMetaWebsiteLink(to: string) {
  return sendMetaText(to, `You can visit our website here: ${WEBSITE_URL}`);
}

export async function sendMetaCourseLink(
  to: string,
  coursePath: string,
  customerName?: string,
) {
  const fullUrl = `${WEBSITE_URL.replace(/\/$/, "")}/${coursePath}`;
  return sendMetaText(
    to,
    `Great ${customerName || ""}, here is your course link: ${fullUrl}`.trim(),
  );
}
