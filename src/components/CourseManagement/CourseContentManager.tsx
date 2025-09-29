"use client";

import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    TextField,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
} from "@mui/material";
import {
    ExpandMore as ExpandMoreIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    CloudUpload as UploadIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import {
    getCourseContent,
    updateCourseContent,
    createCourseSection,
    createCourseLecture,
    uploadVideoToLecture,
} from "@/actions/courseContentAction";
import { ICourseContent, ICourseSection, ICourseLecture } from "../../../types/entities";

interface CourseContentManagerProps {
    courseId: number;
    onContentUpdate?: () => void;
}

const CourseContentManager = ({ courseId, onContentUpdate }: CourseContentManagerProps) => {
    const [content, setContent] = useState<ICourseContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
    const [lectureDialogOpen, setLectureDialogOpen] = useState(false);
    const [metadataDialogOpen, setMetadataDialogOpen] = useState(false);
    const [selectedSectionId, setSelectedSectionId] = useState<string>("");
    const [uploading, setUploading] = useState<string | null>(null);

    // Form states
    const [sectionForm, setSectionForm] = useState({
        title: "",
        description: "",
        orderIndex: 0
    });
    const [lectureForm, setLectureForm] = useState({
        title: "",
        description: "",
        contentType: "video" as "video" | "quiz",
        orderIndex: 0,
        isPreview: false,
    });
    const [metadataForm, setMetadataForm] = useState({
        language: "",
        level: "",
        whatYoullLearn: [""],
    });

    // Load course content
    useEffect(() => {
        loadContent();
    }, [courseId]);

    const loadContent = async () => {
        try {
            setLoading(true);
            const courseContent = await getCourseContent(courseId);
            if (courseContent) {
                setContent(courseContent);
                // Initialize metadata form
                setMetadataForm({
                    language: courseContent.metadata?.language || "",
                    level: courseContent.metadata?.level || "",
                    whatYoullLearn: courseContent.metadata?.whatYoullLearn || [""],
                });
            }
        } catch (error) {
            toast.error("Failed to load course content");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSection = async () => {
        try {
            await createCourseSection(courseId, sectionForm);
            setSectionDialogOpen(false);
            setSectionForm({ title: "", description: "", orderIndex: 0 });
            loadContent();
            toast.success("Section created successfully");
        } catch (error) {
            toast.error("Failed to create section");
        }
    };

    const handleCreateLecture = async () => {
        try {
            // Create content object based on type
            const content = lectureForm.contentType === 'video'
                ? {
                    videoUrl: '',
                    cloudinaryPublicId: '',
                    quality: []
                  }
                : {
                    questions: [],
                    passingScore: 70,
                    allowMultipleAttempts: true
                  };

            const lectureData = {
                ...lectureForm,
                content
            };

            await createCourseLecture(courseId, selectedSectionId, lectureData);
            setLectureDialogOpen(false);
            setLectureForm({ title: "", description: "", contentType: "video", orderIndex: 0, isPreview: false });
            loadContent();
            toast.success("Lecture created successfully");
        } catch (error) {
            toast.error("Failed to create lecture");
        }
    };

    const handleUpdateMetadata = async () => {
        try {
            const metadata = {
                ...metadataForm,
                whatYoullLearn: metadataForm.whatYoullLearn.filter(item => item.trim() !== ""),
            };
            await updateCourseContent(courseId, metadata);
            setMetadataDialogOpen(false);
            loadContent();
            toast.success("Metadata updated successfully");
        } catch (error) {
            toast.error("Failed to update metadata");
        }
    };

    const handleVideoUpload = async (
        sectionId: string,
        lectureId: string,
        file: File
    ) => {
        try {
            setUploading(lectureId);
            await uploadVideoToLecture(courseId, sectionId, lectureId, file);
            loadContent();
            toast.success("Video uploaded successfully");
        } catch (error) {
            toast.error("Failed to upload video");
        } finally {
            setUploading(null);
        }
    };

    const addLearningPoint = () => {
        setMetadataForm({
            ...metadataForm,
            whatYoullLearn: [...metadataForm.whatYoullLearn, ""],
        });
    };

    const updateLearningPoint = (index: number, value: string) => {
        const updated = [...metadataForm.whatYoullLearn];
        updated[index] = value;
        setMetadataForm({ ...metadataForm, whatYoullLearn: updated });
    };

    const removeLearningPoint = (index: number) => {
        const updated = metadataForm.whatYoullLearn.filter((_, i) => i !== index);
        setMetadataForm({ ...metadataForm, whatYoullLearn: updated });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {/* Header with actions */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Course Content Management</Typography>
                <Box>
                    <Button
                        variant="outlined"
                        onClick={() => setMetadataDialogOpen(true)}
                        sx={{ mr: 1 }}
                    >
                        Edit Metadata
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setSectionDialogOpen(true)}
                    >
                        Add Section
                    </Button>
                </Box>
            </Box>

            {/* Course Metadata */}
            {content?.metadata && (
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Course Metadata
                        </Typography>
                        <Typography><strong>Language:</strong> {content.metadata.language}</Typography>
                        <Typography><strong>Level:</strong> {content.metadata.level}</Typography>
                        <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>
                            What you'll learn:
                        </Typography>
                        <ul>
                            {content.metadata.whatYoullLearn?.map((point, index) => (
                                <li key={index}>{point}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Course Sections */}
            {content?.sections?.map((section, index) => (
                <Accordion key={section.id} sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                            <Box>
                                <Typography variant="h6">
                                    {index + 1}. {section.title}
                                </Typography>
                                {section.description && (
                                    <Typography variant="body2" color="text.secondary">
                                        {section.description}
                                    </Typography>
                                )}
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                {section.lectures?.length || 0} lectures
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box>
                            <Button
                                size="small"
                                startIcon={<AddIcon />}
                                onClick={() => {
                                    setSelectedSectionId(section.id);
                                    setLectureDialogOpen(true);
                                }}
                                sx={{ mb: 2 }}
                            >
                                Add Lecture
                            </Button>

                            <List>
                                {section.lectures?.map((lecture, lectureIndex) => (
                                    <ListItem key={lecture.id} divider>
                                        <ListItemText
                                            primary={`${lectureIndex + 1}. ${lecture.title}`}
                                            secondary={
                                                <Box>
                                                    <Typography variant="caption" component="div">
                                                        {lecture.contentType} • {lecture.durationSeconds ? `${Math.floor(lecture.durationSeconds / 60)}m` : 'No duration'}
                                                        {lecture.isPreview && ' • Preview'}
                                                    </Typography>
                                                    {lecture.description && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {lecture.description}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            {lecture.contentType === 'video' && (
                                                <label htmlFor={`video-upload-${lecture.id}`}>
                                                    <input
                                                        id={`video-upload-${lecture.id}`}
                                                        type="file"
                                                        accept="video/*"
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                handleVideoUpload(section.id, lecture.id, file);
                                                            }
                                                        }}
                                                    />
                                                    <IconButton component="span" disabled={uploading === lecture.id}>
                                                        {uploading === lecture.id ? (
                                                            <CircularProgress size={20} />
                                                        ) : (
                                                            <UploadIcon />
                                                        )}
                                                    </IconButton>
                                                </label>
                                            )}
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}

            {/* Create Section Dialog */}
            <Dialog open={sectionDialogOpen} onClose={() => setSectionDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Section</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Section Title"
                        value={sectionForm.title}
                        onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={sectionForm.description}
                        onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
                        margin="normal"
                        multiline
                        rows={2}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Order Index"
                        value={sectionForm.orderIndex}
                        onChange={(e) => setSectionForm({ ...sectionForm, orderIndex: parseInt(e.target.value) })}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSectionDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateSection} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>

            {/* Create Lecture Dialog */}
            <Dialog open={lectureDialogOpen} onClose={() => setLectureDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Lecture</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Lecture Title"
                        value={lectureForm.title}
                        onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={lectureForm.description}
                        onChange={(e) => setLectureForm({ ...lectureForm, description: e.target.value })}
                        margin="normal"
                        multiline
                        rows={2}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Content Type</InputLabel>
                        <Select
                            value={lectureForm.contentType}
                            onChange={(e) => setLectureForm({ ...lectureForm, contentType: e.target.value as "video" | "quiz" })}
                        >
                            <MenuItem value="video">Video</MenuItem>
                            <MenuItem value="quiz">Quiz</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        type="number"
                        label="Order Index"
                        value={lectureForm.orderIndex}
                        onChange={(e) => setLectureForm({ ...lectureForm, orderIndex: parseInt(e.target.value) })}
                        margin="normal"
                    />
                    <Box display="flex" alignItems="center" mt={2}>
                        <input
                            type="checkbox"
                            checked={lectureForm.isPreview}
                            onChange={(e) => setLectureForm({ ...lectureForm, isPreview: e.target.checked })}
                            style={{ marginRight: 8 }}
                        />
                        <Typography variant="body2">Make this lecture a free preview</Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLectureDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateLecture} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>

            {/* Metadata Dialog */}
            <Dialog open={metadataDialogOpen} onClose={() => setMetadataDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Edit Course Metadata</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Language"
                        value={metadataForm.language}
                        onChange={(e) => setMetadataForm({ ...metadataForm, language: e.target.value })}
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Level</InputLabel>
                        <Select
                            value={metadataForm.level}
                            onChange={(e) => setMetadataForm({ ...metadataForm, level: e.target.value })}
                        >
                            <MenuItem value="beginner">Beginner</MenuItem>
                            <MenuItem value="intermediate">Intermediate</MenuItem>
                            <MenuItem value="advanced">Advanced</MenuItem>
                        </Select>
                    </FormControl>

                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                        What you'll learn:
                    </Typography>
                    {metadataForm.whatYoullLearn.map((point, index) => (
                        <Box key={index} display="flex" alignItems="center" gap={1} mb={1}>
                            <TextField
                                fullWidth
                                size="small"
                                value={point}
                                onChange={(e) => updateLearningPoint(index, e.target.value)}
                                placeholder="Learning point..."
                            />
                            <IconButton
                                onClick={() => removeLearningPoint(index)}
                                disabled={metadataForm.whatYoullLearn.length === 1}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button onClick={addLearningPoint} startIcon={<AddIcon />}>
                        Add Learning Point
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setMetadataDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateMetadata} variant="contained">Update</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CourseContentManager;