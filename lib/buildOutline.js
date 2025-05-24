import OpenAI from 'openai';
import pTimeout from 'p-timeout';

const openai = new OpenAI();

function cleanMarkdownJson(text) {
  return text
    .replace(/```json\\s*/i, '')
    .replace(/```$/, '')
    .trim();
}

export async function buildOutline(topic) {
  const sys = 'You are an expert outline generator. Reply in JSON: {chapters:[{heading:string, bullets:string[]}]} with 8-12 chapters.';
  const user = `Create an outline for a how-to-use guide titled "${topic}". Each chapter heading should be concise; give 3-5 bullet points for content.`;

  const chat = await pTimeout(
    openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.3,
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: user }
      ]
    }),
    180_000,
    'OpenAI timeout at outline step'
  );

  const raw = chat.choices[0].message.content;
  const cleaned = cleanMarkdownJson(raw);
  return JSON.parse(cleaned);
}
