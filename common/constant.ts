export interface Language {
    value: string;
    label: string;
    flag: string;
}

export const LANGUAGES: Language[] = [
    { value: "English", label: "English", flag: "🇺🇸" },
    { value: "Vietnamese", label: "Tiếng Việt", flag: "🇻🇳" },
];

// Legacy: Array of language names for backward compatibility
export const LANGUAGE_NAMES = LANGUAGES.map(lang => lang.value);