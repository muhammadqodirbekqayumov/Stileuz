export interface UserMeasurements {
    height_cm: number;
    weight_kg: number;
    chest_cm?: number;
    waist_cm?: number;
    hips_cm?: number;
    body_shape?: 'athletic' | 'regular' | 'round';
}

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL';

export function calculateRecommendedSize(measurements: UserMeasurements): { size: Size, confidence: number, note?: string } {
    const { height_cm, weight_kg } = measurements;

    // Basic BMI-like heuristic for Men's clothing (Adamari focus)
    // This is a simplified logic. In production, this should check the specific Product's Sizing Chart if available.

    let baseSize: Size = 'M';
    let confidence = 0.8;

    // Adjusted for Adamari (Menswear) - slightly slimmer fit preference or sizing up
    if (weight_kg < 55) baseSize = 'XS';
    else if (weight_kg < 65) baseSize = 'S';
    else if (weight_kg < 73) baseSize = 'M'; // 65-72kg
    else if (weight_kg < 83) baseSize = 'L'; // 73-82kg (User 75kg fits here)
    else if (weight_kg < 92) baseSize = 'XL';
    else if (weight_kg < 105) baseSize = 'XXL';
    else baseSize = '3XL';

    // Height adjustment
    // If very tall but light, might need to size up for length (or specific tall sizes)
    // If very short but heavy, might need to size up for width but warn about length.

    if (height_cm > 190 && ['S', 'M'].includes(baseSize)) {
        baseSize = 'L'; // Force size up for length
        confidence = 0.7;
        return { size: baseSize, confidence, note: "Sizing up for length due to height." };
    }

    if (height_cm < 165 && ['XL', 'XXL'].includes(baseSize)) {
        return { size: baseSize, confidence: 0.7, note: "Might be long in sleeves/legs." };
    }

    return { size: baseSize, confidence, note: "Based on standard fit." };
}
