"use client";

import React from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Badge,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import {
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    Settings as SettingsIcon,
    ExitToApp as LogoutIcon,
    Person as PersonIcon,
} from "@mui/icons-material";
import { signOut } from "next-auth/react";
import { useLocale } from "next-intl";

interface AdminMobileHeaderProps {
    onMenuClick: () => void;
}

const AdminMobileHeader: React.FC<AdminMobileHeaderProps> = ({ onMenuClick }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const locale = useLocale();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        handleProfileMenuClose();
        await signOut({ callbackUrl: `/${locale}` });
    };

    if (!isMobile) return null;

    return (
        <>
            <AppBar 
                position="fixed" 
                sx={{ 
                    zIndex: theme.zIndex.drawer + 1,
                    backgroundColor: "background.paper",
                    color: "text.primary",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    borderBottom: "1px solid",
                    borderColor: "grey.200"
                }}
                className="bg-white/95 backdrop-blur-sm"
            >
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <IconButton
                            edge="start"
                            onClick={onMenuClick}
                            sx={{ 
                                color: "text.primary",
                                backgroundColor: "grey.100",
                                "&:hover": {
                                    backgroundColor: "primary.light",
                                    color: "primary.main"
                                }
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography 
                            variant="h6" 
                            fontWeight="bold"
                            sx={{
                                background: "linear-gradient(135deg, #1e293b, #475569)",
                                backgroundClip: "text",
                                color: "transparent"
                            }}
                        >
                            Admin Panel
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconButton
                            sx={{
                                color: "text.primary",
                                "&:hover": {
                                    backgroundColor: "warning.light",
                                    color: "warning.main"
                                }
                            }}
                        >
                            <Badge badgeContent={3} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>

                        <IconButton
                            onClick={handleProfileMenuOpen}
                            sx={{
                                p: 0,
                                ml: 1,
                                "&:hover": {
                                    transform: "scale(1.05)"
                                },
                                transition: "transform 0.2s ease"
                            }}
                        >
                            <Avatar 
                                sx={{ 
                                    width: 36, 
                                    height: 36,
                                    bgcolor: "primary.main",
                                    border: "2px solid",
                                    borderColor: "primary.light"
                                }}
                            >
                                A
                            </Avatar>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Profile Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                onClick={handleProfileMenuClose}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        mt: 1.5,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "grey.200",
                        "& .MuiMenuItem-root": {
                            px: 2,
                            py: 1,
                            borderRadius: 1,
                            mx: 1,
                            mb: 0.5,
                            "&:hover": {
                                backgroundColor: "action.hover"
                            }
                        }
                    }
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" fontWeight="600">
                        Admin User
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        admin@eduplatform.com
                    </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                
                <MenuItem onClick={handleProfileMenuClose}>
                    <PersonIcon sx={{ mr: 2, fontSize: 20 }} />
                    Profile
                </MenuItem>
                
                <MenuItem onClick={handleProfileMenuClose}>
                    <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
                    Settings
                </MenuItem>
                
                <Divider sx={{ my: 1 }} />
                
                <MenuItem 
                    onClick={handleLogout}
                    sx={{ 
                        color: "error.main",
                        "&:hover": {
                            backgroundColor: "error.light",
                            color: "error.dark"
                        }
                    }}
                >
                    <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
                    Logout
                </MenuItem>
            </Menu>

            {/* Spacer for fixed AppBar */}
            <Toolbar />
        </>
    );
};

export default AdminMobileHeader;