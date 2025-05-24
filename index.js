import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { buildBook } from './lib/buildEpub.js';

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.command('newbook', async ctx => {
  const rawTitle = ctx.message.text.replace('/newbook', '').trim();
  if (!rawTitle) return ctx.reply('📖  Vui lòng thêm tiêu đề, ví dụ: /newbook How to use GoLogin');
  await ctx.reply(`⏳ Generating “${rawTitle}”… this may take about 1–2 minutes.`);
  try {
    const epubPath = await buildBook(rawTitle);
    await ctx.replyWithDocument({ source: epubPath, filename: `${rawTitle}.epub` });
  } catch (err) {
    console.error(err);
    await ctx.reply('❌  Xin lỗi, tạo sách thất bại. Hãy thử lại sau.');
  }
});

bot.launch();
