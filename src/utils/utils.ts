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

/**
 * Extracts course ID from slug format: "course-name-123" -> "123"
 * @param slug - The URL slug containing the ID at the end
 * @returns The extracted ID or null if not found
 */
export const extractIdFromSlug = (slug: string): string | null => {
    const match = slug.match(/-(\d+)$/);
    return match ? match[1] : null;
};

/**
 * Creates a slug with ID appended: "Course Name" + 123 -> "course-name-123"
 * @param title - The course title
 * @param id - The course ID
 * @returns The slug with ID appended
 */
export const createSlugWithId = (title: string, id: number | string): string => {
    return `${slugify(title)}-${id}`;
};

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

export function isValidYouTubeUrl(url: string | null | undefined): boolean {
    if (!url) return false;
    
    try {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname.toLowerCase();
        
        // Check for various YouTube domains
        const youtubeHosts = [
            'www.youtube.com',
            'youtube.com',
            'youtu.be',
            'm.youtube.com'
        ];
        
        if (!youtubeHosts.includes(hostname)) {
            return false;
        }
        
        // For youtu.be format, check if there's a video ID in the path
        if (hostname === 'youtu.be') {
            return parsedUrl.pathname.length > 1;
        }
        
        // For regular YouTube URLs, check for video ID parameter
        if (hostname.includes('youtube.com')) {
            return parsedUrl.searchParams.has('v') || parsedUrl.pathname.includes('/embed/');
        }
        
        return false;
    } catch (error) {
        return false;
    }
}

export function getVideoType(url: string | null | undefined): 'youtube' | 'cloudinary' | 'unknown' {
    if (isValidYouTubeUrl(url)) return 'youtube';
    if (isValidCloudinaryVideoUrl(url)) return 'cloudinary';
    return 'unknown';
}

export function getYouTubeEmbedUrl(url: string): string | null {
    try {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname.toLowerCase();

        if (hostname === 'youtube') {
            const videoId = parsedUrl.pathname.slice(1);
            return `https://www.youtube.com/embed/${videoId}`;
        }

        if (hostname.includes('youtube.com')) {
            const videoId = parsedUrl.searchParams.get('v');
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }

            if (parsedUrl.pathname.includes('/embed/')) {
                return url;
            }
        }

        return null;
    } catch (error) {
        return null;
    }
}

/**
 * Converts SRT subtitle format to WebVTT format
 * @param srtContent - The SRT file content as a string
 * @returns The converted VTT content
 */
export function convertSrtToVtt(srtContent: string): string {
    // Add WEBVTT header
    let vttContent = 'WEBVTT\n\n';

    // Replace comma with dot in timestamps (00:00:01,000 -> 00:00:01.000)
    vttContent += srtContent.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');

    return vttContent;
}

/**
 * Checks if a URL points to an SRT file
 * @param url - The caption file URL
 * @returns True if the URL contains .srt (before query parameters)
 */
export function isSrtFile(url: string | null | undefined): boolean {
    if (!url) return false;

    // Remove query parameters and check if it ends with .srt
    const urlWithoutQuery = url.split('?')[0];
    return urlWithoutQuery.toLowerCase().endsWith('.srt');
}

/**
 * Fetches and converts an SRT file to VTT format, returning a blob URL
 * @param srtUrl - The URL of the SRT file
 * @returns A blob URL for the converted VTT content, or null on error
 */
export async function convertSrtUrlToVttBlob(srtUrl: string): Promise<string | null> {
    try {
        const response = await fetch(srtUrl);

        if (!response.ok) {
            console.error('[convertSrtUrlToVttBlob] Failed to fetch SRT file:', response.status);
            return null;
        }

        const srtContent = await response.text();
        const vttContent = convertSrtToVtt(srtContent);

        // Create a blob URL for the VTT content
        const blob = new Blob([vttContent], { type: 'text/vtt' });
        const blobUrl = URL.createObjectURL(blob);

        return blobUrl;
    } catch (error) {
        console.error('[convertSrtUrlToVttBlob] Error converting SRT to VTT:', error);
        return null;
    }
}
