const Replicate = require("replicate");
require("dotenv").config({ path: ".env.local" });

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

async function main() {
    try {
        const modelId = "cuuupid/idm-vton";
        const versionId = "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985";

        console.log(`Fetching schema for ${modelId}...`);
        const version = await replicate.models.versions.get("cuuupid", "idm-vton", versionId);

        console.log("--- INPUT SCHEMA ---");
        console.log(JSON.stringify(version.openapi_schema?.components?.schemas?.Input, null, 2));
    } catch (e) {
        console.error("Error:", e.message);
    }
}

main();
