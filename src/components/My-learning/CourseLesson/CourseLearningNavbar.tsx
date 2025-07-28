'use client'

import Image from "next/image";
import Link from "next/link";
import { ICourse, ICourseContent, IEnrollment, ILecture } from "../../../../types/entities";

type EnrollmentProgress = IEnrollment & {
    lectureProgress: ILecture[];
    progressPercentage: number;
};
import { Typography, Box, IconButton, Tooltip, LinearProgress, CircularProgress, CircularProgressProps } from "@mui/material";
import { ArrowBack as ArrowBackIcon, Share as ShareIcon, MoreVert as MoreVertIcon } from "@mui/icons-material";
import { useState } from "react";

interface CourseLearningNavbarProps {
    course: ICourse;
    courseContent?: ICourseContent;
    enrollmentProgress?: EnrollmentProgress;
}

// Helper component to display progress inside the circular progress bar
function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                    sx={{ fontWeight: 'medium' }}
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}


export default function CourseLearningNavbar({ course, courseContent, enrollmentProgress }: CourseLearningNavbarProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // Calculate progress based on enrollment progress data
    const calculateProgress = (): number => {
        if (enrollmentProgress?.progressPercentage !== undefined) {
            return Math.round(enrollmentProgress.progressPercentage);
        }
        
        // Fallback calculation if progressPercentage is not available
        if (!courseContent?.sections || !enrollmentProgress?.lectureProgress) return 0;
        
        let totalLectures = 0;
        let completedLectures = 0;
        
        courseContent.sections.forEach(section => {
            section.lectures?.forEach(lecture => {
                totalLectures++;
                // Check if this lecture is in the completed lectures from enrollment progress
                const isCompleted = enrollmentProgress.lectureProgress.some(
                    progressLecture => progressLecture._id === lecture._id
                );
                if (isCompleted) {
                    completedLectures++;
                }
            });
        });
        
        return totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;
    };

    const progress = calculateProgress();

    return (
        <div className="bg-white border-b border-gray-200">
            <div className="w-full">
                <LinearProgress variant="determinate" value={progress} />
            </div>
            <div className="container mx-auto px-4 py-2 flex items-center min-h-[64px]">
                    <Tooltip title="Back to Courses">
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="back to courses"
                            component={Link}
                            href="/my-learning"
                            className="hover:bg-gray-200 transition-colors"
                        >
                            <ArrowBackIcon />
                        </IconButton>
                    </Tooltip>
                    
                    <Box className="flex items-center gap-3 ml-2 flex-grow">
                        <Link href="/" className="flex items-center">
                              <Image
                                  src="/logo.png"
                                  alt="Logo"
                                  width={32}
                                  height={32}
                                  className="object-contain"
                              />
                        </Link>
                         <div className="h-6 w-px bg-gray-300 hidden sm:block" />
                        <Typography
                            variant="h6"
                            component="div"
                            className="font-medium text-gray-800 line-clamp-1 flex-grow"
                            sx={{ flexGrow: 1 }}
                        >
                            {course?.title || "Course Title"}
                        </Typography>
                    </Box>

                    <Box className="flex items-center gap-4">
                       <Tooltip title={`${progress}% Complete`}>
                         <div className="flex items-center gap-2">
                             <CircularProgressWithLabel value={progress} size={40} thickness={4}/>
                         </div>
                       </Tooltip>
                       
                        <Tooltip title="Share Course">
                            <IconButton color="inherit" aria-label="share course" className="hover:bg-gray-200 transition-colors">
                                <ShareIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="More Options">
                            <IconButton
                                color="inherit"
                                aria-label="more options"
                                onClick={handleClick}
                                className="hover:bg-gray-200 transition-colors"
                            >
                                <MoreVertIcon />
                            </IconButton>
                        </Tooltip>
                        {/* Note: The Menu component for more options can be added here if needed */}
                    </Box>
            </div>
        </div>
    );
}