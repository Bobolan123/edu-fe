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
  Divider
} from "@mui/material";
import {
  People,
  Star,
  MonetizationOn,
  AccessTime,
  Event,
  BarChart,
  TrendingUp,
  PlayArrow
} from "@mui/icons-material";
import { ICourse, ICourseContent } from "../../../../types/entities";

interface ManageDetailCourseProps {
  course: ICourse;
  courseContent: ICourseContent;
}

export default function ManageDetailCourse({ course, courseContent }: ManageDetailCourseProps) {
  const [activeTab, setActiveTab] = useState(0);

  const totalDurationHours = Math.floor(course.duration / 60);
  const totalDurationMinutes = course.duration % 60;
  const totalLectures = courseContent.sections.reduce((acc, section) => acc + section.totalLectures, 0);

  const handleTabChange = (_: any, newValue: number) => setActiveTab(newValue);

  return (
    <Box className="bg-gray-50 min-h-screen p-6">
      <Box className="max-w-7xl mx-auto space-y-6">
        <Card>
          <CardContent>
            <Box className="flex flex-col md:flex-row justify-between gap-6">
              <Box className="flex gap-4">
                <img
                  src={course.thumbnail_url || "/placeholder.svg"}
                  alt={course.title}
                  className="w-32 h-24 object-cover rounded border"
                />
                <Box>
                  <Typography variant="h5" fontWeight="bold">{course.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{course.description}</Typography>
                  <Box className="flex gap-2 mt-2 text-sm text-gray-500">
                    <Event fontSize="small" /> {new Date(course.date_created).toLocaleDateString()}
                    <AccessTime fontSize="small" /> {totalDurationHours}h {totalDurationMinutes}m
                    <BarChart fontSize="small" /> {totalLectures} lectures
                  </Box>
                  <Box className="flex gap-2 mt-2">
                    {course.categories.map(cat => (
                      <Chip key={cat.id} label={cat.name} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              </Box>
              <Box className="text-right space-y-2">
                <Typography variant="h6" color="green">${course.price}</Typography>
                <Box className="flex items-center gap-1">
                  <Star fontSize="small" sx={{ color: 'gold' }} />
                  <Typography>{course.average_rating}</Typography>
                  <Typography variant="body2" color="text.secondary">({course.total_reviews} reviews)</Typography>
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
                <Typography variant="h6">{course.enrollments?.length.toLocaleString()}</Typography>
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
                  ${(course.enrollments?.length * course.price).toLocaleString()}
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
                <Typography variant="h6">{course.average_rating}</Typography>
                <Typography variant="caption" color="text.secondary">From {course.total_reviews} reviews</Typography>
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

        {activeTab === 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6">Course Overview</Typography>
              <Typography>{course.description}</Typography>
            </CardContent>
          </Card>
        )}

        {activeTab === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Course Content</Typography>
              {courseContent.sections.map((section, index) => (
                <Box key={index} mb={4}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {section.title} ({section.totalLectures} lectures)
                  </Typography>
                  <List dense>
                    {section.lectures.map((lecture, i) => (
                      <ListItem key={i}>
                        <ListItemIcon>
                          <PlayArrow fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={lecture.title} secondary={lecture.totalDuration} />
                      </ListItem>
                    ))}
                  </List>
                  <Divider className="my-4" />
                </Box>
              ))}
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}
