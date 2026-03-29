export const COURSE_MAP: Record<string, string> = {
  course_jss1: "jss1-course-self-paced-class-promo/",
  course_jss2: "jss2-course-self-paced-class-promo/",
  course_jss3: "jss3-course-self-paced-class-promo/",
  course_sss1: "sss1-course-self-paced-class-promo/",
  course_sss2: "sss2-course-self-paced-class-promo/",
  course_sss3: "sss3-course-self-paced-class-promo/",
};

export const COURSE_ROWS = [
  {
    id: "course_jss1",
    title: "JSS 1",
    description: "Self-paced class",
  },
  {
    id: "course_jss2",
    title: "JSS 2",
    description: "Self-paced class",
  },
  {
    id: "course_jss3",
    title: "JSS 3",
    description: "Self-paced class",
  },
  {
    id: "course_sss1",
    title: "SSS 1",
    description: "Self-paced class",
  },
  {
    id: "course_sss2",
    title: "SSS 2",
    description: "Self-paced class",
  },
  {
    id: "course_sss3",
    title: "SSS 3",
    description: "Self-paced class",
  },
];

export const WEBSITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://qefas.com";
