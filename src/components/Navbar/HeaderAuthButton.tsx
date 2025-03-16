import { useSession } from "next-auth/react";
import { Button, IconButton } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Link from "next/link";
import { useLocale } from "next-intl";
interface HeaderAuthButtonProps {
    handleProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
    menuId: string;
}

export default function HeaderAuthButton({
    handleProfileMenuOpen,
    menuId,
}: HeaderAuthButtonProps) {
    const { data: session, status } = useSession();
    const locale = useLocale();
    if (status === "loading") {
        return null;
    }

    return session?.user ? (
        <IconButton
            size="medium"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
        >
            <AccountCircle />
        </IconButton>
    ) : (
        <>
            <Button variant="outlined">
                <Link href={`/${locale}/login`} passHref>
                    Login
                </Link>
            </Button>
            <Button variant="contained">
                <Link href={`/${locale}/signup`} passHref>
                    Signup
                </Link>
            </Button>
        </>
    );
}
