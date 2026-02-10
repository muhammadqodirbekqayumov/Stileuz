import { NextRequest, NextResponse } from "next/server";
import { createCanvas, loadImage } from "canvas";

export async function POST(req: NextRequest) {
    try {
        const { imageUrl, logoUrl } = await req.json();

        if (!imageUrl || !logoUrl) {
            return NextResponse.json({ error: "Missing images" }, { status: 400 });
        }

        // Load images
        const mainImage = await loadImage(imageUrl);
        const logo = await loadImage(logoUrl);

        // Setup canvas
        const canvas = createCanvas(mainImage.width, mainImage.height);
        const ctx = canvas.getContext("2d");

        // Draw main image
        ctx.drawImage(mainImage, 0, 0);

        // Calculate logo size (e.g., 10% of width)
        const logoWidth = mainImage.width * 0.15;
        const logoHeight = (logo.height / logo.width) * logoWidth;

        // Draw logo (Bottom right)
        ctx.globalAlpha = 0.8;
        ctx.drawImage(
            logo,
            mainImage.width - logoWidth - 40,
            mainImage.height - logoHeight - 40,
            logoWidth,
            logoHeight
        );

        // Convert to data URL
        const watermarkedImage = canvas.toDataURL("image/png");

        return NextResponse.json({ watermarkedImage });
    } catch (err: any) {
        console.error("Watermark error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
