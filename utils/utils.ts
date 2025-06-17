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

export const getJWT = async (): Promise<string> => {
    const session = await auth();
    return session?.user?.access_token || "";
};
