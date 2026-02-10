import { Bot, webhookCallback } from "grammy";
import { NextRequest, NextResponse } from "next/server";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not defined");
}

const bot = new Bot(token);

// In-memory session (Wait: Serverless functions forget memory! Need persistent store)
// For MVP demo, this might work if lucky with cold starts, but in prod use Supabase.
const userSessions: Record<number, { personImage?: string, garmentImage?: string }> = {};

// Handle /start
bot.command("start", (ctx) => {
    const brandId = ctx.match || "adamari";
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

    if (!userSessions[userId] || !userSessions[userId].personImage) {
        // Save as person image
        userSessions[userId] = { ...userSessions[userId], personImage: fileUrl };
        await ctx.reply("Sizning rasmingiz qabul qilindi! ✅\n\n2️⃣ Endi o'zingizga yoqqan kiyim rasmini yuboring.");
    } else {
        // This is the garment image
        userSessions[userId].garmentImage = fileUrl;
        const personImg = userSessions[userId].personImage!;

        await ctx.reply("Rahmat! AI kiyimni kiygizmoqda... ⏳ (Taxminan 30 soniya)");

        try {
            // We call our internal API or use the service directly
            // Direct service use:
            const { startVton } = await import("../../../lib/vton-service");
            const prediction = await startVton({
                humanImage: personImg,
                garmentImage: fileUrl,
                category: "upper_body" // Default
            });

            // Loop for results (Manual polling in bot for simplicity)
            let finalResult = null;
            let attempts = 0;
            while (!finalResult && attempts < 20) {
                attempts++;
                await new Promise(r => setTimeout(r, 3000));
                const pollRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/predictions/${prediction.id}`);
                const data = await pollRes.json();

                if (data.status === "succeeded") {
                    finalResult = Array.isArray(data.output) ? data.output[0] : data.output;
                } else if (data.status === "failed") {
                    throw new Error("AI Fitting Failed");
                }
            }

            if (finalResult) {
                // Apply Watermark
                const watermarkRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/predictions/process`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        imageUrl: finalResult,
                        logoUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/brands/adamari-logo.png`
                    })
                });
                const wData = await watermarkRes.json();
                const watermarked = wData.watermarkedImage || finalResult;

                // Send Result
                await ctx.replyWithPhoto(watermarked, {
                    caption: "Tayyor! Adamari kiyimi sizga juda yarashdi. 😍\n\nSotib olish uchun: @adamaricommunitymanager",
                    reply_markup: {
                        inline_keyboard: [[
                            { text: "🛒 Sotib olish", url: "https://t.me/adamaricommunitymanager" },
                            { text: "🔄 Boshqasini ko'rish", callback_data: "reset" }
                        ]]
                    }
                });

                // Clear session garment to allow next garment
                userSessions[userId].garmentImage = undefined;
            } else {
                await ctx.reply("Kechirasiz, natija olishda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
            }
        } catch (e) {
            console.error("Bot AI Error:", e);
            await ctx.reply("Xatolik yuz berdi. Rasmlar sifatli ekanligiga ishonch hosil qiling.");
        }
    }
});

bot.on("callback_query:data", async (ctx) => {
    if (ctx.callbackQuery.data === "reset") {
        const userId = ctx.from.id;
        if (userSessions[userId]) userSessions[userId].garmentImage = undefined;
        await ctx.answerCallbackQuery();
        await ctx.reply("Kiyim rasmini yuboring!");
    }
});

export const POST = webhookCallback(bot, "std/http");
