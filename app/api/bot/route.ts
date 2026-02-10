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
        `1️⃣ Avval o'zingizni rasmingizni yuboring (to'liq tana bo'lsa yaxshi).`
    );
});

// Handle Photos
bot.on("message:photo", async (ctx) => {
    const userId = ctx.from.id;
    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    const file = await ctx.getFile();
    const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

    // 1. Get Session from Supabase
    // Note: We leverage the 'products' or a dedicated 'bot_sessions' table.
    // To avoid migration hurdles, let's try to find if we can store it.
    // Actually, I will check if 'bot_sessions' exists, if not, I'll advise.

    let { data: session } = await supabase
        .from('bot_sessions')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (!session || !session.person_image) {
        // Save as person image
        const { error } = await supabase
            .from('bot_sessions')
            .upsert({ user_id: userId, person_image: fileUrl, updated_at: new Date() });

        if (error) {
            console.error("Supabase Session Error:", error);
            // Fallback for user: If table missing, tell them
            if (error.code === '42P01') {
                return ctx.reply("System maintenance: Please ask the admin to create the 'bot_sessions' table in Supabase.");
            }
        }

        await ctx.reply("Sizning rasmingiz qabul qilindi! ✅\n\n2️⃣ Endi o'zingizga yoqqan kiyim rasmini yuboring.");
    } else {
        // This is the garment image
        const personImg = session.person_image;

        await ctx.reply("Rahmat! AI rasm tayyorlashni boshladi... ⏳\nTayyor bo'lishi bilan sizga yuboraman.");

        try {
            const { startVton } = await import("../../../lib/vton-service");
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stileuz.vercel.app";

            // Start Prediction with Webhook
            await startVton({
                humanImage: personImg,
                garmentImage: fileUrl,
                category: "upper_body",
                webhook: `${siteUrl}/api/predictions/webhook?chatId=${userId}`
            });

            // We don't poll anymore! Replicate will call our webhook.
            // This prevents Vercel timeouts.

            // Clear the garment slot in session if needed, but we keep person_image 
            // so they can try multiple clothes on the same person.
        } catch (e) {
            console.error("Bot AI Error:", e);
            await ctx.reply("Xatolik yuz berdi. Iltimos, bir ozdan so'ng qaytadan urinib ko'ring.");
        }
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
