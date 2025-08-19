"use client";

import AdminSidebar from "@/components/Admin/AdminSidebar";
import AdminMobileHeader from "@/components/Admin/AdminMobileHeader";
import { Box, Container, useTheme, useMediaQuery } from "@mui/material";
import { useState } from "react";

export default function AdminTabsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    
    return (
        <Box 
            sx={{ 
                display: "flex", 
                minHeight: "100vh",
                backgroundColor: "grey.50"
            }}
            className="bg-gradient-to-br from-slate-50 to-grey-100"
        >
            <AdminMobileHeader onMenuClick={handleDrawerToggle} />
            <AdminSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    ml: { xs: 0, md: "280px" },
                    backgroundColor: "grey.50",
                    minHeight: "100vh",
                    transition: "margin 0.3s ease",
                }}
                className="transition-all duration-300 ease-in-out"
            >
                <Container 
                    maxWidth="xl" 
                    sx={{ 
                        py: 4,
                        px: { xs: 2, sm: 3, md: 4 },
                        height: "100%"
                    }}
                    className="min-h-full"
                >
                    <Box 
                        sx={{
                            backgroundColor: "background.paper",
                            borderRadius: 3,
                            p: { xs: 2, sm: 3, md: 4 },
                            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                            minHeight: "calc(100vh - 64px)",
                        }}
                        className="shadow-sm border border-gray-200"
                    >
                        {children}
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
