import OpenAI from 'openai';
const openai = new OpenAI();

export async function buildOutline(topic) {
  const sys = 'You are an expert outline generator. Reply in JSON: {chapters:[{heading:string, bullets:string[]}]} with 8-12 chapters.';
  const user = `Create an outline for a how-to-use guide titled "${topic}". Each chapter heading should be concise; give 3-5 bullet points for content.`;
  const chat = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.3,
    messages: [{ role: 'system', content: sys }, { role: 'user', content: user }]
  });
  return JSON.parse(chat.choices[0].message.content);
}
