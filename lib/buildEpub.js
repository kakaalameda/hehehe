import { v4 as uuid } from 'uuid';
import { buildOutline } from './buildOutline.js';
import { expandChapter } from './expandChapter.js';
import { makeIllustration } from './makeIllustration.js';
import Epub from 'epub-gen';
import path from 'path';

export async function buildBook(topic) {
  const outline = await buildOutline(topic);
  const chapters = [];
  for (const ch of outline.chapters) {
    const html = await expandChapter(ch.heading, ch.bullets.join('\n'));
    const imgPath = await makeIllustration(ch.heading);
    chapters.push({
      title: ch.heading,
      data: `<img src="${path.basename(imgPath)}" alt="${ch.heading} illustration" />\n` + html
    });
  }
  const tmpFile = `/tmp/${uuid()}.epub`;
  await new Epub({
    title: topic,
    author: 'AI Generated',
    language: 'en',
    publisher: 'BookBot Inc.',
    tocTitle: 'Table of Contents',
    content: chapters
  }, tmpFile).promise;
  return tmpFile;
}
