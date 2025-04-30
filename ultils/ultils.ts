export const IsValidEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

export function extractIds<T extends { id: number }>(objects: T[]): number[] {
    return objects.map(obj => obj.id);
  }
  