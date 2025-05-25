// Updated version using MUI and Tailwind instead of ShadCN UI components.

"use client";

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Tabs,
  Tab,
  Button,
  Avatar,
  Chip,
  TextField,
  Divider,
  IconButton,
  LinearProgress,
  Grid,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  PlayArrow,
  Visibility,
  People,
  Star,
  MonetizationOn,
  AccessTime,
  Event,
  BarChart,
  TrendingUp,
} from "@mui/icons-material";

// Mock data based on the entities
const courseData = {
    id: 1,
    title: "Advanced React Development",
    description:
      "Master React with hooks, context, performance optimization, and modern patterns. Build production-ready applications with confidence.",
    instructor: {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    duration: 1200, // minutes
    date_created: new Date("2024-01-15"),
    last_updated: new Date("2024-01-20"),
    price: 99.99,
    average_rating: 4.7,
    total_reviews: 234,
    thumbnail_url: "/placeholder.svg?height=200&width=300",
    categories: [
      { id: 1, name: "Web Development" },
      { id: 2, name: "React" },
      { id: 3, name: "JavaScript" },
    ],
    enrollments: Array.from({ length: 1250 }, (_, i) => ({ id: i + 1 })),
    reviews: Array.from({ length: 234 }, (_, i) => ({
      id: i + 1,
      rating: Math.floor(Math.random() * 5) + 1,
      comment: "Great course!",
      student: { name: `Student ${i + 1}` },
    })),
  }
  
  const courseContent = {
    courseId: 1,
    sections: [
      {
        title: "Getting Started",
        totalLectures: 5,
        lectures: [
          { title: "Introduction to React", totalDuration: "15:30", videoUrl: "video1.mp4" },
          { title: "Setting up Development Environment", totalDuration: "12:45", videoUrl: "video2.mp4" },
          { title: "Your First Component", totalDuration: "18:20", videoUrl: "video3.mp4" },
          { title: "JSX Fundamentals", totalDuration: "22:15", videoUrl: "video4.mp4" },
          { title: "Props and State", totalDuration: "25:10", videoUrl: "video5.mp4" },
        ],
      },
      {
        title: "Advanced Concepts",
        totalLectures: 8,
        lectures: [
          { title: "React Hooks Deep Dive", totalDuration: "35:45", videoUrl: "video6.mp4" },
          { title: "Context API", totalDuration: "28:30", videoUrl: "video7.mp4" },
          { title: "Performance Optimization", totalDuration: "42:15", videoUrl: "video8.mp4" },
        ],
      },
      {
        title: "Project Building",
        totalLectures: 6,
        lectures: [
          { title: "Planning the Project", totalDuration: "20:00", videoUrl: "video9.mp4" },
          { title: "Building Components", totalDuration: "45:30", videoUrl: "video10.mp4" },
        ],
      },
    ],
  }
export default function ManageDetailCourse() {
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [courseInfo, setCourseInfo] = useState(courseData);

  const totalDurationHours = Math.floor(courseData.duration / 60);
  const totalDurationMinutes = courseData.duration % 60;
  const totalLectures = courseContent.sections.reduce((acc, section) => acc + section.totalLectures, 0);

  const handleTabChange = (_:any, newValue:any) => setActiveTab(newValue);

  return (
    <Box className="bg-gray-50 min-h-screen p-6">
      <Box className="max-w-7xl mx-auto space-y-6">
        <Card>
          <CardContent>
            <Box className="flex flex-col md:flex-row justify-between gap-6">
              <Box className="flex gap-4">
                <img
                  src={courseInfo.thumbnail_url || "/placeholder.svg"}
                  alt={courseInfo.title}
                  className="w-32 h-24 object-cover rounded border"
                />
                <Box>
                  <Typography variant="h5" fontWeight="bold">{courseInfo.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{courseInfo.description}</Typography>
                  <Box className="flex gap-2 mt-2 text-sm text-gray-500">
                    <Event fontSize="small" /> {courseInfo.date_created.toLocaleDateString()}
                    <AccessTime fontSize="small" /> {totalDurationHours}h {totalDurationMinutes}m
                    <BarChart fontSize="small" /> {totalLectures} lectures
                  </Box>
                  <Box className="flex gap-2 mt-2">
                    {courseInfo.categories.map(cat => (
                      <Chip key={cat.id} label={cat.name} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              </Box>
              <Box className="text-right space-y-2">
                <Typography variant="h6" color="green">${courseInfo.price}</Typography>
                <Box className="flex items-center gap-1">
                  <Star fontSize="small" sx={{ color: 'gold' }} />
                  <Typography>{courseInfo.average_rating}</Typography>
                  <Typography variant="body2" color="text.secondary">({courseInfo.total_reviews} reviews)</Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardHeader title="Total Students" avatar={<People />} />
              <CardContent>
                <Typography variant="h6">{courseInfo.enrollments.length.toLocaleString()}</Typography>
                <Typography variant="caption" color="text.secondary">
                  <TrendingUp fontSize="small" className="inline mr-1" />+12% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardHeader title="Revenue" avatar={<MonetizationOn />} />
              <CardContent>
                <Typography variant="h6">
                  ${(courseInfo.enrollments.length * courseInfo.price).toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  <TrendingUp fontSize="small" className="inline mr-1" />+8% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardHeader title="Completion Rate" avatar={<BarChart />} />
              <CardContent>
                <Typography variant="h6">78%</Typography>
                <LinearProgress value={78} variant="determinate" className="mt-2" />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardHeader title="Avg. Rating" avatar={<Star />} />
              <CardContent>
                <Typography variant="h6">{courseInfo.average_rating}</Typography>
                <Typography variant="caption" color="text.secondary">From {courseInfo.total_reviews} reviews</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable">
          <Tab label="Overview" value={0} />
          <Tab label="Content" value={1} />
          <Tab label="Students" value={2} />
          <Tab label="Reviews" value={3} />
          <Tab label="Settings" value={4} />
        </Tabs>

        {/* Tab Content Example */}
        {activeTab === 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6">Course Overview</Typography>
              {/* More MUI components inside depending on `isEditing` state */}
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}
