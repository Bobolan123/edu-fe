import { Suspense } from 'react';
import { Metadata } from 'next';
import AdminPermissionsPage from '@/components/Admin/Permissions/AdminPermissionsPage';
import { CircularProgress, Box } from '@mui/material';

export const metadata: Metadata = {
  title: 'Permissions Management - Admin Dashboard',
  description: 'Manage system permissions in the educational platform',
};

export default function PermissionsPage() {
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
      <AdminPermissionsPage />
    </Suspense>
  );
}