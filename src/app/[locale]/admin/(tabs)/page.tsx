import React from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Paper,
    useTheme,
} from "@mui/material";
import {
    TrendingUp,
    School,
    People,
    ShoppingCart,
    Assignment,
} from "@mui/icons-material";
import AdminDashboardStats from "@/components/Admin/Dashboard/AdminDashboardStats";
import AdminRecentActivity from "@/components/Admin/Dashboard/AdminRecentActivity";

export default function AdminDashboard() {
    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Welcome to the admin panel. Here&apos;s an overview of your educational platform.
            </Typography>

            <Grid container spacing={3}>
                {/* Statistics Cards */}
                <AdminDashboardStats />
                
                {/* Recent Activity */}
                <Grid item xs={12} lg={8}>
                    <AdminRecentActivity />
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12} lg={4}>
                    <Paper 
                        sx={{ 
                            p: 3, 
                            height: "100%",
                            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                            border: "1px solid",
                            borderColor: "grey.200",
                            borderRadius: 3,
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Quick Actions
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Card 
                                sx={{ 
                                    cursor: "pointer",
                                    "&:hover": { backgroundColor: "action.hover" }
                                }}
                            >
                                <CardContent sx={{ py: 2 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <School color="primary" />
                                        <Typography variant="body2">
                                            Create New Course
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                            
                            <Card 
                                sx={{ 
                                    cursor: "pointer",
                                    "&:hover": { backgroundColor: "action.hover" }
                                }}
                            >
                                <CardContent sx={{ py: 2 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <People color="primary" />
                                        <Typography variant="body2">
                                            Manage Users
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>

                            <Card 
                                sx={{ 
                                    cursor: "pointer",
                                    "&:hover": { backgroundColor: "action.hover" }
                                }}
                            >
                                <CardContent sx={{ py: 2 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Assignment color="primary" />
                                        <Typography variant="body2">
                                            Review Reports
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
