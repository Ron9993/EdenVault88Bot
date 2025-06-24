const { Telegraf, Markup } = require('telegraf');
const config = require('./config.json'); 

const bot = new Telegraf(config.BOT_TOKEN);

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

const getButtons = (lang) => Markup.inlineKeyboard([
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
  ],
  [
    Markup.button.callback("🌐 Language / 语言 / ဘာသာ", "lang_menu")
  ]
]);

const postedMessages = {};

bot.start(async (ctx) => {
  try {
    const msg = await bot.telegram.sendPhoto(config.CHANNEL_ID, {
      photo: "https://i.imgur.com/iQxLLCB.png"
    }, {
      caption: messages.en,
      parse_mode: "Markdown",
      reply_markup: getButtons("en").reply_markup
    });

    postedMessages[msg.message_id] = 'en';
    console.log("✅ Post sent to channel!");
  } catch (err) {
    console.error("❌ Failed to send post:", err.message);
  }
});

bot.action("lang_menu", async (ctx) => {
  try {
    await ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
      [
        Markup.button.callback("🇬🇧 English", "lang_en"),
        Markup.button.callback("🇨🇳 中文", "lang_zh"),
        Markup.button.callback("🇲🇲 မြန်မာ", "lang_my")
      ]
    ]));
  } catch (err) {
    console.error("❌ Failed to show language menu:", err.message);
    await ctx.answerCbQuery("❌ Error displaying language menu");
  }
});

bot.action(/lang_(.+)/, async (ctx) => {
  const lang = ctx.match[1];
  const newText = messages[lang];
  const message = ctx.callbackQuery.message;

  try {
    await ctx.telegram.editMessageMedia(
      message.chat.id,
      message.message_id,
      undefined,
      {
        type: "photo",
        media: "https://i.imgur.com/iQxLLCB.png",
        caption: newText,
        parse_mode: "Markdown"
      },
      {
        reply_markup: getButtons(lang).reply_markup
      }
    );
    await ctx.answerCbQuery("✅ Language changed!");
    console.log(`✅ Language changed to ${lang}`);
  } catch (e) {
    console.error("❌ Failed to edit message:", e.message);
    await ctx.answerCbQuery("❌ Failed to change language.");
  }
});

bot.launch();
console.log("✅ EdenVault welcome bot is live with multilingual post!");
