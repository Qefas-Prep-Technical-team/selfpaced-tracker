const fs = require('fs');
require('dotenv').config({ path: '.env.local' });
if (!process.env.TELEGRAM_BOT_TOKEN) {
  require('dotenv').config({ path: '.env' });
}

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

async function test() {
  const inline_keyboard = [
    [{ text: "JSS 1", callback_data: "course_jss1" }],
    [{ text: "JSS 2", callback_data: "course_jss2" }]
  ];

  // We need a valid chat_id to test this. But we can just make a malformed request to see if it complains about format, 
  // or use a dummy chat_id which will yield "chat not found".
  const res = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: "12345678", // dummy
      text: "Test",
      reply_markup: {
        inline_keyboard: inline_keyboard
      }
    }),
  });

  const data = await res.json();
  console.log("Response:", data);
}

test();
