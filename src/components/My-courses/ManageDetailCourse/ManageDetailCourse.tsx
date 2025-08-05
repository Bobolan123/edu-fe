"use client";

import { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Tabs,
    Tab,
    Chip,
    LinearProgress,
    Grid,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Button,
    Container,
    Paper,
    Stack,
    CardMedia,
    Rating,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import {
    People,
    Star,
    MonetizationOn,

    BarChart,
    TrendingUp,
    PlayArrow,
    MenuBook,
    Group,
    AttachMoney,
    EmojiEvents,
    CalendarToday,
    Schedule,
    EditOutlined,
    SettingsOutlined,
    DeleteOutlined,
} from "@mui/icons-material";
import { ICourse, ICourseContent } from "../../../../types/entities";
import CourseContentTab from "./CourseContentTab";
import EditCourseModal from "./EditCourseModal";
import ManageCourseContentModal from "./ManageCourseContentModal";

interface ManageDetailCourseProps {
    course: ICourse;
    courseContent: ICourseContent | undefined;
}
const student = {
    name: "Student 1",
    email: "student1@example.com",
    completionPercentage: 64,
    enrolledDaysAgo: 9,
};

const review = {
    studentName: "Student 1",
    rating: 4,
    comment:
        "Excellent course! The instructor explains complex concepts clearly...",
    daysAgo: 9,
};

export default function ManageDetailCourse({
    course,
    courseContent,
}: ManageDetailCourseProps) {
    const [activeTab, setActiveTab] = useState(0);
    const [editCourseModalOpen, setEditCourseModalOpen] = useState(false);
    const [manageContentModalOpen, setManageContentModalOpen] = useState(false);

    const totalLectures = courseContent?.sections.reduce(
        (acc, section) => acc + section.totalLectures,
        0
    );

    const handleTabChange = (_: any, newValue: number) =>
        setActiveTab(newValue);

    return (
        <Box className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-4">
            <Container maxWidth="xl">
                {/* Header Section */}
                <Box className="mb-8">
                    <Card 
                        elevation={0}
                        className="rounded-3xl border border-white/50 bg-white/95 backdrop-blur-sm overflow-hidden"
                    >
                        <Box className="relative">
                            <CardMedia
                                component="img"
                                height="300"
                                image={course.thumbnail_url || "/placeholder.svg"}
                                alt={course.title}
                                className="h-80 object-cover"
                            />
                            <Box className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            
                            <Box className="absolute bottom-6 left-6 right-6 text-white">
                                <Typography 
                                    variant="h3" 
                                    className="font-bold mb-3 drop-shadow-lg"
                                >
                                    {course.title}
                                </Typography>
                                <Typography 
                                    variant="h6" 
                                    className="mb-4 text-white/90 leading-relaxed drop-shadow-md"
                                >
                                    {course.description}
                                </Typography>
                                
                                <Stack direction="row" spacing={3} className="mb-4">
                                    <Box className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                                        <CalendarToday className="h-4 w-4" />
                                        <Typography variant="body2">
                                            {new Date(course.date_created).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                    <Box className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                                        <MenuBook className="h-4 w-4" />
                                        <Typography variant="body2">
                                            {totalLectures} lectures
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>
                            
                            <Box className="absolute top-6 right-6">
                                <Chip
                                    label={`₫${course.price.toLocaleString("vi-VN")}`}
                                    className="bg-white/95 text-gray-800 font-bold shadow-lg"
                                    sx={{ borderRadius: '16px', fontSize: '1rem', padding: '8px 0' }}
                                />
                            </Box>
                        </Box>
                        
                        <CardContent className="p-6">
                            <Box className="flex flex-col md:flex-row justify-between items-start gap-6">
                                <Box className="flex-1">
                                    <Box className="flex flex-wrap gap-2 mb-4">
                                        {course.categories.map((cat) => (
                                            <Chip
                                                key={cat.id}
                                                label={cat.name}
                                                size="medium"
                                                sx={{
                                                    borderRadius: '16px',
                                                    backgroundColor: '#faf5ff',
                                                    borderColor: '#d8b4fe',
                                                    color: '#7c3aed',
                                                    fontWeight: 'medium',
                                                    border: '1px solid'
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            
                            <Box className="flex items-center gap-4">
                                <Box className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl px-4 py-2 border border-yellow-200">
                                    <Rating
                                        value={course.average_rating}
                                        precision={0.1}
                                        size="small"
                                        readOnly
                                    />
                                    <Typography className="font-medium text-gray-700">
                                        {course.average_rating} ({course.total_reviews})
                                    </Typography>
                                </Box>
                                
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        variant="contained"
                                        startIcon={<EditOutlined />}
                                        onClick={() => setEditCourseModalOpen(true)}
                                        sx={{
                                            background: 'linear-gradient(45deg, #2563eb, #3b82f6)',
                                            borderRadius: '16px',
                                            textTransform: 'none',
                                            px: 3,
                                            py: 1.5,
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Edit Course
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<SettingsOutlined />}
                                        sx={{
                                            borderRadius: '16px',
                                            textTransform: 'none',
                                            px: 3,
                                            py: 1.5,
                                            fontWeight: 'bold',
                                            borderColor: '#d1d5db',
                                            color: '#6b7280'
                                        }}
                                    >
                                        Settings
                                    </Button>
                                </Stack>
                            </Box>
                        </Box>
                        </CardContent>
                    </Card>
                </Box>

                {/* Stats Grid */}
                <Grid container spacing={3} className="mb-8">
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper 
                            elevation={0}
                            className="p-6 hover:shadow-lg transition-shadow duration-200 rounded-2xl bg-gradient-to-br from-emerald-100 via-emerald-50 to-teal-50 border border-emerald-100/50"
                        >
                            <Box className="text-center">
                                <Box className="inline-flex p-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 shadow-md mb-3">
                                    <Group className="h-7 w-7 text-white" />
                                </Box>
                                <Typography
                                    variant="body2"
                                    className="font-bold text-emerald-800 mb-2 tracking-wide"
                                >
                                    👥 Total Students
                                </Typography>
                                <Typography
                                    variant="h3"
                                    className="font-black text-emerald-900 mb-2"
                                >
                                    {course.enrollments?.length.toLocaleString() || 0}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    className="text-emerald-600 font-medium"
                                >
                                    Growing community! 🚀
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper 
                            elevation={0}
                            className="p-6 hover:shadow-lg transition-shadow duration-200 rounded-2xl bg-gradient-to-br from-violet-100 via-violet-50 to-purple-50 border border-violet-100/50"
                        >
                            <Box className="text-center">
                                <Box className="inline-flex p-3 rounded-full bg-gradient-to-r from-violet-400 to-purple-400 shadow-md mb-3">
                                    <AttachMoney className="h-7 w-7 text-white" />
                                </Box>
                                <Typography
                                    variant="body2"
                                    className="font-bold text-violet-800 mb-2 tracking-wide"
                                >
                                    💰 Total Revenue
                                </Typography>
                                <Typography
                                    variant="h3"
                                    className="font-black text-violet-900 mb-2"
                                >
                                    ₫{((course.enrollments?.length * course.price) || 0).toLocaleString("vi-VN")}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    className="text-violet-600 font-medium flex items-center justify-center gap-1"
                                >
                                    <TrendingUp className="h-3 w-3" />
                                    +8% this month 📈
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper 
                            elevation={0}
                            className="p-6 hover:shadow-lg transition-shadow duration-200 rounded-2xl bg-gradient-to-br from-amber-100 via-amber-50 to-orange-50 border border-amber-100/50"
                        >
                            <Box className="text-center">
                                <Box className="inline-flex p-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 shadow-md mb-3">
                                    <BarChart className="h-7 w-7 text-white" />
                                </Box>
                                <Typography
                                    variant="body2"
                                    className="font-bold text-amber-800 mb-2 tracking-wide"
                                >
                                    📊 Completion Rate
                                </Typography>
                                <Typography
                                    variant="h3"
                                    className="font-black text-amber-900 mb-2"
                                >
                                    78%
                                </Typography>
                                <LinearProgress
                                    value={78}
                                    variant="determinate"
                                    className="h-2 rounded-full mb-2"
                                    sx={{
                                        backgroundColor: '#fef3c7',
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: '4px',
                                            background: 'linear-gradient(45deg, #f59e0b, #d97706)'
                                        }
                                    }}
                                />
                                <Typography
                                    variant="caption"
                                    className="text-amber-600 font-medium"
                                >
                                    Great engagement! ⭐
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper 
                            elevation={0}
                            className="p-6 hover:shadow-lg transition-shadow duration-200 rounded-2xl bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-50 border border-blue-100/50"
                        >
                            <Box className="text-center">
                                <Box className="inline-flex p-3 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 shadow-md mb-3">
                                    <EmojiEvents className="h-7 w-7 text-white" />
                                </Box>
                                <Typography
                                    variant="body2"
                                    className="font-bold text-blue-800 mb-2 tracking-wide"
                                >
                                    ⭐ Average Rating
                                </Typography>
                                <Typography
                                    variant="h3"
                                    className="font-black text-blue-900 mb-2"
                                >
                                    {course.average_rating.toFixed(1)}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    className="text-blue-600 font-medium"
                                >
                                    From {course.total_reviews} reviews ✨
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Tabs */}
                <Paper 
                    elevation={0}
                    className="mb-6 rounded-3xl border border-white/50 bg-white/95 backdrop-blur-sm overflow-hidden"
                >
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        className="px-6"
                        sx={{
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                borderRadius: '16px',
                                margin: '8px 4px',
                                minHeight: '48px',
                                '&.Mui-selected': {
                                    background: 'linear-gradient(45deg, #2563eb, #3b82f6)',
                                    color: 'white',
                                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                                }
                            },
                            '& .MuiTabs-indicator': {
                                display: 'none'
                            }
                        }}
                    >
                        <Tab label="📊 Overview" value={0} />
                        <Tab label="📚 Content" value={1} />
                        <Tab label="👥 Students" value={2} />
                        <Tab label="⭐ Reviews" value={3} />
                        <Tab label="⚙️ Settings" value={4} />
                    </Tabs>
                </Paper>

                {activeTab === 0 && (
                    <Card 
                        elevation={0}
                        className="rounded-3xl border border-white/50 bg-white/95 backdrop-blur-sm"
                    >
                        <CardContent className="p-8">
                            <Typography 
                                variant="h4" 
                                className="font-bold text-gray-800 mb-8 text-center"
                            >
                                📋 Course Information
                            </Typography>

                            <Grid container spacing={4}>
                                {/* Instructor Info */}
                                <Grid item xs={12} md={6}>
                                    <Paper 
                                        elevation={0}
                                        className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100/50"
                                    >
                                        <Typography 
                                            variant="h6" 
                                            className="font-bold text-purple-800 mb-4 flex items-center gap-2"
                                        >
                                            👨‍🏫 Instructor
                                        </Typography>
                                        <Box className="flex items-center gap-4">
                                            <Avatar
                                                src={course.instructor?.avatar_url || "/placeholder.svg"}
                                                sx={{ 
                                                    width: 64, 
                                                    height: 64,
                                                    border: '3px solid white',
                                                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                                                }}
                                            />
                                            <Box>
                                                <Typography 
                                                    variant="h6" 
                                                    className="font-bold text-gray-800"
                                                >
                                                    {course.instructor?.name}
                                                </Typography>
                                                <Typography 
                                                    variant="body2" 
                                                    className="text-purple-600 font-medium"
                                                >
                                                    Course Creator
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Grid>

                                {/* Language */}
                                <Grid item xs={12} md={6}>
                                    <Paper 
                                        elevation={0}
                                        className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50"
                                    >
                                        <Typography 
                                            variant="h6" 
                                            className="font-bold text-blue-800 mb-4 flex items-center gap-2"
                                        >
                                            🌐 Course Language
                                        </Typography>
                                        <Typography 
                                            variant="h4" 
                                            className="font-black text-blue-900"
                                        >
                                            {course.language === 'Vietnamese' ? '🇻🇳 Tiếng Việt' : '🇺🇸 English'}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            className="text-blue-600 font-medium mt-2"
                                        >
                                            All content and materials
                                        </Typography>
                                    </Paper>
                                </Grid>

                                {/* Last Updated */}
                                <Grid item xs={12} md={6}>
                                    <Paper 
                                        elevation={0}
                                        className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100/50"
                                    >
                                        <Typography 
                                            variant="h6" 
                                            className="font-bold text-green-800 mb-4 flex items-center gap-2"
                                        >
                                            📅 Last Updated
                                        </Typography>
                                        <Typography 
                                            variant="h5" 
                                            className="font-bold text-green-900"
                                        >
                                            {new Date(course.last_updated).toLocaleDateString()}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            className="text-green-600 font-medium mt-2"
                                        >
                                            Content is up to date
                                        </Typography>
                                    </Paper>
                                </Grid>

                                {/* Price */}
                                <Grid item xs={12} md={6}>
                                    <Paper 
                                        elevation={0}
                                        className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100/50"
                                    >
                                        <Typography 
                                            variant="h6" 
                                            className="font-bold text-amber-800 mb-4 flex items-center gap-2"
                                        >
                                            💰 Course Price
                                        </Typography>
                                        <Typography 
                                            variant="h4" 
                                            className="font-black text-amber-900"
                                        >
                                            ₫{course?.price.toLocaleString("vi-VN")}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            className="text-amber-600 font-medium mt-2"
                                        >
                                            One-time payment
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 1 && (
                    <Box>
                        {courseContent ? (
                            <CourseContentTab
                                sections={courseContent.sections}
                                onEditContent={() => setManageContentModalOpen(true)}
                            />
                        ) : (
                            <Card 
                                elevation={0}
                                className="rounded-3xl border border-white/50 bg-white/95 backdrop-blur-sm"
                            >
                                <CardContent className="p-12 text-center">
                                    <Typography variant="h6" className="font-bold text-gray-600 mb-2">
                                        No Content Available
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Course content is not available or failed to load.
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                )}

                {activeTab === 2 && (
                    <Card 
                        elevation={0}
                        className="rounded-3xl border border-white/50 bg-white/95 backdrop-blur-sm"
                    >
                        <CardContent className="p-8">
                            <Typography 
                                variant="h4" 
                                className="font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-2"
                            >
                                👥 Enrolled Students ({course.enrollments?.length || 0})
                            </Typography>

                            <Paper 
                                elevation={0}
                                className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100/50 hover:shadow-lg transition-shadow duration-200"
                            >
                                <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <Box className="flex items-center gap-4">
                                        <Avatar 
                                            sx={{ 
                                                width: 64, 
                                                height: 64,
                                                background: 'linear-gradient(45deg, #8b5cf6, #a855f7)',
                                                border: '3px solid white',
                                                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                                                fontSize: '1.5rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {student.name.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography
                                                variant="h6"
                                                className="font-bold text-gray-800 mb-1"
                                            >
                                                {student.name}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                className="text-purple-600 font-medium mb-2"
                                            >
                                                {student.email}
                                            </Typography>
                                            <Chip
                                                label={`Enrolled ${student.enrolledDaysAgo} days ago`}
                                                size="small"
                                                className="bg-blue-100 text-blue-700 font-medium"
                                                sx={{ borderRadius: '12px' }}
                                            />
                                        </Box>
                                    </Box>

                                    <Box className="text-center md:text-right">
                                        <Typography
                                            variant="h5"
                                            className="font-bold text-purple-900 mb-2"
                                        >
                                            {student.completionPercentage}% Complete
                                        </Typography>
                                        <LinearProgress
                                            value={student.completionPercentage}
                                            variant="determinate"
                                            className="h-3 rounded-full mb-2 w-32"
                                            sx={{
                                                backgroundColor: '#e5e7eb',
                                                '& .MuiLinearProgress-bar': {
                                                    borderRadius: '6px',
                                                    background: student.completionPercentage === 100 ? 
                                                        'linear-gradient(45deg, #10b981, #059669)' :
                                                        'linear-gradient(45deg, #8b5cf6, #a855f7)'
                                                }
                                            }}
                                        />
                                        <Typography
                                            variant="caption"
                                            className="text-gray-600 font-medium"
                                        >
                                            Progress Status
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 3 && (
                    <Card 
                        elevation={0}
                        className="rounded-3xl border border-white/50 bg-white/95 backdrop-blur-sm"
                    >
                        <CardContent className="p-8">
                            <Typography 
                                variant="h4" 
                                className="font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-2"
                            >
                                ⭐ Student Reviews ({course.reviews?.length || 0})
                            </Typography>

                            <Paper 
                                elevation={0}
                                className="p-6 rounded-2xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100/50 hover:shadow-lg transition-shadow duration-200"
                            >
                                <Box className="flex flex-col md:flex-row gap-6">
                                    <Avatar 
                                        sx={{ 
                                            width: 64, 
                                            height: 64,
                                            background: 'linear-gradient(45deg, #f59e0b, #d97706)',
                                            border: '3px solid white',
                                            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                                            fontSize: '1.5rem',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {review.studentName.charAt(0)}
                                    </Avatar>
                                    <Box className="flex-1">
                                        <Box className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                                            <Typography 
                                                variant="h6" 
                                                className="font-bold text-gray-800"
                                            >
                                                {review.studentName}
                                            </Typography>
                                            <Box className="flex items-center gap-2">
                                                <Rating
                                                    value={review.rating}
                                                    precision={1}
                                                    size="small"
                                                    readOnly
                                                />
                                                <Typography 
                                                    variant="body2" 
                                                    className="font-bold text-yellow-700"
                                                >
                                                    {review.rating}/5
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography 
                                            variant="body1" 
                                            className="text-gray-700 leading-relaxed mb-3 bg-white/80 p-4 rounded-xl border border-yellow-200"
                                        >
                                            “{review.comment}”
                                        </Typography>
                                        <Box className="flex items-center gap-2">
                                            <Chip
                                                label={`${review.daysAgo} days ago`}
                                                size="small"
                                                className="bg-orange-100 text-orange-700 font-medium"
                                                sx={{ borderRadius: '12px' }}
                                            />
                                            <Chip
                                                label="Verified Purchase"
                                                size="small"
                                                className="bg-green-100 text-green-700 font-medium"
                                                sx={{ borderRadius: '12px' }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </Paper>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 4 && (
                    <Card 
                        elevation={0}
                        className="rounded-3xl border border-white/50 bg-white/95 backdrop-blur-sm"
                    >
                        <CardContent className="p-8">
                            <Typography 
                                variant="h4" 
                                className="font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-2"
                            >
                                ⚙️ Course Settings
                            </Typography>

                            {/* Thumbnail Section */}
                            <Paper 
                                elevation={0}
                                className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 mb-8"
                            >
                                <Typography 
                                    variant="h6" 
                                    className="font-bold text-blue-800 mb-4 flex items-center gap-2"
                                >
                                    🖼️ Course Thumbnail
                                </Typography>
                                <Box className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                    <Box 
                                        component="img"
                                        src={course.thumbnail_url || "/img_not_found.png"}
                                        sx={{ 
                                            width: 200, 
                                            height: 120, 
                                            borderRadius: '16px',
                                            objectFit: 'cover',
                                            border: '3px solid white',
                                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                                        }}
                                    />
                                    <Box>
                                        <Typography 
                                            variant="body1" 
                                            className="text-gray-700 mb-3"
                                        >
                                            Upload a high-quality image to represent your course
                                        </Typography>
                                        <Button 
                                            variant="contained"
                                            sx={{
                                                background: 'linear-gradient(45deg, #2563eb, #3b82f6)',
                                                borderRadius: '16px',
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                px: 4,
                                                py: 1.5
                                            }}
                                        >
                                            Change Thumbnail
                                        </Button>
                                    </Box>
                                </Box>
                            </Paper>

                            {/* Danger Zone */}
                            <Paper 
                                elevation={0}
                                className="p-6 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200"
                            >
                                <Typography
                                    variant="h6"
                                    className="font-bold text-red-800 mb-4 flex items-center gap-2"
                                >
                                    ⚠️ Danger Zone
                                </Typography>
                                <Box className="bg-white/80 p-6 rounded-xl border border-red-200">
                                    <Typography
                                        variant="body1"
                                        className="text-red-700 mb-4 leading-relaxed"
                                    >
                                        ⚠️ <strong>Warning:</strong> Deleting this course will permanently remove all content, 
                                        student progress, reviews, and enrollment data. This action cannot be undone.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        startIcon={<DeleteOutlined />}
                                        onClick={() => console.log("Delete course logic")}
                                        sx={{
                                            background: 'linear-gradient(45deg, #dc2626, #b91c1c)',
                                            borderRadius: '16px',
                                            textTransform: 'none',
                                            fontWeight: 'bold',
                                            px: 4,
                                            py: 1.5,
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #b91c1c, #991b1b)',
                                            }
                                        }}
                                    >
                                        Delete Course Permanently
                                    </Button>
                                </Box>
                            </Paper>
                        </CardContent>
                    </Card>
                )}
            </Container>
            
            {/* Modals */}
            <EditCourseModal
                open={editCourseModalOpen}
                onClose={() => setEditCourseModalOpen(false)}
                course={course}
            />
            
            {courseContent && (
                <ManageCourseContentModal
                    open={manageContentModalOpen}
                    onClose={() => setManageContentModalOpen(false)}
                    sections={courseContent.sections}
                    courseId={course.id}
                />
            )}
        </Box>
    );
}
