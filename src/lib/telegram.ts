import { COURSE_MAP, COURSE_ROWS, WEBSITE_URL } from "./constants/whatsapp";
import { COURSE_LIST_BANNER, COURSE_BANNERS, GENERAL_QEFAS_BANNER, GENERAL_HUB_BANNER } from "./constants/images";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export async function sendTelegramText(chatId: string, text: string) {
  try {
    const res = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });
    
    if (!res.ok) {
        const errorText = await res.text();
        console.error("Telegram API Error:", res.status, errorText);
    }
  } catch (error) {
    console.error("Network Error sending Telegram text:", error);
  }
}

export async function sendTelegramGeneralAbout(chatId: string, text: string) {
  try {
    const res = await fetch(`${TELEGRAM_API_URL}/sendPhoto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        photo: GENERAL_QEFAS_BANNER,
        caption: text,
      }),
    });
    if (!res.ok) console.error("Telegram General Banner Error:", await res.text());
  } catch (error) {
    console.error("Error sending Telegram general banner:", error);
  }
}

export async function sendTelegramHubAbout(chatId: string, text: string) {
  try {
    const res = await fetch(`${TELEGRAM_API_URL}/sendPhoto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        photo: GENERAL_HUB_BANNER,
        caption: text,
      }),
    });
    if (!res.ok) console.error("Telegram Hub Banner Error:", await res.text());
  } catch (error) {
    console.error("Error sending Telegram hub banner:", error);
  }
}

export async function sendTelegramCourseList(chatId: string, name: string) {
  try {
    const inline_keyboard = COURSE_ROWS.map((course) => {
      return [{ text: course.title, callback_data: course.id }];
    });

    const res = await fetch(`${TELEGRAM_API_URL}/sendPhoto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        photo: COURSE_LIST_BANNER,
        caption: `Hi ${name || "there"}! Please select a course to learn more:`,
        reply_markup: {
          inline_keyboard: inline_keyboard
        }
      }),
    });
    if (!res.ok) console.error("Telegram Course List Error:", await res.text());
  } catch (error) {
    console.error("Error sending Telegram course list:", error);
  }
}

export async function sendTelegramWebsiteButton(chatId: string, name: string) {
  try {
    await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `Here is the link to our website, ${name || "there"}:`,
        reply_markup: {
          inline_keyboard: [
            [{ text: "Visit Website", url: "https://qefashub.com" }]
          ]
        }
      }),
    });
  } catch (error) {
    console.error("Error sending Telegram website button:", error);
  }
}

export async function sendTelegramCourseLink(chatId: string, coursePath: string, name: string) {
  try {
    const fullUrl = `${WEBSITE_URL.replace(/\/$/, "")}/${coursePath}`;
    
    // Find the title based on the path mapping
    const courseKey = Object.keys(COURSE_MAP).find(key => COURSE_MAP[key] === coursePath);
    const course = COURSE_ROWS.find(c => c.id === courseKey);
    const title = course ? course.title : "Course";
    const bannerImg = (courseKey && COURSE_BANNERS[courseKey]) ? COURSE_BANNERS[courseKey] : COURSE_BANNERS["default"];

    const res = await fetch(`${TELEGRAM_API_URL}/sendPhoto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        photo: bannerImg,
        caption: `Awesome choice, ${name || "there"}!\n\nHere is the link to the ${title} course:`,
        reply_markup: {
          inline_keyboard: [
            [{ text: `Start ${title}`, url: fullUrl }]
          ]
        }
      }),
    });
    if (!res.ok) console.error("Telegram Course Link Error:", await res.text());
  } catch (error) {
    console.error("Error sending Telegram course link:", error);
  }
}
