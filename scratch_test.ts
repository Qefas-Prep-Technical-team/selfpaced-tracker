import { generateAiReply } from './src/lib/services/ai.service.ts';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const convo = {
    name: 'Ola',
    messages: [
      { sender: 'user', body: 'I need help with my payment plan, I want to talk to a human.' }
    ]
  };

  const result = await generateAiReply({ convo, knowledgeContext: '', isNewDay: true });
  console.log(JSON.stringify(result, null, 2));
}

run();
