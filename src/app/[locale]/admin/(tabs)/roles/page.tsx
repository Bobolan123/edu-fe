import { Suspense } from 'react';
import { Metadata } from 'next';
import AdminRolesPage from '@/components/Admin/Roles/AdminRolesPage';
import { CircularProgress, Box } from '@mui/material';

export const metadata: Metadata = {
  title: 'Roles Management - Admin Dashboard',
  description: 'Manage user roles and permissions in the educational platform',
};

export default function RolesPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <AdminRolesPage />
    </Suspense>
  );
}