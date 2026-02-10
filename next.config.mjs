/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: ["localhost:3000", "192.168.121.186:3000"]
        }
    },
    // Allow images from Replicate and Placehold.co
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "replicate.delivery",
            },
            {
                protocol: "https",
                hostname: "replicate.com",
            },
            {
                protocol: "https",
                hostname: "placehold.co",
            }
        ]
    }
};

export default nextConfig;
