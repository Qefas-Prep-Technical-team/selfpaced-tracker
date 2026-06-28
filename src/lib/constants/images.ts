const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://qefashub.com";

export const GENERAL_QEFAS_BANNER = `${BASE_URL}/chat_images/about.png`;
export const GENERAL_HUB_BANNER = `${BASE_URL}/chat_images/hub_about.png`;

export const COURSE_LIST_BANNER = `${BASE_URL}/chat_images/list.png`;

export const COURSE_BANNERS: Record<string, string> = {
  "course_jss1": `${BASE_URL}/chat_images/jss1.png`,
  "course_jss2": `${BASE_URL}/chat_images/jss2.png`,
  "course_jss3": `${BASE_URL}/chat_images/jss3.png`,
  "course_sss1": `${BASE_URL}/chat_images/sss1.png`,
  "course_sss2": `${BASE_URL}/chat_images/sss2.png`,
  "course_sss3": `${BASE_URL}/chat_images/sss3.png`,
  "default": `${BASE_URL}/chat_images/list.png`
};
