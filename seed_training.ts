import fs from 'fs';
import path from 'path';
import mongoose from "mongoose";
import dbConnect from "./src/lib/mongodb";
import Knowledge from "./src/models/Knowledge";

async function seedTrainingDocs() {
  await dbConnect();
  console.log("Connected to MongoDB");

  const trainingDir = path.join(process.cwd(), 'src', 'training');
  const files = fs.readdirSync(trainingDir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    console.log(`Processing ${file}...`);
    const content = fs.readFileSync(path.join(trainingDir, file), 'utf-8');
    
    // Split by Markdown headers (H2, H3, or H4)
    const sections = content.split(/\n#{2,4}\s+/);
    
    for (let i = 1; i < sections.length; i++) {
      const section = sections[i];
      const lines = section.split('\n');
      const heading = lines[0].trim();
      const body = lines.slice(1).join('\n').trim();
      
      if (!heading || !body || body.length < 10) continue;

      // Clean up heading
      const question = heading.replace(/\*\*/g, '').replace(/^Q:\s*/, '').replace(/^[❓📞🐛🎨📱🔄🎯🌈📊🔐💡🎬]\s*/, '').trim();
      const answer = body.substring(0, 3000); // Prevent massive answers if chunking missed
      
      const category = file.replace('.md', '').replace(/_/g, ' ');
      
      const keywords = question.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      
      await Knowledge.findOneAndUpdate(
        { question: question },
        { 
          $set: {
            category,
            question,
            answer,
            tags: keywords
          }
        },
        { upsert: true, new: true }
      );
    }
  }

  console.log("All training documents seeded successfully!");
  process.exit(0);
}

seedTrainingDocs().catch(err => {
  console.error(err);
  process.exit(1);
});
