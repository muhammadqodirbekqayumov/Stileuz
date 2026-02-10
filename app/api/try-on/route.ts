import { NextResponse } from "next/server";
import { replicate } from "../../lib/replicate";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const humanImage = formData.get("human_image") as File;
        const garmentImage = formData.get("garm_img") as File;

        if (!humanImage || !garmentImage) {
            return NextResponse.json(
                { error: "Missing images" },
                { status: 400 }
            );
        }

        const humanBuffer = await humanImage.arrayBuffer();
        const garmentBuffer = await garmentImage.arrayBuffer();

        const humanBase64 = `data:${humanImage.type};base64,${Buffer.from(humanBuffer).toString('base64')}`;
        const garmentBase64 = `data:${garmentImage.type};base64,${Buffer.from(garmentBuffer).toString('base64')}`;

        const category = formData.get("category") as string || "upper_body";
        const userDesc = formData.get("description") as string || "clothing";
        // FORCE REALISM: Append high-quality prompts to user input
        const description = `${userDesc}, high quality, realistic texture, 8k, highly detailed, photorealistic, professional photography`;

        console.log("Starting prediction...");
        console.log(`Params: Category=${category}, Desc=${description}`);

        // Step 1: Generate Try-On
        const vtonOutput = await replicate.run(
            "cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
            {
                input: {
                    human_img: humanBase64,
                    garm_img: garmentBase64,
                    garment_des: description,
                    category: category,
                    crop: false,
                    steps: 30, // Keep standard steps, let upscaler handle quality
                    force_dc: false,
                    mask_only: false,
                },
            }
        );

        console.log("Step 1 (Try-On) Success:", vtonOutput);

        // Helper to extract URL safely from Step 1
        const getUrl = (out: any) => {
            if (typeof out === 'string') return out;
            if (Array.isArray(out) && out.length > 0) return out[0];
            if (typeof out === 'object' && out?.url) return out.url;
            if (typeof out === 'object' && out?.output) return out.output;
            return null;
        };

        const vtonUrl = getUrl(vtonOutput);

        if (!vtonUrl) {
            throw new Error("Try-On generation failed to return a valid image URL.");
        }

        console.log("Starting Step 2: HD Upscaling (Face Enhance)...");

        // Step 2: Upscale & Enhance
        const upscaleOutput = await replicate.run(
            "nightmareai/real-esrgan:b3ef194191d13140337468c916c2c5b96dd0cb06dffc032a022a31807f6a5ea8",
            {
                input: {
                    image: vtonUrl,
                    scale: 2,           // 2x Zoom for HD
                    face_enhance: true  // Critical for "Model" look
                }
            }
        );

        console.log("Step 2 (Upscale) Success:", upscaleOutput);

        // Return the UPSCALED image as the final output
        return NextResponse.json({ output: upscaleOutput });
    } catch (error: any) {
        console.error("Try-On API Error Detailed:", error);

        let errorMessage = error.message || "Unknown error";

        if (error.response) {
            try {
                const errorData = await error.response.json();
                console.error("Replicate Error Data:", errorData);
                errorMessage = JSON.stringify(errorData);
            } catch (jsonError) {
                try {
                    errorMessage = await error.response.text();
                    console.error("Replicate Error Text:", errorMessage);
                } catch (textError) {
                    console.error("Could not read error response");
                }
            }
        }

        // Translate common errors for the user
        if (errorMessage.includes("402") || errorMessage.includes("Insufficient credit")) {
            errorMessage = "To'lov (Billing) xatoligi: Balansda mablag' yetarli emas yoki karta tasdiqlanmagan. Iltimos Replicate billing bo'limini tekshiring.";
        } else if (errorMessage.includes("422") || errorMessage.includes("Invalid version")) {
            errorMessage = "Model versiyasi xatosi (Dasturchi buni to'g'irlashi kerak).";
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
