"use client";

import {
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    SelectChangeEvent,
} from "@mui/material";
import { ChangeEvent, ReactNode, useTransition } from "react";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/routing";

type Props = {
    children: ReactNode;
    defaultValue: string;
    label: string;
};

export default function LocaleSwitcherSelect({
    children,
    defaultValue,
    label,
}: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const [isPending, startTransition] = useTransition();

    function onSelectChange(event: SelectChangeEvent<string>) {
        const nextLocale = event.target.value;
        startTransition(() => {
            router.replace(
                // @ts-expect-error -- TypeScript will validate that only known `params`
                // are used in combination with a given `pathname`. Since the two will
                // always match for the current route, we can skip runtime checks.
                { pathname, params },
                { locale: nextLocale }
            );
        });
    }

    return (
        <div className="w-20">
            <FormControl
                fullWidth
                size="small"
                className="bg-white rounded-md shadow-sm"
            >
                <InputLabel id="locale-switcher-label">{label}</InputLabel>
                <Select
                    labelId="locale-switcher-label"
                    id="locale-select"
                    value={defaultValue}
                    label={label}
                    onChange={onSelectChange}
                    disabled={isPending}
                >
                    {children}
                </Select>
            </FormControl>
        </div>
    );
}
