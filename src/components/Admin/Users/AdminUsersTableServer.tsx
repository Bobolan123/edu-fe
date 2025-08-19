import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Typography,
    Chip,
    Avatar,
} from "@mui/material";
import { getUsers } from "@/actions/userActions";
import { IUser } from "../../../../types/entities";
import AdminUsersTableActions from "./AdminUsersTableActions";
import AdminUsersTablePagination from "./AdminUsersTablePagination";
import AdminUsersTableFilters from "./AdminUsersTableFilters";

interface AdminUsersTableServerProps {
    searchParams: {
        page?: string;
        limit?: string;
        role?: string;
        search?: string;
    };
}

const AdminUsersTableServer: React.FC<AdminUsersTableServerProps> = async ({ searchParams }) => {
    const page = parseInt(searchParams.page || "1", 10);
    const limit = parseInt(searchParams.limit || "10", 10);
    const role = searchParams.role;
    const search = searchParams.search;

    let users: IUser[] = [];
    let totalCount = 0;
    let error: string | null = null;

    try {
        const response = await getUsers(page, limit, search, role);
        users = response.data?.result || [];
        totalCount = response.data?.meta?.itemCount || 0;
    } catch (err) {
        error = err instanceof Error ? err.message : "Failed to fetch users";
        console.error("Failed to fetch users:", err);
    }

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

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography color="error" variant="body1">
                    Error: {error}
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <AdminUsersTableFilters 
                initialSearch={search || ""} 
                initialRole={role || ""} 
            />

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Joined</TableCell>
                            <TableCell>Courses</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} hover>
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Avatar
                                            src={user.profile_picture || undefined}
                                            sx={{ width: 40, height: 40 }}
                                        >
                                            {user.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight="medium">
                                                {user.name}
                                            </Typography>
                                            {user.bio && (
                                                <Typography variant="caption" color="text.secondary">
                                                    {user.bio.substring(0, 40)}...
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {user.email}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.role?.name || "Student"}
                                        color={getRoleColor(user.role?.name) as any}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.isActive ? "Active" : "Suspended"}
                                        color={user.isActive ? "success" : "error"}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {formatDate(user.date_joined)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {user.enrollments?.length || 0}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <AdminUsersTableActions user={user} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <AdminUsersTablePagination
                totalCount={totalCount}
                currentPage={page}
                rowsPerPage={limit}
            />
        </>
    );
};

export default AdminUsersTableServer;