import OpenAI from 'openai';
import fs from 'fs/promises';
import { v4 as uuid } from 'uuid';

const openai = new OpenAI();

export async function makeIllustration(heading) {
  const prompt = `Clean vector style illustration for chapter titled "${heading}". Minimal, flat design, accent color palette.`;
  const res = await openai.images.generate({ prompt, n: 1, size: '1024x1024' });
  const url = res.data[0].url;
  const imgData = await fetch(url).then(r => r.arrayBuffer());
  const filename = `/tmp/${uuid()}.png`;
  await fs.writeFile(filename, Buffer.from(imgData));
  return filename;
}
