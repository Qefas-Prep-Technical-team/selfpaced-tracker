import { COURSE_MAP, COURSE_ROWS, WEBSITE_URL } from "./constants/whatsapp";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export async function sendTelegramText(chatId: string, text: string) {
  try {
    await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });
  } catch (error) {
    console.error("Error sending Telegram text:", error);
  }
}

export async function sendTelegramCourseList(chatId: string, name: string) {
  try {
    const inline_keyboard = COURSE_ROWS.map((course) => {
      return [{ text: course.title, callback_data: course.id }];
    });

    await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `Hi ${name || "there"}! Please select a course to learn more:`,
        reply_markup: {
          inline_keyboard: inline_keyboard
        }
      }),
    });
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

    await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `Awesome choice, ${name || "there"}!\n\nHere is the link to the ${title} course:`,
        reply_markup: {
          inline_keyboard: [
            [{ text: `Start ${title}`, url: fullUrl }]
          ]
        }
      }),
    });
  } catch (error) {
    console.error("Error sending Telegram course link:", error);
  }
}
