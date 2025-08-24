"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Paper,
  Breadcrumbs,
  Link,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  School,
  People,
  Category,
  ShoppingCart,
  Reviews,
  Person,
  Logout,
  NavigateNext,
  Home,
  Security,
  AdminPanelSettings,
} from '@mui/icons-material';
import { signOut } from 'next-auth/react';
import LocaleSwitcher from '../Navbar/LocaleSwitcher';
import CurrencySelector from '../Navbar/CurrencySelector';

const drawerWidth = 280;
const collapsedDrawerWidth = 72;

const adminMenuItems = [
  { title: 'Dashboard', icon: Dashboard, path: '/admin' },
  { title: 'Courses', icon: School, path: '/admin/courses' },
  { title: 'Users', icon: People, path: '/admin/users' },
  { title: 'Categories', icon: Category, path: '/admin/categories' },
  { title: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
  { title: 'Reviews', icon: Reviews, path: '/admin/reviews' },
  { title: 'Enrollments', icon: School, path: '/admin/enrollments' },
  { title: 'Roles', icon: Security, path: '/admin/roles' },
  { title: 'Permissions', icon: AdminPanelSettings, path: '/admin/permissions' },
];

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/admin/login`);
    }
  }, [status, router, locale]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDesktopToggle = () => {
    setDesktopCollapsed(!desktopCollapsed);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleSignOut = async () => {
    handleUserMenuClose();
    await signOut({ callbackUrl: `/${locale}/admin/login` });
  };

  const getPageTitle = (path: string) => {
    const item = adminMenuItems.find(item => item.path === path);
    return item ? item.title : 'Dashboard';
  };

  const getBreadcrumbs = (path: string) => {
    const pathSegments = path.split('/').filter(segment => segment);
    const breadcrumbs = [
      { title: 'Admin', path: `/${locale}/admin` }
    ];

    if (pathSegments.length > 2) {
      const currentPage = pathSegments[pathSegments.length - 1];
      const pageTitle = getPageTitle(`/${pathSegments.slice(1).join('/')}`);
      breadcrumbs.push({ title: pageTitle, path });
    }

    return breadcrumbs;
  };

  const drawer = (collapsed: boolean = false) => (
    <Box>
      <Box
        sx={{
          p: collapsed ? 1.5 : 3,
          background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: collapsed ? 0 : 1.5,
          transition: theme.transitions.create(['padding'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <IconButton
          onClick={handleDesktopToggle}
          sx={{ 
            color: 'white',
            display: { xs: 'none', lg: 'flex' },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
        
        {!collapsed ? (
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="h5" component="h1" fontWeight={700}>
              MindfulMaze Admin
            </Typography>

          </Box>
        ) : (
          <Typography variant="h6" component="h1" fontWeight={700} sx={{ display: 'none' }}>
            MMA
          </Typography>
        )}
      </Box>
      
      <List sx={{ px: collapsed ? 1 : 2, py: 1 }}>
        {adminMenuItems.map((item) => {
          const isActive = pathname === `/${locale}${item.path}`;
          const Icon = item.icon;
          
          return (
            <ListItem key={item.title} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={collapsed ? item.title : ''} placement="right">
                <ListItemButton
                  onClick={() => router.push(`/${locale}${item.path}`)}
                  sx={{
                    borderRadius: '12px',
                    minHeight: 48,
                    backgroundColor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? 'white' : 'text.primary',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    px: collapsed ? 1 : 2,
                    '&:hover': {
                      backgroundColor: isActive ? 'primary.dark' : 'grey.100',
                    },
                    '& .MuiListItemIcon-root': {
                      color: isActive ? 'white' : 'text.secondary',
                      minWidth: collapsed ? 'unset' : 56,
                      mr: collapsed ? 0 : 2,
                    },
                  }}
                >
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText 
                      primary={item.title}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 500,
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  if (status === 'loading') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f7f9fc 0%, #e2e8f0 100%)',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const currentPageTitle = getPageTitle(pathname.replace(`/${locale}`, ''));
  const breadcrumbs = getBreadcrumbs(pathname);
  const currentDrawerWidth = desktopCollapsed ? collapsedDrawerWidth : drawerWidth;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { lg: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { lg: `${currentDrawerWidth}px` },
          backgroundColor: 'white',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          transition: theme.transitions.create(['margin-left', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { lg: 'none' }, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="h1" sx={{ color: 'text.primary', fontWeight: 600, mb: 1 }}>
              {currentPageTitle}
            </Typography>
            <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb">
              <Link
                component="button"
                variant="body2"
                onClick={() => router.push(`/${locale}`)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                <Home sx={{ mr: 0.5, fontSize: 16 }} />
                Home
              </Link>
              {breadcrumbs.map((crumb, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  color={index === breadcrumbs.length - 1 ? 'text.primary' : 'text.secondary'}
                  sx={{ fontWeight: index === breadcrumbs.length - 1 ? 500 : 400 }}
                >
                  {crumb.title}
                </Typography>
              ))}
            </Breadcrumbs>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LocaleSwitcher />
            <CurrencySelector />
            <IconButton
              onClick={handleUserMenuOpen}
              sx={{ p: 0 }}
              aria-label="account menu"
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  fontWeight: 600,
                }}
              >
                {session?.user?.name?.charAt(0).toUpperCase() || 'A'}
              </Avatar>
            </IconButton>
            
            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {session?.user?.name || 'Admin User'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {session?.user?.email}
                </Typography>
              </Box>
              
              <MenuItem onClick={handleUserMenuClose} sx={{ py: 1.5 }}>
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                Profile Settings
              </MenuItem>
              
              <Divider />
              
              <MenuItem onClick={handleSignOut} sx={{ py: 1.5, color: 'error.main' }}>
                <ListItemIcon>
                  <Logout fontSize="small" sx={{ color: 'error.main' }} />
                </ListItemIcon>
                Sign Out
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { lg: currentDrawerWidth }, flexShrink: { lg: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: '4px 0 6px -1px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          {drawer(false)}
        </Drawer>
        
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: currentDrawerWidth,
              border: 'none',
              boxShadow: '4px 0 6px -1px rgba(0, 0, 0, 0.1)',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
          open
        >
          {drawer(desktopCollapsed)}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${currentDrawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
          transition: theme.transitions.create(['margin-left', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}