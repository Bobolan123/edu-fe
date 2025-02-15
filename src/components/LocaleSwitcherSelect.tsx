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
        <FormControl className="">
            <Select
                size="small"
                displayEmpty
                labelId="locale-switcher-label"
                value={defaultValue}
                onChange={onSelectChange}
                className="rounded-lg border-gray-300 bg-white w-16"
                variant="outlined"
                disabled={isPending}
            >
                {children}
            </Select>
        </FormControl>
    );
}
