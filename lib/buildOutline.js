import OpenAI from 'openai';
import pTimeout from 'p-timeout';

const openai = new OpenAI();

// ✅ Hàm làm sạch Markdown JSON
function cleanMarkdownJson(text) {
  return text
    .replace(/^```json\\s*/i, '')    // xoá dòng mở đầu ```json
    .replace(/^```/i, '')            // hoặc nếu chỉ là ``` không có json
    .replace(/```$/, '')             // xoá dòng kết ``` (ở cuối)
    .trim();
}

export async function buildOutline(topic) {
  const sys = 'You are an expert outline generator. Reply ONLY in raw JSON: {"chapters":[{"heading":"...","bullets":["..."]}]} — DO NOT wrap in markdown.';
  const user = `Create an outline for a how-to-use guide titled "${topic}". 8–12 chapters, each with 3–5 bullet points.`;

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
  console.log("📥 GPT raw outline:\n", raw);

  const cleaned = cleanMarkdownJson(raw);
  return JSON.parse(cleaned);
}
