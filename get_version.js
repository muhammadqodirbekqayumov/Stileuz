const Replicate = require("replicate");
require("dotenv").config({ path: ".env.local" });

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

async function main() {
    const models = [
        { owner: "kcaverly", name: "idm-vton" },
        { owner: "camenduru", name: "idm-vton" },
        { owner: "yisol", name: "idm-vton" },
        { owner: "cuuupid", name: "idm-vton" }
    ];

    for (const m of models) {
        try {
            console.log(`Checking ${m.owner}/${m.name}...`);
            const model = await replicate.models.get(m.owner, m.name);
            if (model && model.latest_version) {
                console.log(`✅ FOUND: ${m.owner}/${m.name}:${model.latest_version.id}`);
            }
        } catch (e) {
            console.log(`❌ Failed ${m.owner}/${m.name}: ${e.message}`);
        }
    }
}

main();
