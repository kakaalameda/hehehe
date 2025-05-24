import OpenAI from 'openai';
const openai = new OpenAI();

export async function expandChapter(heading, bullets) {
  const sys = 'You expand outline bullets into rich HTML (EPUB-safe). Use <h2>, <p>, and <ul><li>. Do not include images.';
  const user = `Chapter: ${heading}\nBullets:\n${bullets}`;
  const chat = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0125',
    temperature: 0.7,
    messages: [{ role: 'system', content: sys }, { role: 'user', content: user }]
  });
  return chat.choices[0].message.content;
}
