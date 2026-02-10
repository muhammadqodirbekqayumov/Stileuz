const Replicate = require("replicate");
require("dotenv").config({ path: ".env.local" });

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

async function main() {
    try {
        console.log("Fetching last 5 predictions...");
        const predictions = await replicate.predictions.list({ limit: 5 });

        // Sort by created_at desc just in case, though list usually returns newest first
        // Filter for succeeded ones
        const successful = predictions.results.filter(p => p.status === 'succeeded');

        console.log("--- RECENT SUCCESSFUL PREDICTIONS ---");
        successful.forEach(p => {
            let url = "No output URL";
            if (p.output) {
                if (typeof p.output === 'string') url = p.output;
                else if (Array.isArray(p.output) && p.output.length > 0) url = p.output[0];
                else if (typeof p.output === 'object') url = p.output.url || p.output.output || JSON.stringify(p.output);
            }

            console.log(`ID: ${p.id} | Model: ${p.model} | Created: ${p.created_at}`);
            console.log(`URL: ${url}`);
            console.log("-".repeat(30));
        });

    } catch (e) {
        console.error("Error:", e.message);
    }
}

main();
