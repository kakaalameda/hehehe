import OpenAI from 'openai';
import pTimeout from 'p-timeout';

const openai = new OpenAI();

export async function buildOutline(topic) {
  const sys = 'You are an expert outline generator. Reply in JSON: {chapters:[{heading:string, bullets:string[]}]} with 8-12 chapters.';
  const user = `Create an outline for a how-to-use guide titled "${topic}". Each chapter heading should be concise; give 3-5 bullet points for content.`;

  const chatPromise = openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.3,
    messages: [
      { role: 'system', content: sys },
      { role: 'user', content: user }
    ]
  });

  // ⏱ Tăng timeout lên 180 giây
  const chat = await pTimeout(chatPromise, 180_000, 'OpenAI timeout at outline step');

  return JSON.parse(chat.choices[0].message.content);
}
