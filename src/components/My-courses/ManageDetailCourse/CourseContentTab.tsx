"use client";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Collapse,
    Chip,
    Paper,
    Button,
} from "@mui/material";
import {
    PlayArrow,
    Visibility,
    ExpandMore,
    Schedule,
    VideoLibrary,
    Edit,
    Quiz as QuizIcon,
} from "@mui/icons-material";
import { ICourseContent, ICourseSection, ICourseLecture } from "../../../../types/entities";
import { useState } from "react";
import { isValidCloudinaryVideoUrl } from "../../../utils/utils";

interface ICourseContentTabProps {
    sections: ICourseSection[];
    onEditContent?: () => void;
}

const CourseContentTab: React.FC<ICourseContentTabProps> = ({
    sections,
    onEditContent,
}) => {
    const [expandedVideos, setExpandedVideos] = useState<{
        [key: string]: boolean;
    }>({});

    const toggleVideo = (sectionIndex: number, lectureIndex: number) => {
        const key = `${sectionIndex}-${lectureIndex}`;
        setExpandedVideos((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const totalLectures = sections.reduce(
        (acc, section) => acc + (section.lectures?.length || 0),
        0
    );

    const totalDuration = "12h 45m"; // This would be calculated from actual video durations
 
    return (
        <Card 
            elevation={0}
            className="rounded-3xl border border-white/50 bg-white/95 backdrop-blur-sm"
        >
            <CardContent className="p-8">
                <Box className="mb-6">
                    <Box className="flex items-center justify-between mb-4">
                        <Typography 
                            variant="h4" 
                            className="font-bold text-gray-800 flex items-center gap-2"
                        >
                            📚 Course Content Overview
                        </Typography>
                        
                        {onEditContent && (
                            <Button
                                variant="contained"
                                startIcon={<Edit />}
                                onClick={onEditContent}
                                sx={{
                                    background: 'linear-gradient(45deg, #2563eb, #3b82f6)',
                                    borderRadius: '16px',
                                    textTransform: 'none',
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #1d4ed8, #2563eb)',
                                    }
                                }}
                            >
                                📝 Edit Course Content
                            </Button>
                        )}
                    </Box>
                    
                    <Box className="flex flex-wrap justify-center gap-4 mb-8">
                        <Paper 
                            elevation={0}
                            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50"
                        >
                            <Box className="flex items-center gap-2">
                                <VideoLibrary className="h-5 w-5 text-blue-600" />
                                <Typography className="font-bold text-blue-800">
                                    {sections.length} Sections
                                </Typography>
                            </Box>
                        </Paper>
                        
                        <Paper 
                            elevation={0}
                            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/50"
                        >
                            <Box className="flex items-center gap-2">
                                <PlayArrow className="h-5 w-5 text-purple-600" />
                                <Typography className="font-bold text-purple-800">
                                    {totalLectures} Lectures
                                </Typography>
                            </Box>
                        </Paper>
                        
                        <Paper 
                            elevation={0}
                            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/50"
                        >
                            <Box className="flex items-center gap-2">
                                <Schedule className="h-5 w-5 text-emerald-600" />
                                <Typography className="font-bold text-emerald-800">
                                    {totalDuration}
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>
                </Box>

                <Box className="space-y-6">
                    {sections.map((section, sectionIndex) => (
                        <Paper
                            key={sectionIndex}
                            elevation={0}
                            className="p-6 rounded-2xl bg-gradient-to-r from-purple-50/50 to-pink-50/50 border border-purple-100/50 hover:shadow-lg transition-shadow duration-200"
                        >
                            <Box className="mb-4">
                                <Typography
                                    variant="h6"
                                    className="font-bold text-gray-800 mb-2 flex items-center gap-2"
                                >
                                    📖 {section.title}
                                </Typography>
                                {section.description && (
                                    <Typography
                                        variant="body2"
                                        className="text-gray-600 mb-2"
                                    >
                                        {section.description}
                                    </Typography>
                                )}
                                
                                <Box className="flex items-center gap-4">
                                    <Chip
                                        label={`${section.lectures?.length || 0} lectures`}
                                        size="small"
                                        className="bg-purple-100 text-purple-700 font-medium"
                                        sx={{ borderRadius: '12px' }}
                                    />
                                    <Typography
                                        variant="body2"
                                        className="text-gray-600 font-medium"
                                    >
                                        Section {sectionIndex + 1}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box className="space-y-3">
                                {section.lectures?.map((lecture, lectureIndex) => {
                                    const videoKey = `${sectionIndex}-${lectureIndex}`;
                                    const isQuiz = lecture.contentType === 'quiz';
                                    const hasVideo = !isQuiz && lecture.content &&
                                        typeof lecture.content === 'object' &&
                                        'videoUrl' in lecture.content &&
                                        isValidCloudinaryVideoUrl(lecture.content.videoUrl);

                                    const quizQuestionsCount = isQuiz && lecture.content &&
                                        typeof lecture.content === 'object' &&
                                        'questions' in lecture.content
                                        ? lecture.content.questions?.length || 0
                                        : 0;

                                    const quizContent = isQuiz && lecture.content &&
                                        typeof lecture.content === 'object' &&
                                        'questions' in lecture.content
                                        ? lecture.content
                                        : null;

                                    return (
                                        <Box
                                            key={lectureIndex}
                                            className="bg-white/80 rounded-xl p-4 border border-purple-100/50 backdrop-blur-sm"
                                        >
                                            <Box className="flex items-center justify-between">
                                                <Box className="flex items-center gap-3 flex-1">
                                                    <Box className={`p-2 rounded-full text-white ${
                                                        isQuiz
                                                            ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                                                            : 'bg-gradient-to-r from-purple-400 to-pink-400'
                                                    }`}>
                                                        {isQuiz ? (
                                                            <QuizIcon fontSize="small" />
                                                        ) : (
                                                            <PlayArrow fontSize="small" />
                                                        )}
                                                    </Box>
                                                    <Box className="flex-1">
                                                        <Typography
                                                            variant="body1"
                                                            className="font-medium text-gray-800 mb-1"
                                                        >
                                                            {lecture.title}
                                                            {lecture.isPreview && ' (Preview)'}
                                                        </Typography>
                                                        {lecture.description && (
                                                            <Typography
                                                                variant="caption"
                                                                className="text-gray-600 block mb-1"
                                                            >
                                                                {lecture.description}
                                                            </Typography>
                                                        )}
                                                        <Box className="flex items-center gap-2">
                                                            <Chip
                                                                label={isQuiz ? 'Quiz' : 'Video'}
                                                                size="small"
                                                                className={`text-xs font-medium ${
                                                                    isQuiz
                                                                        ? 'bg-purple-100 text-purple-700'
                                                                        : 'bg-blue-100 text-blue-700'
                                                                }`}
                                                                sx={{ borderRadius: '8px' }}
                                                            />
                                                            {isQuiz ? (
                                                                <Chip
                                                                    label={`${quizQuestionsCount} question${quizQuestionsCount !== 1 ? 's' : ''}`}
                                                                    size="small"
                                                                    className="bg-indigo-100 text-indigo-700 text-xs font-medium"
                                                                    sx={{ borderRadius: '8px' }}
                                                                />
                                                            ) : (
                                                                <>
                                                                    {lecture.durationSeconds && (
                                                                        <Chip
                                                                            label={`${Math.floor(lecture.durationSeconds / 60)}m`}
                                                                            size="small"
                                                                            variant="outlined"
                                                                            className="text-xs border-gray-300 text-gray-600"
                                                                        />
                                                                    )}
                                                                    {hasVideo ? (
                                                                        <Chip
                                                                            label="Video available"
                                                                            size="small"
                                                                            className="bg-green-100 text-green-700 text-xs"
                                                                        />
                                                                    ) : (
                                                                        <Chip
                                                                            label="No video uploaded"
                                                                            size="small"
                                                                            className="bg-gray-100 text-gray-500 text-xs"
                                                                        />
                                                                    )}
                                                                </>
                                                            )}
                                                        </Box>

                                                    </Box>
                                                </Box>

                                                {(hasVideo || isQuiz) && (
                                                    <Box>
                                                        <Box
                                                            component="button"
                                                            onClick={() => toggleVideo(sectionIndex, lectureIndex)}
                                                            className={`p-2 rounded-full transition-colors duration-200 border-0 cursor-pointer ${
                                                                isQuiz
                                                                    ? 'bg-purple-100 hover:bg-purple-200 text-purple-600'
                                                                    : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                                                            }`}
                                                        >
                                                            <Visibility fontSize="small" />
                                                        </Box>
                                                    </Box>
                                                )}
                                            </Box>

                                            {hasVideo && (
                                                <Collapse in={expandedVideos[videoKey]}>
                                                    <Box className="mt-4 pt-4 border-t border-purple-100">
                                                        {lecture.content &&
                                                         typeof lecture.content === 'object' &&
                                                         'videoUrl' in lecture.content && (
                                                            <video
                                                                controls
                                                                className="rounded-xl w-full max-w-md border border-purple-200 shadow-sm"
                                                            >
                                                                <source
                                                                    src={lecture.content.videoUrl}
                                                                    type="video/mp4"
                                                                />
                                                            </video>
                                                        )}
                                                    </Box>
                                                </Collapse>
                                            )}

                                            {isQuiz && quizContent && (
                                                <Collapse in={expandedVideos[videoKey]}>
                                                    <Box className="mt-4 pt-4 border-t border-purple-100">
                                                        {/* Quiz Settings */}
                                                        <Box className="mb-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                                                            <Typography variant="subtitle2" className="font-bold text-purple-800 mb-2">
                                                                📋 Quiz Settings
                                                            </Typography>
                                                            <Box className="flex flex-wrap gap-3">
                                                                <Chip
                                                                    label={`Passing Score: ${quizContent.passingScore}%`}
                                                                    size="small"
                                                                    className="bg-white text-purple-700 font-medium"
                                                                />
                                                                {quizContent.timeLimit && (
                                                                    <Chip
                                                                        label={`Time Limit: ${quizContent.timeLimit} min`}
                                                                        size="small"
                                                                        className="bg-white text-purple-700 font-medium"
                                                                    />
                                                                )}
                                                                <Chip
                                                                    label="Retake on Fail"
                                                                    size="small"
                                                                    className="bg-white text-purple-700 font-medium"
                                                                />
                                                            </Box>
                                                        </Box>

                                                        {/* Questions List */}
                                                        <Typography variant="subtitle2" className="font-bold text-gray-800 mb-3">
                                                            Questions ({quizContent.questions.length})
                                                        </Typography>
                                                        <Box className="space-y-2">
                                                            {quizContent.questions.map((question, qIndex) => (
                                                                <Paper
                                                                    key={question.id}
                                                                    elevation={0}
                                                                    className="p-3 bg-white border border-purple-100 rounded-lg"
                                                                >
                                                                    <Box className="flex items-start justify-between gap-2">
                                                                        <Box className="flex-1">
                                                                            <Box className="flex items-center gap-2 mb-1">
                                                                                <Typography
                                                                                    variant="caption"
                                                                                    className="font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded"
                                                                                >
                                                                                    Q{qIndex + 1}
                                                                                </Typography>
                                                                                <Chip
                                                                                    label={
                                                                                        question.type === 'multiple_choice'
                                                                                            ? 'Multiple Choice'
                                                                                            : question.type === 'true_false'
                                                                                            ? 'True/False'
                                                                                            : 'Fill in Blank'
                                                                                    }
                                                                                    size="small"
                                                                                    className={`text-xs font-medium ${
                                                                                        question.type === 'multiple_choice'
                                                                                            ? 'bg-blue-100 text-blue-700'
                                                                                            : question.type === 'true_false'
                                                                                            ? 'bg-green-100 text-green-700'
                                                                                            : 'bg-orange-100 text-orange-700'
                                                                                    }`}
                                                                                />
                                                                                <Chip
                                                                                    label={`${question.points} pt${question.points !== 1 ? 's' : ''}`}
                                                                                    size="small"
                                                                                    className="text-xs bg-gray-100 text-gray-700"
                                                                                />
                                                                            </Box>
                                                                            <Typography variant="body2" className="text-gray-800">
                                                                                {question.question || 'Untitled Question'}
                                                                            </Typography>
                                                                            {question.type === 'multiple_choice' && question.options && (
                                                                                <Box className="mt-2 ml-4 space-y-1">
                                                                                    {question.options.map((option, oIndex) => (
                                                                                        <Typography
                                                                                            key={oIndex}
                                                                                            variant="caption"
                                                                                            className={`block ${
                                                                                                question.correctAnswer === oIndex
                                                                                                    ? 'text-green-700 font-bold'
                                                                                                    : 'text-gray-600'
                                                                                            }`}
                                                                                        >
                                                                                            {String.fromCharCode(65 + oIndex)}. {option}
                                                                                            {question.correctAnswer === oIndex && ' ✓'}
                                                                                        </Typography>
                                                                                    ))}
                                                                                </Box>
                                                                            )}
                                                                            {question.type === 'true_false' && (
                                                                                <Typography variant="caption" className="text-green-700 font-bold mt-1 block">
                                                                                    Answer: {String(question.correctAnswer).toUpperCase()} ✓
                                                                                </Typography>
                                                                            )}
                                                                            {question.type === 'fill_blank' && (
                                                                                <Typography variant="caption" className="text-green-700 font-bold mt-1 block">
                                                                                    Answer: {question.correctAnswer} ✓
                                                                                </Typography>
                                                                            )}
                                                                        </Box>
                                                                    </Box>
                                                                </Paper>
                                                            ))}
                                                        </Box>
                                                    </Box>
                                                </Collapse>
                                            )}
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Paper>
                    ))}
                </Box>

                {sections.length === 0 && (
                    <Paper 
                        elevation={0}
                        className="p-12 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 text-center"
                    >
                        <VideoLibrary className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <Typography 
                            variant="h6" 
                            className="font-bold text-gray-600 mb-2"
                        >
                            No Content Available
                        </Typography>
                        <Typography 
                            variant="body2" 
                            className="text-gray-500"
                        >
                            This course doesn't have any content yet. Use the management tools to add sections and lectures.
                        </Typography>
                    </Paper>
                )}
            </CardContent>
        </Card>
    );
};

export default CourseContentTab;
