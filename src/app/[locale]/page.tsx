import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button, Typography } from "@mui/material";

export default function HomePage() {
    const t = useTranslations("Home");
    return (
        <div>
            <Typography variant="h1" component="h2">
                {t("home")}
            </Typography>
            <Button variant="contained" className="!bg-red-800">
                ok
            </Button>
           
        </div>
    );
}
