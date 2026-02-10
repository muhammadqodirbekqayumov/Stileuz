export interface BrandConfig {
    id: string;
    name: string;
    logoUrl: string;
    primaryColor: string;
    telegramUser: string; // For "Buy" button
    welcomeMessage?: string;
}

export const BRANDS: Record<string, BrandConfig> = {
    "adamari": {
        id: "adamari",
        name: "Adamari",
        logoUrl: "/brands/adamari-logo.png", // We'll need to add a placeholder or real logo
        primaryColor: "#BF953F",
        telegramUser: "adamaricommunitymanager",
        welcomeMessage: "Adamari kiyimlarini biz bilan kiyib ko'ring!"
    },
    "terra-pro": {
        id: "terra-pro",
        name: "Terra Pro",
        logoUrl: "/brands/terra-logo.png",
        primaryColor: "#000000",
        telegramUser: "terrapro_bot",
        welcomeMessage: "Terra Pro yangi kolleksiyasi!"
    },
    // Default system branding
    "stiluz": {
        id: "stiluz",
        name: "Stiluz",
        logoUrl: "/logo.png",
        primaryColor: "#BF953F",
        telegramUser: "stiluz_support",
    }
};

export function getBrand(id: string | null): BrandConfig {
    if (!id || !BRANDS[id.toLowerCase()]) {
        return BRANDS["stiluz"];
    }
    return BRANDS[id.toLowerCase()];
}
