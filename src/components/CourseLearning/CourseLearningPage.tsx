"use client";

import { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Chip,
    LinearProgress,
    Divider,
    Collapse,
    IconButton,
} from "@mui/material";
import {
    PlayArrow as PlayIcon,
    CheckCircle as CheckIcon,
    ExpandLess,
    ExpandMore,
    Quiz as QuizIcon,
} from "@mui/icons-material";
import { ICourse, ICourseContent, ICourseSection, ICourseLecture } from "../../../types/entities";
import VideoPlayerWithProgress from "../VideoPlayer/VideoPlayerWithProgress";
import { useTranslations } from "next-intl";

interface CourseLearningPageProps {
    course: ICourse;
    courseContent: ICourseContent;
    enrollmentId: string;
    initialProgress?: Record<string, number>; // lectureId -> watchTime
    completedLectures?: string[]; // array of completed lecture IDs
}

const CourseLearningPage = ({
    course,
    courseContent,
    enrollmentId,
    initialProgress = {},
    completedLectures = [],
}: CourseLearningPageProps) => {
    const t = useTranslations("CourseLearning");
    const [currentLecture, setCurrentLecture] = useState<ICourseLecture | null>(null);
    const [currentSection, setCurrentSection] = useState<ICourseSection | null>(null);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const [lectureProgress, setLectureProgress] = useState<Record<string, number>>(initialProgress);
    const [completedLectureIds, setCompletedLectureIds] = useState<Set<string>>(
        new Set(completedLectures)
    );

    // Auto-select first lecture on mount
    useEffect(() => {
        if (courseContent?.sections?.[0]?.lectures?.[0]) {
            const firstSection = courseContent.sections[0];
            const firstLecture = firstSection.lectures[0];
            setCurrentSection(firstSection);
            setCurrentLecture(firstLecture);
            setExpandedSections({ [firstSection.id]: true });
        }
    }, [courseContent]);

    const handleLectureSelect = (section: ICourseSection, lecture: ICourseLecture) => {
        setCurrentSection(section);
        setCurrentLecture(lecture);
    };

    const handleSectionToggle = (sectionId: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    };

    const handleLectureComplete = (lectureId: string) => {
        setCompletedLectureIds(prev => new Set([...prev, lectureId]));
    };

    const handleProgressChange = (lectureId: string, progress: number) => {
        setLectureProgress(prev => ({
            ...prev,
            [lectureId]: progress,
        }));
    };

    const getNextLecture = () => {
        if (!courseContent || !currentLecture || !currentSection) return null;

        const currentSectionIndex = courseContent.sections.findIndex(s => s.id === currentSection.id);
        const currentLectureIndex = currentSection.lectures.findIndex(l => l.id === currentLecture.id);

        // Try next lecture in current section
        if (currentLectureIndex < currentSection.lectures.length - 1) {
            return {
                section: currentSection,
                lecture: currentSection.lectures[currentLectureIndex + 1],
            };
        }

        // Try first lecture in next section
        if (currentSectionIndex < courseContent.sections.length - 1) {
            const nextSection = courseContent.sections[currentSectionIndex + 1];
            if (nextSection.lectures.length > 0) {
                return {
                    section: nextSection,
                    lecture: nextSection.lectures[0],
                };
            }
        }

        return null;
    };

    const goToNextLecture = () => {
        const next = getNextLecture();
        if (next) {
            handleLectureSelect(next.section, next.lecture);
            setExpandedSections(prev => ({
                ...prev,
                [next.section.id]: true,
            }));
        }
    };

    const calculateSectionProgress = (section: ICourseSection) => {
        const completed = section.lectures.filter(lecture =>
            completedLectureIds.has(lecture.id)
        ).length;
        return Math.round((completed / section.lectures.length) * 100);
    };

    const calculateOverallProgress = () => {
        if (!courseContent) return 0;

        const totalLectures = courseContent.sections.reduce(
            (total, section) => total + section.lectures.length,
            0
        );

        if (totalLectures === 0) return 0;

        return Math.round((completedLectureIds.size / totalLectures) * 100);
    };

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };


    return (
        <Box sx={{ height: '100vh', overflow: 'hidden' }}>
            <Grid container sx={{ height: '100%' }}>
                {/* Course Content Sidebar */}
                <Grid item xs={12} md={4} lg={3}>
                    <Paper sx={{ height: '100%', overflow: 'auto' }}>
                        <Box p={2}>
                            <Typography variant="h6" gutterBottom>
                                {course.title}
                            </Typography>

                            {/* Overall Progress */}
                            <Box mb={2}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="body2">{t("course_progress")}</Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        {calculateOverallProgress()}%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={calculateOverallProgress()}
                                    sx={{ height: 8, borderRadius: 4 }}
                                />
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            {/* Course Sections and Lectures */}
                            <List>
                                {courseContent?.sections?.map((section, sectionIndex) => (
                                    <Box key={section.id}>
                                        <ListItem disablePadding>
                                            <ListItemButton onClick={() => handleSectionToggle(section.id)}>
                                                <ListItemText
                                                    primary={
                                                        <Box>
                                                            <Typography variant="subtitle2" fontWeight="bold">
                                                                {sectionIndex + 1}. {section.title}
                                                            </Typography>
                                                            <Box display="flex" justifyContent="space-between" mt={1}>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {t("lectures_count", { count: section.lectures.length })}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {t("section_progress", { percent: calculateSectionProgress(section) })}
                                                                </Typography>
                                                            </Box>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={calculateSectionProgress(section)}
                                                                sx={{ mt: 0.5, height: 4 }}
                                                            />
                                                        </Box>
                                                    }
                                                />
                                                {expandedSections[section.id] ? <ExpandLess /> : <ExpandMore />}
                                            </ListItemButton>
                                        </ListItem>

                                        <Collapse in={expandedSections[section.id]}>
                                            <List component="div" disablePadding>
                                                {section.lectures.map((lecture, lectureIndex) => (
                                                    <ListItem key={lecture.id} disablePadding>
                                                        <ListItemButton
                                                            sx={{ pl: 4 }}
                                                            selected={currentLecture?.id === lecture.id}
                                                            onClick={() => handleLectureSelect(section, lecture)}
                                                        >
                                                            <ListItemIcon>
                                                                {completedLectureIds.has(lecture.id) ? (
                                                                    <CheckIcon color="success" />
                                                                ) : lecture.contentType === 'video' ? (
                                                                    <PlayIcon />
                                                                ) : (
                                                                    <QuizIcon />
                                                                )}
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={
                                                                    <Typography variant="body2">
                                                                        {lectureIndex + 1}. {lecture.title}
                                                                    </Typography>
                                                                }
                                                                secondary={
                                                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                                                        <Chip
                                                                            label={lecture.contentType}
                                                                            size="small"
                                                                            variant="outlined"
                                                                        />
                                                                        <Typography variant="caption">
                                                                            {formatDuration(lecture.durationSeconds || 0)}
                                                                        </Typography>
                                                                    </Box>
                                                                }
                                                            />
                                                        </ListItemButton>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Collapse>
                                    </Box>
                                ))}
                            </List>
                        </Box>
                    </Paper>
                </Grid>

                {/* Main Content Area */}
                <Grid item xs={12} md={8} lg={9}>
                    <Box sx={{ height: '100%', p: 2, overflow: 'auto' }}>
                        {currentLecture ? (
                            <Box>
                                {/* Lecture Header */}
                                <Box mb={3}>
                                    <Typography variant="h4" gutterBottom>
                                        {currentLecture.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" gutterBottom>
                                        {currentSection?.title}
                                    </Typography>
                                    <Box display="flex" gap={1} alignItems="center">
                                        <Chip
                                            label={currentLecture.contentType}
                                            color="primary"
                                            variant="outlined"
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            {t("duration", { duration: formatDuration(currentLecture.durationSeconds || 0) })}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Lecture Content */}
                                {currentLecture.contentType === 'video' ? (
                                    <VideoPlayerWithProgress
                                        lecture={currentLecture}
                                        courseId={course.id}
                                        enrollmentId={enrollmentId}
                                        initialProgress={lectureProgress[currentLecture.id] || 0}
                                        onLectureComplete={(lectureId) => {
                                            handleLectureComplete(lectureId);
                                            // Auto-advance to next lecture
                                            setTimeout(goToNextLecture, 2000);
                                        }}
                                        onProgressChange={(progress) =>
                                            handleProgressChange(currentLecture.id, progress)
                                        }
                                    />
                                ) : (
                                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                                        <QuizIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                        <Typography variant="h6" gutterBottom>
                                            {t("quiz_title", { title: currentLecture.title })}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {t("quiz_coming_soon")}
                                        </Typography>
                                    </Paper>
                                )}
                            </Box>
                        ) : (
                            <Box textAlign="center" py={8}>
                                <Typography variant="h6" color="text.secondary">
                                    {t("select_lecture")}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CourseLearningPage;