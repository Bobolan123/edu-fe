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
import { useState, useEffect } from "react";
import { AccountCircle, Search as SearchIcon } from "@mui/icons-material";
import LocaleSwitcher from "./LocaleSwitcher";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { signOut, useSession } from "next-auth/react";
import CartDropdown from "./cart/CartDropdown";
import { ICart, ICartItem } from "../../../types/entities";
import CurrencySelector from "./CurrencySelector";

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

interface INavbarClientProps {
    cart: ICart;
}
export default function NavbarClient({ cart }: INavbarClientProps) {
    const { data: session, status } = useSession();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const t = useTranslations("Navbar");

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 50);
        };

        // Throttle scroll events for better performance
        let ticking = false;
        const throttledHandleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledHandleScroll, { passive: true });
        return () => window.removeEventListener('scroll', throttledHandleScroll);
    }, []);

    // Add padding to body when navbar becomes fixed to prevent content jump
    useEffect(() => {
        if (isScrolled) {
            document.body.style.paddingTop = '112px'; // Approximate navbar height
        } else {
            document.body.style.paddingTop = '0';
        }
        
        return () => {
            document.body.style.paddingTop = '0';
        };
    }, [isScrolled]);

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
        <Box
            sx={{
                position: isScrolled ? 'fixed' : 'static',
                top: 0,
                left: 0,
                right: 0,
                width: '100%',
                zIndex: 1150,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isScrolled ? 'translateY(0)' : 'translateY(0)',
                boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.15)' : 'none',
                backdropFilter: isScrolled ? 'blur(10px)' : 'none',
                backgroundColor: isScrolled ? 'rgba(255,255,255,0.95)' : 'white'
            }}
        >
            <AppBar
                position="static"
                sx={{ 
                    backgroundColor: "transparent", 
                    color: "black", 
                    paddingX: 2,
                    boxShadow: 'none',
                    borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
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
                                <LocaleSwitcher />
                                <CurrencySelector />
                                {status === "authenticated" ? (
                                    <>
                                        <CartDropdown
                                            cartItems={cart?.cartItems}
                                        />
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
                                        <Link href="/signup">
                                            <Button variant="contained">
                                                {t("signup")}
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
            {renderMenu}
        </Box>
    );
}
