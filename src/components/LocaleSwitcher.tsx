  import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";
import { MenuItem } from "@mui/material";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={t("label")}>
      {routing.locales.map((cur) => (
        <MenuItem key={cur} value={cur} className="capitalize">
          {t("locale", { locale: cur })}
        </MenuItem>
      ))}
    </LocaleSwitcherSelect>
  );
}
