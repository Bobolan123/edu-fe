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


export function isValidCloudinaryVideoUrl(url: string | null | undefined): boolean {
    // 1. Ensure the URL is a non-empty string
    if (!url) {
      return false;
    }
  
    try {
      const parsedUrl = new URL(url);
  
      // 2. Enforce the hostname is exactly 'res.cloudinary.com'
      if (parsedUrl.hostname !== 'res.cloudinary.com') {
        return false;
      }
  
      // 3. Enforce HTTPS protocol, as Cloudinary resources are served securely
      if (parsedUrl.protocol !== 'https:') {
        return false;
      }
  
      // 4. Check that the path structure contains '/video/upload/'
      // This is characteristic of Cloudinary video URLs.
      if (!parsedUrl.pathname.includes('/video/upload/')) {
          return false;
      }
  
      // 5. Define a list of common video extensions
      const videoExtensions = ['.mp4', '.mov', '.webm', '.avi', '.mkv', '.ogg', '.flv'];
      
      // 6. Check if the URL's pathname ends with one of the video extensions
      const pathname = parsedUrl.pathname.toLowerCase();
      return videoExtensions.some(ext => pathname.endsWith(ext));
  
    } catch (error) {
      // If new URL() fails, it's not a valid URL.
      return false;
    }
  }
  