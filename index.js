const { Telegraf, Markup } = require('telegraf');
const config = require('./config.json'); // Includes BOT_TOKEN and CHANNEL_ID

const bot = new Telegraf(config.BOT_TOKEN);

// Caption messages in 3 languages
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

  my: `EdenVault – သင့်အတွက် ယုံကြည်စိတ်ချရသော ဒစ်ဂျစ်တယ်ဝန်ဆောင်မှုပံ့ပိုးသူ

VPN၊ subscription၊ gift card၊ game top-up၊ account နှင့် SMM panel ဝန်ဆောင်မှုများကို ယှဉ်ပြိုင်နိုင်သောစျေးနှုန်းဖြင့် ရှာဖွေနေပါသလား?

EdenVault သည် သင့်ဒစ်ဂျစ်တယ်လိုအပ်ချက်များအတွက် ယုံကြည်စိတ်ချရပြီး ကျွမ်းကျင်သော ဝန်ဆောင်မှုပံ့ပိုးသူဖြစ်ပါသည်။

ကျွန်ုပ်တို့၏ ဝန်ဆောင်မှုများ:

🔒 VPN ဝန်ဆောင်မှု – အဆင့်မြင့်လုံခြုံရေးအာမခံ
🧾 Subscription – Netflix, Spotify, YouTube နှင့် အခြားများ
🎮 Game Top-Up – လျင်မြန်ပြီး ယုံကြည်စိတ်ချရသော
🎁 Gift Card များ – ပြည်တွင်းနှင့်ပြည်ပ ရွေးချယ်စရာများစွာ
👤 Account ဝန်ဆောင်မှုများ – Email, Social Media များ
🚀 SMM Panel – Social Media Marketing အတွက် ပြီးပြည့်စုံသောဝန်ဆောင်မှု

EdenVault – သင့်ဒစ်ဂျစ်တယ်အတွေ့အကြုံကို မြှင့်တင်ပေးပါသည်။`,

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

// Function to return inline keyboard
const getButtons = (showLangRow = false) => {
  const buttons = [
    [
      Markup.button.url("🔒 VPN", "https://t.me/Edenvpn"),
      Markup.button.url("🧾 Subscription", "https://t.me/EdenSubs")
    ],
    [
      Markup.button.url("🎁 Gift Cards", "https://t.me/EdenGiftCard"),
      Markup.button.url("🎮 Game Topup", "https://t.me/EdenGTopup")
    ],
    [
      Markup.button.url("🚀 Social Media Boost", "https://t.me/EdenSMB"),
      Markup.button.url("👤 Accounts", "https://t.me/EDENAccount")
    ]
  ];

  if (showLangRow) {
    buttons.push([
      Markup.button.callback("🇬🇧 English", "lang_en"),
      Markup.button.callback("🇨🇳 中文", "lang_zh"),
      Markup.button.callback("🇲🇲 မြန်မာ", "lang_my")
    ]);
  }

  buttons.push([
    Markup.button.callback("🌐 Language / 语言 / ဘာသာ", showLangRow ? "lang_hide" : "lang_menu")
  ]);

  return Markup.inlineKeyboard(buttons);
};

// Command: /start - Test the bot
bot.start(async (ctx) => {
  try {
    await ctx.replyWithPhoto("https://i.imgur.com/iQxLLCB.png", {
      caption: "🤖 **EdenVault Bot Test**\n\nBot is working! Use /post to send a message to the channel.",
      parse_mode: "Markdown",
      reply_markup: getButtons(false).reply_markup
    });
    console.log("✅ /start command used");
  } catch (err) {
    console.error("❌ Error in /start:", err.message);
    await ctx.reply("❌ Error testing bot.");
  }
});

// Command: /post - Send post to channel
bot.command('post', async (ctx) => {
  try {
    await bot.telegram.sendPhoto(config.CHANNEL_ID, "https://i.imgur.com/iQxLLCB.png", {
      caption: messages.en,
      parse_mode: "Markdown",
      reply_markup: getButtons(false).reply_markup
    });

    await ctx.reply("✅ Posted to NOVORAHoldings channel!");
    console.log("✅ Channel post sent via /post command");
  } catch (err) {
    console.error("❌ Error posting:", err.message);
    await ctx.reply("❌ Failed to post to channel.");
  }
});

// Step 2: Toggle language button row
bot.action("lang_menu", async (ctx) => {
  try {
    await ctx.editMessageReplyMarkup(getButtons(true).reply_markup);
    await ctx.answerCbQuery();
  } catch (err) {
    console.error("❌ Error showing lang row:", err.message);
    await ctx.answerCbQuery("❌ Failed to open language options.");
  }
});

bot.action("lang_hide", async (ctx) => {
  try {
    await ctx.editMessageReplyMarkup(getButtons(false).reply_markup);
    await ctx.answerCbQuery();
  } catch (err) {
    console.error("❌ Error hiding lang row:", err.message);
    await ctx.answerCbQuery("❌ Failed to hide language options.");
  }
});

// Step 3: Change language caption
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
        reply_markup: getButtons(true).reply_markup
      }
    );
    await ctx.answerCbQuery(`✅ Language set`);
    console.log(`✅ Language changed to ${lang}`);
  } catch (err) {
    console.error("❌ Failed to change language:", err.message);
    await ctx.answerCbQuery("❌ Language switch failed");
  }
});

bot.launch();
console.log("✅ EdenVault multilingual bot with inline Language toggle is live!");
