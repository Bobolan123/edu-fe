import { auth } from "@/auth";

export const IsValidEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

export function extractIds<T extends { id: number }>(objects: T[]): number[] {
    return objects.map((obj) => obj.id);
}

export const slugify = (title: string) =>
    title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

// Fetch real-time USD to VND exchange rate
export async function getExchangeRateVND(to: string): Promise<number> {
    const res = await fetch("https://open.er-api.com/v6/latest/VND");
    const data = await res.json();

    const rate = data.rates[to];
    if (!rate) throw new Error(`Unable to retrieve exchange rate for ${to}`);

    return rate || 1;
}

// Convert currency between USD and VND
export async function exchangeCurrency(
    amount: number,
    from: "USD" | "VND",
    to: "USD" | "VND",
    rateOverride?: number
): Promise<number> {
    if (from === to) return amount;
    const rate = rateOverride ?? (await getExchangeRateVND("USD"));
    return to === "USD" ? amount / rate : amount * rate;
}

// Format currency based on locale
export const formatCurrency = (amount: number, currency: string): string => {
    return currency === "VND" || currency === "vi"
        ? `₫${amount.toLocaleString("vi-VN")}`
        : `$${amount.toFixed(2)}`;
};
