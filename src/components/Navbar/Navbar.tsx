"use client";

import * as React from "react";
import {
    alpha,
    AppBar,
    Box,
    Button,
    IconButton,
    InputBase,
    Menu,
    MenuItem,
    styled,
    Toolbar,
    Typography,
} from "@mui/material";
import { AccountCircle, Search as SearchIcon } from "@mui/icons-material";
import LocaleSwitcher from "./LocaleSwitcher";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { signOut, useSession } from "next-auth/react";
import Cart from "./cart/Cart";

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: 20,
    backgroundColor: alpha(theme.palette.grey[500], 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.grey[600], 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
    },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
}));

export default function Navbar() {
    const { data: session, status } = useSession();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const t = useTranslations("Navbar");

    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const menuId = "primary-search-account-menu";
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem>
                <Link href="/my-courses">{t("my_courses")}</Link>
            </MenuItem>
            <MenuItem>
                <Link href="/my-learning">{t("my_learning")}</Link>
            </MenuItem>
            <MenuItem>
                <Link href="/my-activity">{t("my_activity")}</Link>
            </MenuItem>
            <MenuItem onClick={() => signOut()}>{t("logout")}</MenuItem>
        </Menu>
    );

    return (
        <Box>
            <AppBar
                position="static"
                sx={{ backgroundColor: "white", color: "black" }}
            >
                <Toolbar>
                    <Image src="/logo.png" width={90} height={90} alt="Logo" />

                    <div className="flex justify-center items-center gap-3">
                        <Typography variant="button">
                            <Link href="/">{t("home")}</Link>
                        </Typography>
                        <Link href="/courses">
                            <Typography variant="button">
                                {t("course")}
                            </Typography>
                        </Link>
                    </div>

                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder={t("search")}
                            inputProps={{ "aria-label": "search" }}
                        />
                    </Search>

                    <Box sx={{ flexGrow: 1 }} />

                    {status !== "loading" && (
                        <Box
                            key={status}
                            sx={{ display: { xs: "none", md: "flex" } }}
                        >
                            <div className="flex justify-center items-center gap-3">
                                {status === "authenticated" ? (
                                    <>
                                        <Cart />
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
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login">
                                            <Button variant="outlined">
                                                {t("login")}
                                            </Button>
                                        </Link>
                                        <Link href="/register">
                                            <Button variant="contained">
                                                {t("signup")}
                                            </Button>
                                        </Link>
                                    </>
                                )}
                                <LocaleSwitcher />
                            </div>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
            {renderMenu}
        </Box>
    );
}
