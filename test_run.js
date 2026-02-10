const Replicate = require("replicate");
require("dotenv").config({ path: ".env.local" });

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

async function main() {
    const version = "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985";
    console.log(`Testing cuuupid/idm-vton:${version}`);

    try {
        // Just a dummy run to see if it accepts the version. 
        // Inputs don't matter much for the "Invalid Version" error, 
        // but better to provide minimal valid structure.
        // We'll just catch the error.
        await replicate.run(
            `cuuupid/idm-vton:${version}`,
            {
                input: {
                    // Providing dummy data URIs might trigger validation error, 
                    // but if version is wrong it should fail BEFORE validation.
                    human_img: "https://replicate.delivery/pbxt/K9jV.../human.jpg",
                    garm_img: "https://replicate.delivery/pbxt/K9jV.../garment.jpg",
                    steps: 1
                }
            }
        );
        console.log("✅ Run initiated successfully (or at least passed version check)");
    } catch (e) {
        console.log("❌ RUN FAILED:");
        console.log(e.message);
    }
}

main();
