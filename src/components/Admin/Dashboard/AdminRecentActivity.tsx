"use client";

import React, { useEffect, useState } from "react";
import {
    Paper,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Chip,
    CircularProgress,
} from "@mui/material";
import {
    School,
    Person,
    ShoppingCart,
    RateReview,
} from "@mui/icons-material";

interface ActivityItem {
    id: string;
    type: "course" | "user" | "order" | "review";
    title: string;
    description: string;
    timestamp: Date;
    status?: string;
}

const getActivityIcon = (type: string) => {
    switch (type) {
        case "course":
            return <School />;
        case "user":
            return <Person />;
        case "order":
            return <ShoppingCart />;
        case "review":
            return <RateReview />;
        default:
            return <School />;
    }
};

const getActivityColor = (type: string) => {
    switch (type) {
        case "course":
            return "#1976d2";
        case "user":
            return "#388e3c";
        case "order":
            return "#f57c00";
        case "review":
            return "#7b1fa2";
        default:
            return "#1976d2";
    }
};

const AdminRecentActivity: React.FC = () => {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data for now - replace with actual API calls
        const fetchRecentActivity = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 800));
                
                setActivities([
                    {
                        id: "1",
                        type: "course",
                        title: "New Course Created",
                        description: "Advanced React Development course was created by John Doe",
                        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
                        status: "published",
                    },
                    {
                        id: "2",
                        type: "user",
                        title: "New User Registration",
                        description: "Jane Smith joined the platform",
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
                    },
                    {
                        id: "3",
                        type: "order",
                        title: "Order Completed",
                        description: "Order #1234 for $299 was completed successfully",
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
                        status: "completed",
                    },
                    {
                        id: "4",
                        type: "review",
                        title: "New Review Posted",
                        description: "5-star review posted for JavaScript Fundamentals",
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
                        status: "approved",
                    },
                    {
                        id: "5",
                        type: "course",
                        title: "Course Updated",
                        description: "Python for Beginners course content was updated",
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
                        status: "updated",
                    },
                ]);
            } catch (error) {
                console.error("Failed to fetch recent activity:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentActivity();
    }, []);

    const formatTimeAgo = (timestamp: Date) => {
        const now = new Date();
        const diff = now.getTime() - timestamp.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        return "Just now";
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case "completed":
            case "published":
            case "approved":
                return "success";
            case "pending":
                return "warning";
            case "failed":
            case "rejected":
                return "error";
            default:
                return "default";
        }
    };

    if (loading) {
        return (
            <Paper sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Recent Activity
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress />
                </Box>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recent Activity
            </Typography>
            
            {activities.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                    No recent activity found
                </Typography>
            ) : (
                <List>
                    {activities.map((activity, index) => (
                        <ListItem
                            key={activity.id}
                            sx={{
                                borderBottom: index < activities.length - 1 ? 1 : 0,
                                borderColor: "divider",
                                px: 0,
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    sx={{
                                        backgroundColor: `${getActivityColor(activity.type)}15`,
                                        color: getActivityColor(activity.type),
                                    }}
                                >
                                    {getActivityIcon(activity.type)}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Typography variant="body2" fontWeight="medium">
                                            {activity.title}
                                        </Typography>
                                        {activity.status && (
                                            <Chip
                                                label={activity.status}
                                                size="small"
                                                color={getStatusColor(activity.status) as any}
                                                variant="outlined"
                                            />
                                        )}
                                    </Box>
                                }
                                secondary={
                                    <span>
                                        <Typography component="span" variant="body2" color="text.secondary">
                                            {activity.description}
                                        </Typography>
                                        <br />
                                        <Typography component="span" variant="caption" color="text.secondary">
                                            {formatTimeAgo(activity.timestamp)}
                                        </Typography>
                                    </span>
                                }
                                primaryTypographyProps={{ component: "div" }}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
};

export default AdminRecentActivity;
