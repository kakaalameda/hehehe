import { v4 as uuid } from 'uuid';
import { buildOutline } from './buildOutline.js';
import { expandChapter } from './expandChapter.js';
import { makeIllustration } from './makeIllustration.js';
import Epub from 'epub-gen';
import path from 'path';

export async function buildBook(topic, ctx) {
  try {
    await ctx.reply('🧠 Đang xây dựng dàn ý...');
    const outline = await buildOutline(topic);

    const chapters = [];
    let chapterIndex = 1;

    for (const ch of outline.chapters) {
      try {
        await ctx.reply(`📄 Viết chương ${chapterIndex}: ${ch.heading}`);
        const html = await expandChapter(ch.heading, ch.bullets.join('\n'));

        await ctx.reply(`🎨 Sinh minh họa cho chương ${chapterIndex}...`);
        const imgPath = await makeIllustration(ch.heading);

        chapters.push({
          title: ch.heading,
          data: `<img src="${path.basename(imgPath)}" alt="${ch.heading} illustration" />\n` + html
        });
      } catch (chapterErr) {
        console.error(`❌ Lỗi chương ${chapterIndex}:`, chapterErr);
        await ctx.reply(`⚠️ Bỏ qua chương ${chapterIndex} do lỗi.`);
      }

      chapterIndex++;
    }

    await ctx.reply('📚 Đang xuất bản file EPUB...');
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
  } catch (err) {
    console.error('❌ buildBook error:', err);
    await ctx.reply('❌ Không thể tạo sách. Vui lòng thử lại sau.');
    throw err;
  }
}
