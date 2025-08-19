"use client";

import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Avatar,
    Box,
    TextField,
    InputAdornment,
    TablePagination,
    Tooltip,
    CircularProgress,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Visibility as ViewIcon,
    Block as SuspendIcon,
} from "@mui/icons-material";
import { getUsers, deleteUser, updateUser, suspendUser } from "@/actions/userActions";
import { IUser } from "../../../../types/entities";
import AdminUserDetailsDialog from "./AdminUserDetailsDialog";

const AdminUsersTable: React.FC = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [editRoleDialogOpen, setEditRoleDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<IUser | null>(null);
    const [newRole, setNewRole] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await getUsers(
                page + 1,
                rowsPerPage,
                searchTerm || undefined,
                roleFilter || undefined
            );
            if (response.data?.result) {
                setUsers(response.data.result);
                setTotalCount(response.data.meta.itemCount);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, rowsPerPage, searchTerm, roleFilter]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handleRoleFilterChange = (event: any) => {
        setRoleFilter(event.target.value);
        setPage(0);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteClick = (user: IUser) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;
        
        try {
            await deleteUser(userToDelete.id);
            setDeleteDialogOpen(false);
            setUserToDelete(null);
            fetchUsers();
        } catch (error) {
            console.error("Failed to delete user:", error);
        }
    };

    const handleViewClick = (user: IUser) => {
        setSelectedUser(user);
    };

    const handleEditRoleClick = (user: IUser) => {
        setEditingUser(user);
        setNewRole(user.role?.name || "");
        setEditRoleDialogOpen(true);
    };

    const handleRoleUpdateConfirm = async () => {
        if (!editingUser) return;
        
        try {
            await updateUser(editingUser.id, {
                role: { ...editingUser.role, name: newRole } as any,
            });
            setEditRoleDialogOpen(false);
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            console.error("Failed to update user role:", error);
        }
    };

    const handleSuspendClick = async (user: IUser) => {
        try {
            await suspendUser(user.id, !user.isActive);
            fetchUsers();
        } catch (error) {
            console.error("Failed to update user status:", error);
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

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
                <TextField
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ flexGrow: 1 }}
                />
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Role</InputLabel>
                    <Select
                        value={roleFilter}
                        label="Role"
                        onChange={handleRoleFilterChange}
                    >
                        <MenuItem value="">All Roles</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="instructor">Instructor</MenuItem>
                        <MenuItem value="student">Student</MenuItem>
                    </Select>
                </FormControl>
            </Box>

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
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <Tooltip title="View Details">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleViewClick(user)}
                                            >
                                                <ViewIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit Role">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEditRoleClick(user)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={user.isActive ? "Suspend User" : "Activate User"}>
                                            <IconButton
                                                size="small"
                                                color={user.isActive ? "warning" : "success"}
                                                onClick={() => handleSuspendClick(user)}
                                            >
                                                <SuspendIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete User">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteClick(user)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the user "{userToDelete?.name}"?
                        This action cannot be undone and will remove all their data.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Role Dialog */}
            <Dialog open={editRoleDialogOpen} onClose={() => setEditRoleDialogOpen(false)}>
                <DialogTitle>Edit User Role</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Change role for: <strong>{editingUser?.name}</strong>
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={newRole}
                                label="Role"
                                onChange={(e) => setNewRole(e.target.value)}
                            >
                                <MenuItem value="student">Student</MenuItem>
                                <MenuItem value="instructor">Instructor</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditRoleDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleRoleUpdateConfirm} variant="contained">
                        Update Role
                    </Button>
                </DialogActions>
            </Dialog>

            {/* User Details Dialog */}
            {selectedUser && (
                <AdminUserDetailsDialog
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </>
    );
};

export default AdminUsersTable;
