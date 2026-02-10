import { replicate } from "../app/lib/replicate";

export interface VtonInput {
    humanImage: string; // URL or Base64
    garmentImage: string; // URL or Base64
    category: string;
    description?: string;
    brandId?: string;
}

export async function startVton(input: VtonInput) {
    const { humanImage, garmentImage, category, description = "clothing" } = input;

    // Use the same enhanced prompt logic as the API
    let finalPrompt = `${description}, raw photo, masterpiece, realistic texture, 8k, photorealistic, shot on dslr, fujifilm, natural lighting, correct anatomy, proportional body, maintain height, perfect fit, natural drape, crisp fabric, unwrinkled, maintain original garment details, exact texture match`;

    if (description.includes("full outfit")) {
        finalPrompt += ", fashion stylist recommendation, complementary colors, cohesive luxury look, matching material";
    }

    return await replicate.predictions.create({
        version: "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
        input: {
            human_img: humanImage,
            garm_img: garmentImage,
            garment_des: finalPrompt,
            category: category,
            crop: false,
            steps: 40,
            force_dc: true,
            negative_prompt: "cartoon, anime, illustration, painting, 3d render, plastic, fake, bad texture, squashed body, compressed height, distorted proportions, short legs, ugly, blurry",
        },
    });
}

export async function pollPrediction(id: string) {
    let prediction;
    do {
        await new Promise(r => setTimeout(r, 3000));
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/predictions/${id}`);
        prediction = await res.json();
    } while (prediction.status !== "succeeded" && prediction.status !== "failed" && prediction.status !== "canceled");

    return prediction;
}
