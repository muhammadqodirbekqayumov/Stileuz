const Replicate = require("replicate");
require("dotenv").config({ path: ".env.local" });

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

async function main() {
    try {
        console.log("Fetching schema for nightmareai/real-esrgan...");
        const model = await replicate.models.get("nightmareai", "real-esrgan");
        const latestVersion = await replicate.models.versions.get("nightmareai", "real-esrgan", model.latest_version.id);

        console.log("--- UPSCALER INPUT SCHEMA ---");
        console.log(JSON.stringify(latestVersion.openapi_schema?.components?.schemas?.Input, null, 2));
    } catch (e) {
        console.error("Error:", e.message);
    }
}

main();
