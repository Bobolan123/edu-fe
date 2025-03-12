'use client'

import { useState } from 'react';
import { 
    Container, 
    Grid, 
    Card, 
    CardContent, 
    CardMedia, 
    Typography, 
    Rating, 
    Box, 
    Divider, 
    Avatar, 
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Paper,
    Chip,
    IconButton,
    Tab,
    Tabs
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LanguageIcon from '@mui/icons-material/Language';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import VerifiedIcon from '@mui/icons-material/Verified';
import { format } from 'date-fns';

// Sample data - replace with actual data from your backend
const courseDetail = {
    id: 1,
    title: "Complete Web Development Bootcamp",
    description: "Learn web development from scratch. This comprehensive course covers HTML, CSS, JavaScript, React, Node.js, and more. Perfect for beginners and intermediate developers looking to expand their skills.",
    instructor: {
        id: 1,
        name: "John Doe",
        avatar: "/avatars/john-doe.jpg",
        bio: "Senior Web Developer with 10+ years of experience. Passionate about teaching and helping others learn to code.",
        totalStudents: 50000,
        totalCourses: 12,
        averageRating: 4.8
    },
    price: 99.99,
    thumbnail: "/sample/web-dev.jpg",
    average_rating: 4.8,
    category: "Web Development",
    students: 15000,
    duration: "48 hours",
    language: "English",
    lastUpdated: "2024-02-15",
    requirements: [
        "Basic understanding of computers",
        "No prior programming experience needed",
        "Willingness to learn and practice"
    ],
    whatYouWillLearn: [
        "Build responsive websites using HTML5 and CSS3",
        "Master JavaScript and modern ES6+ features",
        "Create full-stack applications with React and Node.js",
        "Deploy your applications to the cloud",
        "Work with databases and APIs"
    ],
    lessons: [
        {
            id: 1,
            title: "Introduction to Web Development",
            duration: "45 minutes"
        },
        {
            id: 2,
            title: "HTML Fundamentals",
            duration: "1.5 hours"
        },
        {
            id: 3,
            title: "CSS Styling and Layout",
            duration: "2 hours"
        }
    ]
};

const similarCourses = [
    {
        id: 2,
        title: "Advanced JavaScript Masterclass",
        instructor: "Jane Smith",
        price: 89.99,
        thumbnail: "/sample/js.jpg",
        average_rating: 4.7,
        students: 12000
    },
    {
        id: 3,
        title: "React.js for Beginners",
        instructor: "Mike Johnson",
        price: 79.99,
        thumbnail: "/sample/react.jpg",
        average_rating: 4.6,
        students: 10000
    }
];

const reviews = [
    {
        id: 1,
        user: {
            name: "Alice Johnson",
            avatar: "/avatars/alice.jpg"
        },
        rating: 5,
        comment: "Excellent course! The instructor explains everything clearly and the projects are very practical.",
        date_reviewed: "2024-02-10T10:00:00Z"
    },
    {
        id: 2,
        user: {
            name: "Bob Smith",
            avatar: "/avatars/bob.jpg"
        },
        rating: 4,
        comment: "Very comprehensive course. Would recommend to anyone starting with web development.",
        date_reviewed: "2024-02-08T15:30:00Z"
    }
];

export default function CourseDetailPage({ params }: { params: { id: string } }) {
    const [currentTab, setCurrentTab] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* Course Header */}
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        {courseDetail.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        {courseDetail.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Rating value={courseDetail.average_rating} precision={0.1} readOnly />
                        <Typography>({courseDetail.average_rating})</Typography>
                        <Typography>•</Typography>
                        <Typography>{courseDetail.students.toLocaleString()} students</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTimeIcon sx={{ mr: 1 }} />
                            <Typography>{courseDetail.duration}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LanguageIcon sx={{ mr: 1 }} />
                            <Typography>{courseDetail.language}</Typography>
                        </Box>
                        <Typography>Last updated: {format(new Date(courseDetail.lastUpdated), 'MMM dd, yyyy')}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="200"
                            image={courseDetail.thumbnail}
                            alt={courseDetail.title}
                        />
                        <CardContent>
                            <Typography variant="h4" gutterBottom>
                                ${courseDetail.price}
                            </Typography>
                            <Button variant="contained" color="primary" fullWidth sx={{ mb: 2 }}>
                                Enroll Now
                            </Button>
                            <Typography variant="body2" color="text.secondary" align="center">
                                30-day money-back guarantee
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Course Content Tabs */}
            <Box sx={{ mt: 6 }}>
                <Tabs value={currentTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab label="Overview" />
                    <Tab label="Curriculum" />
                    <Tab label="Instructor" />
                    <Tab label="Reviews" />
                </Tabs>

                {/* Overview Tab */}
                <Box hidden={currentTab !== 0} sx={{ py: 4 }}>
                    <Typography variant="h5" gutterBottom>What you'll learn</Typography>
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        {courseDetail.whatYouWillLearn.map((item, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                    <VerifiedIcon color="primary" />
                                    <Typography>{item}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    <Typography variant="h5" gutterBottom>Requirements</Typography>
                    <List>
                        {courseDetail.requirements.map((req, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={req} />
                            </ListItem>
                        ))}
                    </List>
                </Box>

                {/* Curriculum Tab */}
                <Box hidden={currentTab !== 1} sx={{ py: 4 }}>
                    <List>
                        {courseDetail.lessons.map((lesson) => (
                            <ListItem
                                key={lesson.id}
                                sx={{
                                    border: 1,
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    mb: 1
                                }}
                            >
                                <ListItemAvatar>
                                    <PlayCircleOutlineIcon />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={lesson.title}
                                    secondary={`Duration: ${lesson.duration}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>

                {/* Instructor Tab */}
                <Box hidden={currentTab !== 2} sx={{ py: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                        <Avatar
                            src={courseDetail.instructor.avatar}
                            sx={{ width: 100, height: 100 }}
                        />
                        <Box>
                            <Typography variant="h5">{courseDetail.instructor.name}</Typography>
                            <Typography color="text.secondary" gutterBottom>
                                {courseDetail.instructor.bio}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
                                <Box>
                                    <Typography variant="h6">{courseDetail.instructor.totalStudents.toLocaleString()}</Typography>
                                    <Typography color="text.secondary">Students</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h6">{courseDetail.instructor.totalCourses}</Typography>
                                    <Typography color="text.secondary">Courses</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h6">{courseDetail.instructor.averageRating}</Typography>
                                    <Typography color="text.secondary">Rating</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Reviews Tab */}
                <Box hidden={currentTab !== 3} sx={{ py: 4 }}>
                    {reviews.map((review) => (
                        <Paper key={review.id} sx={{ p: 3, mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Avatar src={review.user.avatar} />
                                <Box>
                                    <Typography variant="subtitle1">{review.user.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {format(new Date(review.date_reviewed), 'MMM dd, yyyy')}
                                    </Typography>
                                </Box>
                            </Box>
                            <Rating value={review.rating} readOnly size="small" sx={{ mb: 1 }} />
                            <Typography>{review.comment}</Typography>
                        </Paper>
                    ))}
                </Box>
            </Box>

            {/* Similar Courses */}
            <Box sx={{ mt: 8 }}>
                <Typography variant="h5" gutterBottom>
                    Similar Courses
                </Typography>
                <Grid container spacing={3}>
                    {similarCourses.map((course) => (
                        <Grid item key={course.id} xs={12} sm={6} md={4}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={course.thumbnail}
                                    alt={course.title}
                                />
                                <CardContent>
                                    <Typography variant="h6" noWrap gutterBottom>
                                        {course.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {course.instructor}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Rating value={course.average_rating} precision={0.1} readOnly size="small" />
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                            ({course.average_rating})
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6" color="primary">
                                        ${course.price}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
}
  