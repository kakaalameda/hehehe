import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { buildBook } from './lib/buildEpub.js';

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// ⚠️ Xoá webhook cũ để tránh xung đột polling
bot.telegram.deleteWebhook().then(() => {
  console.log("✅ Webhook deleted, using polling mode.");
});

bot.command('newbook', async ctx => {
  const rawTitle = ctx.message.text.replace('/newbook', '').trim();
  if (!rawTitle) return ctx.reply('📖  Vui lòng thêm tiêu đề, ví dụ: /newbook How to use GoLogin');

  await ctx.reply(`✏️ Bắt đầu tạo sách: “${rawTitle}”...`);

  try {
    const epubPath = await buildBook(rawTitle, ctx);
    await ctx.replyWithDocument({ source: epubPath, filename: `${rawTitle}.epub` });
  } catch (err) {
    console.error('❌ Unhandled error in buildBook:', err);
    await ctx.reply('❌ Có lỗi xảy ra khi tạo sách. Vui lòng thử lại sau.');
  }
});

// ✅ Bật chế độ polling an toàn
bot.launch({ polling: true });
