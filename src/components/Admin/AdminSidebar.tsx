"use client";

import React, { useState } from "react";
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    useTheme,
    useMediaQuery,
    IconButton,
    Collapse,
    Badge,
    Avatar,
} from "@mui/material";
import {
    Dashboard as DashboardIcon,
    School as CourseIcon,
    People as UsersIcon,
    Category as CategoryIcon,
    RateReview as ReviewIcon,
    Assignment as EnrollmentIcon,
    ShoppingCart as OrderIcon,
    ExitToApp as LogoutIcon,
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    ExpandLess,
    ExpandMore,
    TrendingUp,
} from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useLocale } from "next-intl";

const drawerWidth = 280;
const collapsedWidth = 80;

interface MenuItem {
    text: string;
    icon: React.ReactNode;
    path: string;
}

const menuItems: MenuItem[] = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    { text: "Courses", icon: <CourseIcon />, path: "/admin/courses" },
    { text: "Users", icon: <UsersIcon />, path: "/admin/users" },
    { text: "Categories", icon: <CategoryIcon />, path: "/admin/categories" },
    { text: "Reviews", icon: <ReviewIcon />, path: "/admin/reviews" },
    { text: "Enrollments", icon: <EnrollmentIcon />, path: "/admin/enrollments" },
    { text: "Orders", icon: <OrderIcon />, path: "/admin/orders" },
];

interface AdminSidebarProps {
    mobileOpen?: boolean;
    onMobileClose?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
    mobileOpen = false, 
    onMobileClose 
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [collapsed, setCollapsed] = useState(false);

    const handleNavigation = (path: string) => {
        router.push(`/${locale}${path}`);
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: `/${locale}` });
    };

    const isActivePath = (path: string) => {
        if (path === "/admin") {
            return pathname === `/${locale}/admin`;
        }
        return pathname.startsWith(`/${locale}${path}`);
    };

    const handleCollapse = () => {
        setCollapsed(!collapsed);
    };

    const drawerContent = (
        <Box 
            sx={{ 
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background: "linear-gradient(180deg, #1e293b 0%, #334155 100%)",
                color: "white"
            }}
            className="bg-gradient-to-b from-slate-800 to-slate-700"
        >
            <Box 
                sx={{ 
                    p: collapsed ? 2 : 3, 
                    borderBottom: 1, 
                    borderColor: "rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    minHeight: 80
                }}
            >
                {!collapsed && (
                    <Box>
                        <Typography variant="h5" fontWeight="bold" color="white">
                            EduPlatform
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                            Admin Dashboard
                        </Typography>
                    </Box>
                )}
                {!isMobile && (
                    <IconButton 
                        onClick={handleCollapse}
                        sx={{ color: "white" }}
                        size="small"
                    >
                        {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                )}
            </Box>

            {/* User Profile Section */}
            {!collapsed && (
                <Box sx={{ p: 2, borderBottom: 1, borderColor: "rgba(255,255,255,0.1)" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar 
                            sx={{ 
                                bgcolor: "primary.main",
                                width: 40,
                                height: 40
                            }}
                        >
                            A
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle2" color="white">
                                Admin User
                            </Typography>
                            <Typography 
                                variant="caption" 
                                sx={{ color: "rgba(255,255,255,0.7)" }}
                            >
                                Administrator
                            </Typography>
                        </Box>
                        <Badge 
                            badgeContent={3} 
                            color="error" 
                            sx={{ ".MuiBadge-badge": { fontSize: "0.75rem" } }}
                        >
                            <Box />
                        </Badge>
                    </Box>
                </Box>
            )}

            <List sx={{ px: collapsed ? 1 : 2, py: 1, flexGrow: 1 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                            onClick={() => handleNavigation(item.path)}
                            sx={{
                                borderRadius: 2,
                                backgroundColor: isActivePath(item.path)
                                    ? "rgba(59, 130, 246, 0.15)"
                                    : "transparent",
                                color: isActivePath(item.path)
                                    ? "#3b82f6"
                                    : "rgba(255,255,255,0.9)",
                                border: isActivePath(item.path) 
                                    ? "1px solid rgba(59, 130, 246, 0.3)"
                                    : "1px solid transparent",
                                minHeight: 48,
                                justifyContent: collapsed ? "center" : "flex-start",
                                px: collapsed ? 1 : 2,
                                "&:hover": {
                                    backgroundColor: isActivePath(item.path)
                                        ? "rgba(59, 130, 246, 0.25)"
                                        : "rgba(255,255,255,0.05)",
                                    transform: "translateX(4px)",
                                    transition: "all 0.2s ease"
                                },
                                transition: "all 0.2s ease"
                            }}
                            className="group"
                        >
                            <ListItemIcon
                                sx={{
                                    color: isActivePath(item.path)
                                        ? "#3b82f6"
                                        : "rgba(255,255,255,0.7)",
                                    minWidth: collapsed ? "auto" : 40,
                                    justifyContent: "center"
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            {!collapsed && (
                                <ListItemText 
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: isActivePath(item.path) ? 600 : 500,
                                        fontSize: "0.875rem"
                                    }}
                                />
                            )}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider sx={{ mx: 2, borderColor: "rgba(255,255,255,0.1)" }} />
            
            <List sx={{ px: collapsed ? 1 : 2, py: 1 }}>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            borderRadius: 2,
                            color: "#ef4444",
                            minHeight: 48,
                            justifyContent: collapsed ? "center" : "flex-start",
                            px: collapsed ? 1 : 2,
                            "&:hover": {
                                backgroundColor: "rgba(239, 68, 68, 0.1)",
                                color: "#ef4444",
                                transform: "translateX(4px)",
                            },
                            transition: "all 0.2s ease"
                        }}
                    >
                        <ListItemIcon 
                            sx={{ 
                                color: "inherit",
                                minWidth: collapsed ? "auto" : 40,
                                justifyContent: "center"
                            }}
                        >
                            <LogoutIcon />
                        </ListItemIcon>
                        {!collapsed && (
                            <ListItemText 
                                primary="Logout"
                                primaryTypographyProps={{
                                    fontWeight: 500,
                                    fontSize: "0.875rem"
                                }}
                            />
                        )}
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    width: collapsed ? collapsedWidth : drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: collapsed ? collapsedWidth : drawerWidth,
                        boxSizing: "border-box",
                        borderRight: "none",
                        boxShadow: "4px 0 12px rgba(0, 0, 0, 0.15)",
                        transition: "width 0.3s ease",
                        overflow: "hidden"
                    },
                    display: { xs: "none", md: "block" },
                    transition: "width 0.3s ease"
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onMobileClose}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        borderRight: "none",
                        boxShadow: "4px 0 12px rgba(0, 0, 0, 0.15)",
                        mt: { xs: 8, sm: 0 }
                    },
                }}
            >
                {drawerContent}
            </Drawer>
        </>
    );
};

export default AdminSidebar;
export { drawerWidth, collapsedWidth };
