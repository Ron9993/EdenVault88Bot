const { Telegraf, Markup } = require('telegraf');
const config = require('./config.json'); // Make sure this contains BOT_TOKEN and CHANNEL_ID

const bot = new Telegraf(config.BOT_TOKEN);

// Multilingual captions
const messages = {
  en: `Welcome to EdenVault – Your Personal Digital Agent

Looking for the best deals on VPNs, subscriptions, gift cards, game top-ups, accounts, or social media growth?

EdenVault is your go-to assistant for all things digital — fast, secure, and reliable.

We offer:
- 🔒 VPN Services – Top-tier privacy & protection
- 🧾 Subscriptions – Netflix, Spotify, YouTube, ChatGPT & more
- 🎮 Game Top-Ups – Fast, safe, multi-platform credits
- 🎁 Gift Cards – Local & international options
- 👤 Accounts – Email, social media, digital platforms
- 🚀 Social Media Boost – Real engagement, real growth

No bots. No hassle. Just real support, real service.

EdenVault – Your digital life, delivered.`,

  my: `EdenVault – သင့်ပုဂ္ဂလိက ဒစ်ဂျစ်တယ်အကူအညီ

VPNs, subscription, gift cards, game top-ups, accounts, social media growth စတာတွေကို စျေးအရမ်းတန်ဆုံးနဲ့ ရှာနေတာလား?

EdenVault က သင့်ဒစ်ဂျစ်တယ်လိုအပ်ချက်အားလုံးအတွက် ယုံကြည်စိတ်ချရတဲ့ ကူညီသူ ဖြစ်ပါတယ်။

ကျွန်ုပ်တို့ပေးသည့်ဝန်ဆောင်မှုများ:
- 🔒 VPN ဝန်ဆောင်မှု – လုံခြုံရေးအထူး
- 🧾 Subscription – Netflix, Spotify, YouTube, ChatGPT & more
- 🎮 Game Top-Ups – မြန်မြန်ဆန်ဆန်၊ ယုံကြည်စိတ်ချ
- 🎁 Gift Cards – ပြည်တွင်း၊ ပြည်ပရွေးချယ်စရာများ
- 👤 Accounts – Email, Social Media, Digital Platforms
- 🚀 Social Media Boost – အမှန်တကယ်အကျိုးအမြတ်

Bot မရှိ။ တကယ်ဝန်ဆောင်မှုရှိပါတယ်။

EdenVault – သင့်ဒစ်ဂျစ်တယ်ဘဝကို ပေးဆောင်ပါတယ်။`,

  zh: `欢迎来到 EdenVault – 您的私人数字助手

想要寻找最优惠的 VPN、订阅、礼品卡、游戏充值、账号或社交媒体增长服务？

EdenVault 是您的一站式数字服务助手 – 快速、安全、可靠。

我们提供：
- 🔒 VPN 服务 – 顶级隐私和保护
- 🧾 订阅服务 – Netflix、Spotify、YouTube、ChatGPT 等
- 🎮 游戏充值 – 多平台、快速、安全
- 🎁 礼品卡 – 本地及国际选项
- 👤 账号服务 – 邮箱、社交媒体、各类平台
- 🚀 社交媒体增长 – 真实互动，真实增长

无机器人，无烦恼，只有真实服务。

EdenVault – 您的数字生活，已送达。`
};

// Inline buttons
const getButtons = () =>
  Markup.inlineKeyboard([
    [
      Markup.button.callback("🇬🇧 English", "lang_en"),
      Markup.button.callback("🇨🇳 中文", "lang_zh"),
      Markup.button.callback("🇲🇲 မြန်မာ", "lang_my")
    ]
  ]);

// Post to channel
bot.start(async () => {
  try {
    const msg = await bot.telegram.sendPhoto(
      config.CHANNEL_ID,
      "https://i.imgur.com/iQxLLCB.png",
      {
        caption: messages.en,
        parse_mode: "Markdown",
        reply_markup: getButtons().reply_markup
      }
    );

    console.log("✅ Posted to channel successfully:", msg.message_id);
  } catch (err) {
    console.error("❌ Failed to post to channel:", err.message);
  }
});

// Language change action
bot.action(/lang_(.+)/, async (ctx) => {
  const lang = ctx.match[1];
  const newCaption = messages[lang];
  const msg = ctx.callbackQuery.message;

  try {
    await ctx.telegram.editMessageMedia(
      msg.chat.id,
      msg.message_id,
      undefined,
      {
        type: "photo",
        media: "https://i.imgur.com/iQxLLCB.png",
        caption: newCaption,
        parse_mode: "Markdown"
      },
      {
        reply_markup: getButtons().reply_markup
      }
    );
    await ctx.answerCbQuery(`✅ Language changed`);
    console.log(`✅ Language switched to ${lang}`);
  } catch (err) {
    console.error("❌ Error changing language:", err.message);
    await ctx.answerCbQuery("❌ Could not change language");
  }
});

// Launch bot
bot.launch();
console.log("✅ EdenVault multilingual welcome bot is running.");
