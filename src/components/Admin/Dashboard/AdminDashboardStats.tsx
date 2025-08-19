"use client";

import React, { useEffect, useState } from "react";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress,
} from "@mui/material";
import {
    TrendingUp,
    School,
    People,
    ShoppingCart,
    Assignment,
    RateReview,
} from "@mui/icons-material";

interface DashboardStats {
    totalCourses: number;
    totalUsers: number;
    totalOrders: number;
    totalEnrollments: number;
    totalRevenue: number;
    totalReviews: number;
}

const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    prefix?: string;
    trend?: { value: number; isPositive: boolean };
}> = ({ title, value, icon, color, prefix = "", trend }) => {
    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card 
                sx={{
                    height: "100%",
                    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                    border: "1px solid",
                    borderColor: "grey.200",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                        borderColor: color,
                    }
                }}
                className="group cursor-pointer"
            >
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography 
                                variant="h3" 
                                fontWeight="bold" 
                                sx={{ 
                                    color: color,
                                    mb: 0.5,
                                    fontSize: { xs: "1.875rem", sm: "2.25rem" }
                                }}
                            >
                                {prefix}{value.toLocaleString()}
                            </Typography>
                            <Typography 
                                variant="body2" 
                                color="text.secondary"
                                fontWeight="medium"
                            >
                                {title}
                            </Typography>
                            {trend && (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: 1,
                                            backgroundColor: trend.isPositive ? "success.light" : "error.light",
                                            color: trend.isPositive ? "success.dark" : "error.dark",
                                        }}
                                    >
                                        <TrendingUp 
                                            sx={{ 
                                                fontSize: "1rem", 
                                                mr: 0.5,
                                                transform: trend.isPositive ? "none" : "rotate(180deg)"
                                            }} 
                                        />
                                        <Typography variant="caption" fontWeight="bold">
                                            {Math.abs(trend.value)}%
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        vs last month
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 3,
                                background: `linear-gradient(135deg, ${color}20, ${color}10)`,
                                color: color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: 56,
                                minHeight: 56,
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                                transition: "all 0.3s ease",
                                ".group:hover &": {
                                    transform: "scale(1.1) rotate(5deg)",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
                                }
                            }}
                        >
                            {icon}
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );
};

const AdminDashboardStats: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data for now - replace with actual API calls
        const fetchStats = async () => {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                setStats({
                    totalCourses: 156,
                    totalUsers: 2847,
                    totalOrders: 1234,
                    totalEnrollments: 5678,
                    totalRevenue: 89450,
                    totalReviews: 892,
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress />
                </Box>
            </Grid>
        );
    }

    if (!stats) {
        return (
            <Grid item xs={12}>
                <Typography color="error">Failed to load dashboard statistics</Typography>
            </Grid>
        );
    }

    return (
        <>
            <StatCard
                title="Total Courses"
                value={stats.totalCourses}
                icon={<School fontSize="large" />}
                color="#3b82f6"
                trend={{ value: 12, isPositive: true }}
            />
            <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon={<People fontSize="large" />}
                color="#10b981"
                trend={{ value: 8, isPositive: true }}
            />
            <StatCard
                title="Total Orders"
                value={stats.totalOrders}
                icon={<ShoppingCart fontSize="large" />}
                color="#f59e0b"
                trend={{ value: 5, isPositive: true }}
            />
            <StatCard
                title="Total Enrollments"
                value={stats.totalEnrollments}
                icon={<Assignment fontSize="large" />}
                color="#8b5cf6"
                trend={{ value: 15, isPositive: true }}
            />
            <StatCard
                title="Total Revenue"
                value={stats.totalRevenue}
                icon={<TrendingUp fontSize="large" />}
                color="#ef4444"
                prefix="$"
                trend={{ value: 23, isPositive: true }}
            />
            <StatCard
                title="Total Reviews"
                value={stats.totalReviews}
                icon={<RateReview fontSize="large" />}
                color="#06b6d4"
                trend={{ value: 3, isPositive: false }}
            />
        </>
    );
};

export default AdminDashboardStats;
