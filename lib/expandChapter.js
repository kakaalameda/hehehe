import OpenAI from 'openai';
import pTimeout from 'p-timeout';

const openai = new OpenAI();

export async function expandChapter(heading, bullets) {
  const sys = 'You expand outline bullets into rich HTML (EPUB-safe). Use <h2>, <p>, and <ul><li>. Do not include images.';
  const user = `Chapter: ${heading}\\nBullets:\\n${bullets}`;

  const chatPromise = openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0125',
    temperature: 0.7,
    messages: [
      { role: 'system', content: sys },
      { role: 'user', content: user }
    ]
  });

  return (await pTimeout(chatPromise, 180_000, 'OpenAI timeout at chapter step')).choices[0].message.content;
}
