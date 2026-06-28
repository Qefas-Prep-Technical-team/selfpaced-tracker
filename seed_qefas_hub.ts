import mongoose from "mongoose";
import dbConnect from "./src/lib/mongodb";
import Knowledge from "./src/models/Knowledge";

const qefasHubKnowledge = [
  {
    category: "General",
    question: "What is Qefas Hub?",
    answer: "Qefas Hub is a state-of-the-art, full-stack educational management platform and school administration ecosystem. It handles student lifecycles, staff registries, academics, and behavioral tracking. It is a premium B2B SaaS platform.",
    tags: ["qefas hub", "management platform", "what is", "about"]
  },
  {
    category: "General",
    question: "What is the difference between Qefas and Qefas Hub?",
    answer: "Qefas is a preparatory school providing self-paced online classes. Qefas Hub is a separate B2B SaaS platform built to help other schools manage their administration, timetables, AI exam generation, etc.",
    tags: ["difference", "qefas", "qefas hub", "saas", "prep school"]
  },
  {
    category: "Admin",
    question: "What are the capabilities of a School Administrator in Qefas Hub?",
    answer: "Admins manage the school's digital infrastructure, curriculum, global registry, landing page via Subdomain Builder, Timetable generation, and handle subscription payments via Paystack.",
    tags: ["admin", "administrator", "capabilities", "role"]
  },
  {
    category: "Teacher",
    question: "What can a Teacher do in Qefas Hub?",
    answer: "Teachers deliver curriculum, create assignments/exams/quizzes (with AI assistance), mark daily attendance, log behavioral incidents, and grade/upload marks via CSV or direct entry.",
    tags: ["teacher", "faculty", "role", "capabilities"]
  },
  {
    category: "Student",
    question: "What features are available for Students on Qefas Hub?",
    answer: "Students can view their academic summaries, submit assignments, check personalized timetables and historical timelines, view behavioral logs, and download official comprehensive transcripts.",
    tags: ["student", "role", "capabilities", "features"]
  },
  {
    category: "Parent",
    question: "What can Parents do on Qefas Hub?",
    answer: "Parents can monitor their child's academic records, progress, attendance, disciplinary actions, and manage fee payments and subscriptions.",
    tags: ["parent", "guardian", "role", "capabilities"]
  },
  {
    category: "Features",
    question: "How do I change the look of my school's login page or landing page?",
    answer: "As a School Admin, navigate to your Dashboard -> Settings -> Subdomain. Here you can use the visual page builder to update your school's Hero text, brand colors, vision, and testimonials. All updates sync instantly.",
    tags: ["landing page", "login page", "customization", "subdomain", "builder"]
  },
  {
    category: "Admin",
    question: "Why can't I add a student to my school?",
    answer: "Check your Subscription limits. If you have reached your 'Max Students' quota, you will need to upgrade your pricing plan via the Billing dashboard.",
    tags: ["add student", "limit", "quota", "subscription", "cannot add"]
  },
  {
    category: "Admin",
    question: "A student left our school but is returning. How do I add them back?",
    answer: "Navigate to the student's profile and use the 'Re-enroll' action. Since Qefas Hub tracks student lifecycles permanently, this will close their 'Transferred/Exited' status and create a new Active enrollment timeline event.",
    tags: ["student return", "re-enroll", "add back", "exited"]
  },
  {
    category: "AI",
    question: "My AI Insights feature is locked, but I have a premium plan.",
    answer: "The AI tool has a daily limit on the number of prompts/tokens that can be generated. Check your AI limit quota; you may have exhausted your daily allowance. It will reset automatically at midnight.",
    tags: ["ai locked", "premium", "ai insights", "quota", "limit"]
  },
  {
    category: "Features",
    question: "How do we handle end-of-term report cards?",
    answer: "Once all teachers have recorded their CA (40%) and Exam (60%) grades, the system automatically aggregates them. Admins or Students can then navigate to the transcript area and download a comprehensive, official PDF report card complete with AI-generated remarks and digital signatures.",
    tags: ["report cards", "transcripts", "end of term", "grades"]
  },
  {
    category: "AI",
    question: "What AI features are in Qefas Hub?",
    answer: "Qefas Hub features AI Performance Insights, AI Exam Generation/Parsing to help teachers set questions, and AI Transcript Remarks that automatically draft personalized remarks from the Class Teacher and Principal.",
    tags: ["ai", "features", "capabilities", "artificial intelligence"]
  }
];

async function seedData() {
  await dbConnect();
  console.log("Connected to MongoDB.");
  for (const item of qefasHubKnowledge) {
    await Knowledge.findOneAndUpdate(
      { question: item.question },
      { $set: item },
      { upsert: true, new: true }
    );
  }
  console.log("Qefas Hub knowledge successfully seeded!");
  process.exit(0);
}

seedData().catch(err => {
  console.error(err);
  process.exit(1);
});
