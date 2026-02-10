import { Bot, webhookCallback } from "grammy";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not defined");
}

const bot = new Bot(token);

// Handle /start
bot.command("start", (ctx) => {
    ctx.reply(
        `Assalomu alaykum! Adamari Virtual Fitting Botiga xush kelibsiz. ✨\n\n` +
        `Bu bot yordamida kiyimlarni rasmga tushib, ustingizda qanday turishini ko'rishingiz mumkin.\n\n` +
        `🤖 **Tizim yangilanishda:** Hozircha AI funksiyasi vaqtincha to'xtatilgan (creditlarni tejash uchun).`,
        {
            reply_markup: {
                keyboard: [
                    [{ text: "👗 Ayollar kiyimi" }, { text: "🤵 Erkaklar kiyimi" }],
                    [{ text: "🔄 Rasmni tozalash" }, { text: "ℹ️ Yordam" }]
                ],
                resize_keyboard: true
            }
        }
    );
});

// Handle Photos
bot.on("message:photo", async (ctx) => {
    await ctx.reply("Hozircha AI funksiyasi texnik sabablarga ko'ra to'xtatilgan. Creditlaringizni tejash uchun tizimni o'chirib qo'ydik. 🛠");
});

bot.on("message:text", async (ctx) => {
    const text = ctx.message.text;
    if (text === "🔄 Rasmni tozalash") {
        const userId = ctx.from.id;
        await supabase.from('bot_sessions').delete().eq('user_id', userId);
        await ctx.reply("Barchasi tozalandi. Yangi rasm yuborishingiz mumkin.");
    } else if (text === "ℹ️ Yordam") {
        await ctx.reply("Botdan foydalanish: \n1. O'z rasmingizni yuboring.\n2. Kiyim rasmini yuboring.\n3. AI natijani qaytaradi.");
    } else {
        await ctx.reply("Iltimos, pastdagi tugmalardan foydalaning.");
    }
});

bot.on("callback_query:data", async (ctx) => {
    if (ctx.callbackQuery.data === "reset") {
        const userId = ctx.from.id;
        await supabase.from('bot_sessions').delete().eq('user_id', userId);
        await ctx.answerCallbackQuery();
        await ctx.reply("Barchasi tozalandi. O'zingizni yangi rasmingizni yuboring!");
    }
});

export const POST = webhookCallback(bot, "std/http");
