import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, status, output, error } = body;

        console.log(`Webhook received for prediction ${id}: ${status}`);

        if (error) {
            console.error("Prediction failed:", error);
            // Update functionality to handle error state in DB if you are storing predictions there
            return NextResponse.json({ received: true }, { status: 200 });
        }

        if (status === "succeeded") {
            const outputUrl = output; // IDM-VTON usually returns a single URL string or array
            console.log("Generated Image URL:", outputUrl);

            // TODO: Here you can update your database if you track prediction IDs.
            // For now, we are just logging it, as the frontend might be polling Replicate directly
            // or using the prediction ID to fetch status.
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (err) {
        console.error("Webhook Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
