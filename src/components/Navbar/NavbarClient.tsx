"use client";

import * as React from "react";
import {
    alpha,
    AppBar,
    Avatar,
    Box,
    Button,
    Container,
    Divider,
    IconButton,
    InputBase,
    ListItemIcon,
    Menu,
    MenuItem,
    styled,
    Toolbar,
    Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { 
    AccountCircle, 
    Search as SearchIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    BookmarkBorder as BookmarkIcon,
    Timeline as ActivityIcon,
    Logout as LogoutIcon
} from "@mui/icons-material";
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
    borderRadius: 25,
    backgroundColor: alpha(theme.palette.grey[100], 0.8),
    border: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
    "&:hover": {
        backgroundColor: alpha(theme.palette.grey[200], 0.8),
        borderColor: alpha(theme.palette.primary.main, 0.3),
    },
    "&:focus-within": {
        backgroundColor: "white",
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    maxWidth: 350,
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
    color: theme.palette.text.primary,
    width: "100%",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1.2, 2, 1.2, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        width: "100%",
        fontSize: "0.95rem",
        fontWeight: 400,
        "&::placeholder": {
            color: theme.palette.text.secondary,
            opacity: 0.8,
        },
        [theme.breakpoints.up("md")]: {
            width: "250px",
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

    // Remove dynamic body padding that causes flickering
    // The layout will handle proper spacing instead

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
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isMenuOpen}
            onClose={handleMenuClose}
            disableScrollLock={true}
            PaperProps={{
                elevation: 16,
                sx: {
                    mt: 1.5,
                    borderRadius: 2,
                    minWidth: 200,
                    border: `1px solid ${alpha('#000', 0.1)}`,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    zIndex: 1300,
                    '& .MuiMenuItem-root': {
                        px: 2,
                        py: 1.5,
                        fontSize: '0.95rem',
                        '&:hover': {
                            backgroundColor: alpha('#1976d2', 0.08),
                        },
                    },
                },
            }}
            MenuListProps={{
                sx: {
                    py: 0,
                }
            }}
        >
            {/* User Profile Header */}
            <Box sx={{ px: 2, py: 2, borderBottom: `1px solid ${alpha('#000', 0.08)}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        src={(session?.user as any)?.avatar_url || (session?.user as any)?.profile_picture}
                        sx={{ width: 40, height: 40 }}
                    >
                        {(session?.user as any)?.name?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                            {(session?.user as any)?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {session?.user?.email}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            
            <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                    <SchoolIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <Link href="/my-courses" style={{ textDecoration: 'none', color: 'inherit' }}>
                    {t("my_courses")}
                </Link>
            </MenuItem>
            
            <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                    <BookmarkIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <Link href="/my-learning" style={{ textDecoration: 'none', color: 'inherit' }}>
                    {t("my_learning")}
                </Link>
            </MenuItem>
            
            <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                    <ActivityIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <Link href="/my-activity" style={{ textDecoration: 'none', color: 'inherit' }}>
                    {t("my_activity")}
                </Link>
            </MenuItem>
            
            <Divider sx={{ my: 1 }} />
            
            <MenuItem onClick={() => { signOut(); handleMenuClose(); }}>
                <ListItemIcon>
                    <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                <Typography color="error">{t("logout")}</Typography>
            </MenuItem>
        </Menu>
    );

    return (
        <Box
            data-navbar="true"
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                width: '100%',
                zIndex: 1150,
                boxShadow: isScrolled ? '0 2px 20px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.05)',
                backgroundColor: 'white',
                borderBottom: `1px solid ${alpha('#000', isScrolled ? 0.1 : 0.05)}`,
                transition: 'all 0.2s ease-in-out',
            }}
        >
            <AppBar
                position="static"
                sx={{ 
                    backgroundColor: "transparent", 
                    color: "text.primary",
                    boxShadow: 'none',
                }}
            >
                <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
                    <Toolbar sx={{ 
                        px: 0, 
                        minHeight: 76,
                        height: 76,
                        alignItems: 'center',
                        display: 'flex',
                        width: '100%'
                    }}>
                        {/* Left Section - Logo + Navigation + Search */}
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: '1 1 auto' }}>
                            {/* Logo */}
                            <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
                                <Image 
                                    src="/logo.png" 
                                    width={70} 
                                    height={70} 
                                    alt="Logo" 
                                    style={{ cursor: 'pointer' }}
                                />
                            </Link>

                            {/* Desktop Navigation */}
                            <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 3, gap: 1 }}>
                                <Link href="/" style={{ textDecoration: 'none' }}>
                                    <Button 
                                        sx={{ 
                                            color: 'text.primary',
                                            fontWeight: 500,
                                            px: 2.5,
                                            py: 1,
                                            borderRadius: 2,
                                            '&:hover': {
                                                backgroundColor: alpha('#1976d2', 0.08),
                                                color: 'primary.main'
                                            }
                                        }}
                                    >
                                        {t("home")}
                                    </Button>
                                </Link>
                                <Link href="/courses" style={{ textDecoration: 'none' }}>
                                    <Button 
                                        sx={{ 
                                            color: 'text.primary',
                                            fontWeight: 500,
                                            px: 2.5,
                                            py: 1,
                                            borderRadius: 2,
                                            '&:hover': {
                                                backgroundColor: alpha('#1976d2', 0.08),
                                                color: 'primary.main'
                                            }
                                        }}
                                    >
                                        {t("course")}
                                    </Button>
                                </Link>
                            </Box>

                            <Box sx={{ display: { xs: 'none', sm: 'block' }, ml: 3 }}>
                                <Search>
                                    <SearchIconWrapper>
                                        <SearchIcon sx={{ color: 'text.secondary' }} />
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        placeholder={t("search")}
                                        inputProps={{ "aria-label": "search" }}
                                    />
                                </Search>
                            </Box>
                        </Box>

                        {/* Right Section */}
                        {status !== "loading" && (
                            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: 'center', gap: 1.5 }}>
                                <LocaleSwitcher />
                                <CurrencySelector />
                                
                                {status === "authenticated" ? (
                                    <>
                                        <CartDropdown cartItems={cart?.cartItems} />
                                        <IconButton
                                            onClick={handleProfileMenuOpen}
                                            sx={{
                                                ml: 1,
                                                p: 0.5,
                                                border: `2px solid transparent`,
                                                borderRadius: '50%',
                                                '&:hover': {
                                                    borderColor: alpha('#1976d2', 0.3),
                                                }
                                            }}
                                            aria-label="account menu"
                                            aria-controls={menuId}
                                            aria-haspopup="true"
                                        >
                                            <Avatar
                                                src={(session?.user as any)?.avatar_url || (session?.user as any)?.profile_picture}
                                                sx={{ width: 36, height: 36 }}
                                            >
                                                {(session?.user as any)?.name?.[0]?.toUpperCase() || <PersonIcon />}
                                            </Avatar>
                                        </IconButton>
                                    </>
                                ) : (
                                    <Box sx={{ display: 'flex', gap: 1.5, ml: 1 }}>
                                        <Link href="/login" style={{ textDecoration: 'none' }}>
                                            <Button 
                                                variant="outlined" 
                                                size="medium"
                                                sx={{ 
                                                    borderRadius: 2,
                                                    px: 2.5,
                                                    py: 1,
                                                    fontWeight: 500,
                                                    borderWidth: 1.5,
                                                    '&:hover': {
                                                        borderWidth: 1.5,
                                                    }
                                                }}
                                            >
                                                {t("login")}
                                            </Button>
                                        </Link>
                                        <Link href="/signup" style={{ textDecoration: 'none' }}>
                                            <Button 
                                                variant="contained" 
                                                size="medium"
                                                sx={{ 
                                                    borderRadius: 2,
                                                    px: 2.5,
                                                    py: 1,
                                                    fontWeight: 500,
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                    '&:hover': {
                                                        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                                                    },
                                                }}
                                            >
                                                {t("signup")}
                                            </Button>
                                        </Link>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>
            {renderMenu}
        </Box>
    );
}
