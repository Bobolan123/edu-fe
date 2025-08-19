"use client";

import React, { useState, useTransition } from "react";
import {
    IconButton,
    Box,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Block as SuspendIcon,
} from "@mui/icons-material";
import { IUser } from "../../../../types/entities";
import { deleteUser, updateUser, suspendUser } from "@/actions/userActions";
import AdminUserDetailsDialog from "./AdminUserDetailsDialog";

interface AdminUsersTableActionsProps {
    user: IUser;
}

const AdminUsersTableActions: React.FC<AdminUsersTableActionsProps> = ({ user }) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editRoleDialogOpen, setEditRoleDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [newRole, setNewRole] = useState(user.role?.name || "");
    const [isPending, startTransition] = useTransition();

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        startTransition(async () => {
            try {
                await deleteUser(user.id);
                setDeleteDialogOpen(false);
            } catch (error) {
                console.error("Failed to delete user:", error);
            }
        });
    };

    const handleViewClick = () => {
        setSelectedUser(user);
    };

    const handleEditRoleClick = () => {
        setNewRole(user.role?.name || "");
        setEditRoleDialogOpen(true);
    };

    const handleRoleUpdateConfirm = async () => {
        startTransition(async () => {
            try {
                await updateUser(user.id, {
                    role: { ...user.role, name: newRole } as any,
                });
                setEditRoleDialogOpen(false);
            } catch (error) {
                console.error("Failed to update user role:", error);
            }
        });
    };

    const handleSuspendClick = async () => {
        startTransition(async () => {
            try {
                await suspendUser(user.id, !user.isActive);
            } catch (error) {
                console.error("Failed to update user status:", error);
            }
        });
    };

    return (
        <>
            <Box sx={{ display: "flex", gap: 1 }}>
                <Tooltip title="View Details">
                    <IconButton size="small" onClick={handleViewClick}>
                        <ViewIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Edit Role">
                    <IconButton size="small" onClick={handleEditRoleClick}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={user.isActive ? "Suspend User" : "Activate User"}>
                    <IconButton
                        size="small"
                        color={user.isActive ? "warning" : "success"}
                        onClick={handleSuspendClick}
                        disabled={isPending}
                    >
                        <SuspendIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete User">
                    <IconButton
                        size="small"
                        color="error"
                        onClick={handleDeleteClick}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the user "{user.name}"?
                        This action cannot be undone and will remove all their data.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDeleteConfirm} 
                        color="error" 
                        variant="contained"
                        disabled={isPending}
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Role Dialog */}
            <Dialog open={editRoleDialogOpen} onClose={() => setEditRoleDialogOpen(false)}>
                <DialogTitle>Edit User Role</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Change role for: <strong>{user.name}</strong>
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={newRole}
                                label="Role"
                                onChange={(e) => setNewRole(e.target.value)}
                                disabled={isPending}
                            >
                                <MenuItem value="student">Student</MenuItem>
                                <MenuItem value="instructor">Instructor</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditRoleDialogOpen(false)} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleRoleUpdateConfirm} 
                        variant="contained"
                        disabled={isPending}
                    >
                        {isPending ? "Updating..." : "Update Role"}
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

export default AdminUsersTableActions;