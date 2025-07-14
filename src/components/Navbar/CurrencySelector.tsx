"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useTranslations } from "next-intl";

const supportedCurrencies= {
    VND:"VND",
    USD:"USD"
}
export default function CurrencySelector() {
    const { currency, setCurrency } = useCurrency();
    const t = useTranslations("Currency");

    return (
        <div className="w-30">
            <FormControl
                fullWidth
                size="small"
                className="bg-white rounded-md shadow-sm"
            >
                <InputLabel id="currency-select-label">{t("label")}</InputLabel>
                <Select
                    labelId="currency-select-label"
                    id="currency-select"
                    value={currency}
                    label={t("label")}
                    onChange={(e) => setCurrency(e.target.value as any)}
                >
                    {Object.entries(supportedCurrencies).map(([key, value]) => (
                        <MenuItem key={key} value={value}>
                            {value}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
