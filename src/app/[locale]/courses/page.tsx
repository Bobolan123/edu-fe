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
    Pagination, 
    FormControl,
    FormLabel,
    FormGroup,
    Checkbox,
    FormControlLabel,
    Slider,
    Divider,
    Chip,
    Stack
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

// Sample data - replace with actual data from your backend
const allCourses = [
    {
        id: 1,
        title: "Complete Web Development Bootcamp",
        instructor: "John Doe",
        price: 99.99,
        thumbnail: "/sample/web-dev.jpg",
        average_rating: 4.8,
        category: "Web Development",
        students: 15000
    },
    {
        id: 2,
        title: "Data Science Fundamentals",
        instructor: "Jane Smith",
        price: 89.99,
        thumbnail: "/sample/data-science.jpg",
        average_rating: 4.6,
        category: "Data Science",
        students: 12000
    },
    {
        id: 3,
        title: "Mobile App Development with React Native",
        instructor: "Mike Johnson",
        price: 79.99,
        thumbnail: "/sample/mobile-dev.jpg",
        average_rating: 4.7,
        category: "Mobile Development",
        students: 10000
    },
    {
        id: 4,
        title: "UI/UX Design Principles",
        instructor: "Sarah Wilson",
        price: 69.99,
        thumbnail: "/sample/ui-ux.jpg",
        average_rating: 4.5,
        category: "UI/UX Design",
        students: 8000
    },
    {
        id: 5,
        title: "Advanced JavaScript Course",
        instructor: "Alex Brown",
        price: 89.99,
        thumbnail: "/sample/js.jpg",
        average_rating: 4.4,
        category: "Web Development",
        students: 9500
    },
    {
        id: 6,
        title: "Python Programming Masterclass",
        instructor: "Emily Davis",
        price: 94.99,
        thumbnail: "/sample/python.jpg",
        average_rating: 4.9,
        category: "Programming",
        students: 20000
    },
    {
        id: 7,
        title: "Machine Learning with Python",
        instructor: "Chris Lee",
        price: 99.99,
        thumbnail: "/sample/ml.jpg",
        average_rating: 4.7,
        category: "Machine Learning",
        students: 15000
    },
    {
        id: 8,
        title: "Cybersecurity Essentials",
        instructor: "David Brown",
        price: 79.99,
        thumbnail: "/sample/cyber.jpg",
        average_rating: 4.6,
        category: "Cybersecurity",
        students: 12000
    }
];

const categories = [
    "Web Development",
    "Data Science",
    "Mobile Development",
    "UI/UX Design",
    "Programming",
    "Machine Learning",
    "Cybersecurity"
];

const coursesPerPage = 6;

export default function CoursesPage() {
    const [page, setPage] = useState(1);
    const [ratingFilter, setRatingFilter] = useState<number[]>([0, 5]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleRatingChange = (event: Event, newValue: number | number[]) => {
        setRatingFilter(newValue as number[]);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategories(prev => 
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
        setPage(1); // Reset to first page when filter changes
    };

    const filteredCourses = allCourses.filter(course => {
        const matchesRating = course.average_rating >= ratingFilter[0] && course.average_rating <= ratingFilter[1];
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(course.category);
        return matchesRating && matchesCategory;
    });

    const paginatedCourses = filteredCourses.slice((page - 1) * coursesPerPage, page * coursesPerPage);

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Grid container spacing={4}>
                {/* Filters Sidebar */}
                <Grid item xs={12} md={3}>
                    <Box sx={{ position: 'sticky', top: 20 }}>
                        <Typography variant="h6" gutterBottom>
                            Filters
                        </Typography>
                        
                        {/* Rating Filter */}
                        <Box sx={{ mb: 4 }}>
                            <Typography gutterBottom>Rating</Typography>
                            <Slider
                                value={ratingFilter}
                                onChange={handleRatingChange}
                                valueLabelDisplay="auto"
                                min={0}
                                max={5}
                                step={0.5}
                                marks={[
                                    { value: 0, label: '0' },
                                    { value: 5, label: '5' }
                                ]}
                            />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Category Filter */}
                        <FormControl component="fieldset" sx={{ width: '100%' }}>
                            <FormLabel component="legend">Categories</FormLabel>
                            <FormGroup>
                                {categories.map((category) => (
                                    <FormControlLabel
                                        key={category}
                                        control={
                                            <Checkbox 
                                                checked={selectedCategories.includes(category)}
                                                onChange={() => handleCategoryChange(category)}
                                            />
                                        }
                                        label={category}
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>
                    </Box>
                </Grid>

                {/* Course List */}
                <Grid item xs={12} md={9}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            All Courses
                        </Typography>
                        <Typography color="text.secondary">
                            {filteredCourses.length} courses found
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {paginatedCourses.map((course) => (
                            <Grid item key={course.id} xs={12} sm={6} lg={4}>
                                <Card 
                                    sx={{ 
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 6
                                        }
                                    }}
                                >
                                    <CardMedia
                                        component="div"
                                        sx={{ height: 160, backgroundColor: 'grey.200' }}
                                        title={course.title}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Chip 
                                            label={course.category}
                                            size="small"
                                            sx={{ mb: 1 }}
                                        />
                                        <Typography variant="h6" component="h3" gutterBottom noWrap>
                                            {course.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {course.instructor}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Rating 
                                                value={course.average_rating} 
                                                precision={0.1} 
                                                readOnly 
                                                size="small"
                                            />
                                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                                ({course.average_rating})
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <PersonIcon sx={{ fontSize: 20, color: 'text.secondary', mr: 0.5 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {course.students.toLocaleString()} students
                                            </Typography>
                                        </Box>
                                        <Typography variant="h6" color="primary">
                                            ${course.price.toFixed(2)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                        <Pagination 
                            count={Math.ceil(filteredCourses.length / coursesPerPage)} 
                            page={page} 
                            onChange={handlePageChange}
                            color="primary"
                            size="large"
                        />
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}
