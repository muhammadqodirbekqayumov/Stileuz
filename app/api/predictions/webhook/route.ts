import { NextRequest, NextResponse } from "next/server";
import { Bot } from "grammy";

const token = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(req: NextRequest) {
    if (!token) return NextResponse.json({ error: "No bot token" }, { status: 500 });

    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) return NextResponse.json({ error: "No chatId" }, { status: 400 });

    try {
        const body = await req.json();
        console.log("Replicate Webhook received for chat:", chatId, body.status);

        if (body.status === "succeeded") {
            const bot = new Bot(token);
            const aiResult = Array.isArray(body.output) ? body.output[0] : body.output;

            // 1. APPLY WATERMARK
            let finalImage = aiResult;
            try {
                const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://stileuz.vercel.app";
                const watermarkRes = await fetch(`${siteUrl}/api/predictions/process`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        imageUrl: aiResult,
                        logoUrl: `${siteUrl}/brands/adamari-logo.png`
                    })
                });
                const wData = await watermarkRes.json();
                if (wData.watermarkedImage) finalImage = wData.watermarkedImage;
            } catch (e) {
                console.error("Watermark failed in webhook:", e);
            }

            // 2. SEND TO TELEGRAM
            await bot.api.sendPhoto(chatId, finalImage, {
                caption: "Tayyor! Adamari kiyimi sizga juda yarashdi. 😍\n\nSotib olish uchun: @adamaricommunitymanager",
                reply_markup: {
                    inline_keyboard: [[
                        { text: "🛒 Sotib olish", url: "https://t.me/adamaricommunitymanager" },
                        { text: "🔄 Boshqasini ko'rish", callback_data: "reset" }
                    ]]
                }
            });
        } else if (body.status === "failed") {
            const bot = new Bot(token);
            await bot.api.sendMessage(chatId, "Kechirasiz, rasm tayyorlashda xatolik yuz berdi. Iltimos, boshqa rasm bilan urinib ko'ring.");
        }

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
