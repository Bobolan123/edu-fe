"use client";

import { useState, useRef } from "react";
import {
    Container,
    Grid,
    Card,
    CardContent,
    Avatar,
    Typography,
    Button,
    Box,
    TextField,
    CircularProgress,
    Divider,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import {
    Edit as EditIcon,
    PhotoCamera as PhotoCameraIcon,
    Lock as LockIcon,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { IUser } from "../../../types/entities";
import {changeUserPassword, updateUserAvatar, updateUser } from "@/actions/userActions";
import { 
    changePasswordSchema, 
    imageUploadSchema,
    profileSchema,
    type ChangePasswordFormData,
    type ImageUploadFormData,
    type ProfileFormData
} from "@/lib/validationSchemas";
import { useSession } from "next-auth/react";
import { toastService } from "@/services/toast";

interface ProfilePageClientProps {
    user: IUser;
}

export default function ProfilePageClient({ user }: ProfilePageClientProps) {
    const t = useTranslations("Profile");
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [editProfileDialogOpen, setEditProfileDialogOpen] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar_url);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Password change form
    const passwordForm = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    // Profile edit form
    const profileForm = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullname: user.name,
            email: user.email,
            bio: user.bio || "",
        },
    });

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Client-side validation
        try {
            imageUploadSchema.parse({ file });
        } catch (error) {
            toastService.error("Please select a valid image file (JPEG, PNG, WebP) under 5MB");
            return;
        }

        setLoading(true);

        try {
            // Create preview
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);

            // Upload to backend following spec: PATCH /users/:id/avatar
            const result = await updateUserAvatar(user.id, file);

            toastService.success(t("avatar_updated_success"));

            // Update session data with new avatar URL
            if (session && update) {
                await update({
                    user: {
                        ...session.user,
                        avatar_url: result.avatar_url
                    }
                });
            }
        } catch (error) {
            console.error("Avatar upload error:", error);
            toastService.error(error instanceof Error ? error.message : t("avatar_upload_failed"));
            // Revert preview on error
            setAvatarPreview(user.avatar_url);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (data: ChangePasswordFormData) => {
        setLoading(true);

        try {
            // Call backend following spec: PATCH /users/:id/password
            await changeUserPassword(user.id, {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });

            toastService.success(t("password_changed_success"));
            setPasswordDialogOpen(false);
            passwordForm.reset();
        } catch (error) {
            console.error("Password change error:", error);
            toastService.error(error instanceof Error ? error.message : t("password_change_failed"));
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (data: ProfileFormData) => {
        setLoading(true);

        try {
            // Update profile using the existing updateUser function
            await updateUser(user.id, {
                name: data.fullname,
                email: data.email,
                bio: data.bio,
            });

            toastService.success("Profile updated successfully");
            setEditProfileDialogOpen(false);
            
            // Update session data
            if (session) {
                await fetch("/api/auth/session?update=1");
            }
        } catch (error) {
            console.error("Profile update error:", error);
            toastService.error(error instanceof Error ? error.message : "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Grid container spacing={4}>
                {/* Profile Header */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Box sx={{ position: 'relative' }}>
                                    <Avatar
                                        src={avatarPreview || undefined}
                                        sx={{ 
                                            width: 120, 
                                            height: 120,
                                            cursor: 'pointer',
                                            '&:hover': {
                                                opacity: 0.8,
                                            }
                                        }}
                                        onClick={handleAvatarClick}
                                    >
                                        {user.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                    
                                    {loading && (
                                        <CircularProgress
                                            size={24}
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                marginTop: '-12px',
                                                marginLeft: '-12px',
                                            }}
                                        />
                                    )}
                                    
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            '&:hover': {
                                                bgcolor: 'primary.dark',
                                            }
                                        }}
                                        onClick={handleAvatarClick}
                                        disabled={loading}
                                    >
                                        <PhotoCameraIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                                
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />

                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h4" gutterBottom>
                                        {user.name}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" gutterBottom>
                                        {user.email}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t("member_since", { 
                                            date: new Date(user.date_joined).toLocaleDateString() 
                                        })}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Profile Information */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6">
                                    {t("profile_information")}
                                </Typography>
                                <Button
                                    startIcon={<EditIcon />}
                                    variant="outlined"
                                    size="small"
                                    onClick={() => setEditProfileDialogOpen(true)}
                                >
                                    {t("edit_profile")}
                                </Button>
                            </Box>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label={t("full_name")}
                                        value={user.name}
                                        disabled
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label={t("email")}
                                        value={user.email}
                                        disabled
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label={t("bio")}
                                        value={user.bio || t("no_bio")}
                                        disabled
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Security Settings */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {t("security")}
                            </Typography>
                            
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<LockIcon />}
                                onClick={() => setPasswordDialogOpen(true)}
                                sx={{ mb: 2 }}
                            >
                                {t("change_password")}
                            </Button>

                            <Divider sx={{ my: 2 }} />
                            
                            <Typography variant="body2" color="text.secondary">
                                {t("account_type")}: {user.googleId ? t("google_account") : t("email_account")}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Change Password Dialog */}
            <Dialog 
                open={passwordDialogOpen} 
                onClose={() => setPasswordDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>{t("change_password")}</DialogTitle>
                <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)}>
                    <DialogContent>
                        <TextField
                            {...passwordForm.register("currentPassword")}
                            fullWidth
                            label={t("current_password")}
                            type="password"
                            margin="normal"
                            error={!!passwordForm.formState.errors.currentPassword}
                            helperText={passwordForm.formState.errors.currentPassword?.message}
                        />
                        
                        <TextField
                            {...passwordForm.register("newPassword")}
                            fullWidth
                            label={t("new_password")}
                            type="password"
                            margin="normal"
                            error={!!passwordForm.formState.errors.newPassword}
                            helperText={passwordForm.formState.errors.newPassword?.message}
                        />
                        
                        <TextField
                            {...passwordForm.register("confirmPassword")}
                            fullWidth
                            label={t("confirm_password")}
                            type="password"
                            margin="normal"
                            error={!!passwordForm.formState.errors.confirmPassword}
                            helperText={passwordForm.formState.errors.confirmPassword?.message}
                        />
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            {t("password_requirements")}
                        </Typography>
                    </DialogContent>
                    
                    <DialogActions>
                        <Button 
                            onClick={() => {
                                setPasswordDialogOpen(false);
                                passwordForm.reset();
                            }}
                            disabled={loading}
                        >
                            {t("cancel")}
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={20} /> : t("change_password")}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Edit Profile Dialog */}
            <Dialog 
                open={editProfileDialogOpen} 
                onClose={() => setEditProfileDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>{t("edit_profile")}</DialogTitle>
                <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)}>
                    <DialogContent>
                        <TextField
                            {...profileForm.register("fullname")}
                            fullWidth
                            label={t("full_name")}
                            margin="normal"
                            error={!!profileForm.formState.errors.fullname}
                            helperText={profileForm.formState.errors.fullname?.message}
                        />
                        
                        <TextField
                            {...profileForm.register("email")}
                            fullWidth
                            label={t("email")}
                            type="email"
                            margin="normal"
                            error={!!profileForm.formState.errors.email}
                            helperText={profileForm.formState.errors.email?.message}
                        />
                        
                        <TextField
                            {...profileForm.register("bio")}
                            fullWidth
                            label={t("bio")}
                            multiline
                            rows={3}
                            margin="normal"
                            error={!!profileForm.formState.errors.bio}
                            helperText={profileForm.formState.errors.bio?.message}
                        />
                    </DialogContent>
                    
                    <DialogActions>
                        <Button 
                            onClick={() => {
                                setEditProfileDialogOpen(false);
                                profileForm.reset();
                            }}
                            disabled={loading}
                        >
                            {t("cancel")}
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={20} /> : "Save Changes"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Container>
    );
}