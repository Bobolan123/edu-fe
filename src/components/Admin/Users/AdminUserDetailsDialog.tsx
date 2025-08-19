"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
    Avatar,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Paper,
} from "@mui/material";
import {
    Email as EmailIcon,
    CalendarToday as DateIcon,
    School as CourseIcon,
    Assignment as EnrollmentIcon,
} from "@mui/icons-material";
import { getUserEnrollments } from "@/actions/userActions";
import { IUser } from "../../../../types/entities";

interface AdminUserDetailsDialogProps {
    user: IUser;
    onClose: () => void;
}

const AdminUserDetailsDialog: React.FC<AdminUserDetailsDialogProps> = ({
    user,
    onClose,
}) => {
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserEnrollments();
    }, [user.id]);

    const fetchUserEnrollments = async () => {
        setLoading(true);
        try {
            const response = await getUserEnrollments(user.id, 1, 10);
            if (response.data?.result) {
                setEnrollments(response.data.result);
            }
        } catch (error) {
            console.error("Failed to fetch user enrollments:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString();
    };

    const getRoleColor = (role?: string) => {
        switch (role?.toLowerCase()) {
            case "admin":
                return "error";
            case "instructor":
                return "warning";
            case "student":
            default:
                return "primary";
        }
    };

    return (
        <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                        src={user.profile_picture || undefined}
                        sx={{ width: 56, height: 56 }}
                    >
                        {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">
                            {user.name}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Chip
                                label={user.role?.name || "Student"}
                                color={getRoleColor(user.role?.name) as any}
                                size="small"
                            />
                            <Chip
                                label={user.isActive ? "Active" : "Suspended"}
                                color={user.isActive ? "success" : "error"}
                                size="small"
                            />
                        </Box>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={3}>
                    {/* Basic Information */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Basic Information
                            </Typography>
                            
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                                <EmailIcon color="action" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Email
                                    </Typography>
                                    <Typography variant="body1">
                                        {user.email}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                                <DateIcon color="action" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Joined
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatDate(user.date_joined)}
                                    </Typography>
                                </Box>
                            </Box>

                            {user.bio && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Bio
                                    </Typography>
                                    <Typography variant="body1">
                                        {user.bio}
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Grid>

                    {/* Statistics */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Statistics
                            </Typography>
                            
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                                        {user.enrollments?.length || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Enrollments
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography variant="h4" fontWeight="bold" color="success.main">
                                        {user.courses?.length || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Courses Created
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: "center" }}>
                                    <Typography variant="h4" fontWeight="bold" color="warning.main">
                                        {user.reviews?.length || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Reviews
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Subscription Status
                                </Typography>
                                <Chip
                                    label={user.has_active_subscription ? "Active Subscription" : "No Subscription"}
                                    color={user.has_active_subscription ? "success" : "default"}
                                    size="small"
                                />
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Recent Enrollments */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Recent Enrollments
                            </Typography>
                            
                            {loading ? (
                                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : enrollments.length > 0 ? (
                                <List>
                                    {enrollments.map((enrollment, index) => (
                                        <ListItem
                                            key={enrollment.id}
                                            sx={{
                                                borderBottom: index < enrollments.length - 1 ? 1 : 0,
                                                borderColor: "divider",
                                                px: 0,
                                            }}
                                        >
                                            <ListItemText
                                                primary={enrollment.course?.title || "Unknown Course"}
                                                secondary={
                                                    <Box>
                                                        <Typography component="span" variant="body2" color="text.secondary">
                                                            Enrolled: {formatDate(enrollment.enrollment_date)}
                                                        </Typography>
                                                        <br />
                                                        <Typography component="span" variant="body2" color="text.secondary">
                                                            Status: {enrollment.completion_status || "In Progress"}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                                    No enrollments found
                                </Typography>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AdminUserDetailsDialog;
