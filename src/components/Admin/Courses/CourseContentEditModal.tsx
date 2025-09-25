"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Chip,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Collapse,
} from '@mui/material';
import {
  Close,
  ExpandMore,
  Add,
  Edit,
  Delete,
  PlayArrow,
  DragIndicator,
  Save,
  Cancel,
  Upload,
  VideoLibrary,
  School,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { ICourse, ISection, ILecture } from '../../../../types/entities';
import { toastService } from '@/services/toast';
import CaptionManagement from '../../common/courses/CaptionManagement';
import { saveCourseContent, uploadVideoToLecture } from '@/actions/coursesAction';

interface CourseContentEditModalProps {
  open: boolean;
  onClose: () => void;
  course: ICourse | null;
  onSuccess?: () => void;
}

interface EditingState {
  type: 'section' | 'lecture' | null;
  sectionIndex?: number;
  lectureIndex?: number;
  isNew?: boolean;
}

export default function CourseContentEditModal({
  open,
  onClose,
  course,
  onSuccess
}: CourseContentEditModalProps) {
  const [sections, setSections] = useState<ISection[]>([]);
  const [editingState, setEditingState] = useState<EditingState>({ type: null });
  const [editingText, setEditingText] = useState('');
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [uploadingVideo, setUploadingVideo] = useState<{[key: string]: boolean}>({});
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});

  useEffect(() => {
    if (course?.sections) {
      setSections([...course.sections]);
      // Expand first section by default
      if (course.sections.length > 0) {
        setExpandedSections(new Set([0]));
      }
    }
  }, [course]);

  const handleClose = () => {
    setEditingState({ type: null });
    setEditingText('');
    setSections(course?.sections ? [...course.sections] : []);
    onClose();
  };

  const handleSave = async () => {
    if (!course) return;

    setSaving(true);
    try {
      // Transform ISection[] to ICourseSection[]
      const courseSections = sections.map((section, index) => ({
        id: section._id,
        title: section.title,
        description: '',
        orderIndex: index,
        lectures: section.lectures.map((lecture, lectureIndex) => ({
          id: lecture._id,
          title: lecture.title,
          description: '',
          contentType: 'video' as const,
          orderIndex: lectureIndex,
          durationSeconds: 0,
          isPreview: false,
          content: {
            videoUrl: lecture.videoUrl || '',
            thumbnailUrl: '',
            cloudinaryPublicId: '',
            quality: []
          }
        }))
      }));

      const result = await saveCourseContent(course.id, courseSections);
      if (result.statusCode === 200) {
        toastService.success('Course content updated successfully!');
        onSuccess?.();
        handleClose();
      } else {
        toastService.error(result.message || 'Failed to update course content');
      }
    } catch (error) {
      console.error('Error saving course content:', error);
      toastService.error('An error occurred while saving course content');
    } finally {
      setSaving(false);
    }
  };

  const handleSectionToggle = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const startEditingSection = (index: number, isNew = false) => {
    setEditingState({ type: 'section', sectionIndex: index, isNew });
    setEditingText(isNew ? '' : sections[index]?.title || '');
  };

  const startEditingLecture = (sectionIndex: number, lectureIndex: number, isNew = false) => {
    setEditingState({
      type: 'lecture',
      sectionIndex,
      lectureIndex,
      isNew
    });
    setEditingText(
      isNew ? '' : sections[sectionIndex]?.lectures[lectureIndex]?.title || ''
    );
  };

  const saveEdit = () => {
    const { type, sectionIndex, lectureIndex, isNew } = editingState;

    if (!editingText.trim()) {
      toastService.error('Title cannot be empty');
      return;
    }

    const newSections = [...sections];

    if (type === 'section' && typeof sectionIndex === 'number') {
      if (isNew) {
        const newSection: ISection = {
          _id: `temp-${Date.now()}`,
          title: editingText,
          totalLectures: 0,
          lectures: []
        };
        newSections.push(newSection);
        setExpandedSections(prev => new Set([...prev, newSections.length - 1]));
      } else {
        newSections[sectionIndex] = {
          ...newSections[sectionIndex],
          title: editingText
        };
      }
    } else if (type === 'lecture' && typeof sectionIndex === 'number' && typeof lectureIndex === 'number') {
      if (isNew) {
        const newLecture: ILecture = {
          _id: `temp-${Date.now()}`,
          title: editingText,
          videoUrl: ''
        };
        newSections[sectionIndex].lectures.push(newLecture);
        newSections[sectionIndex].totalLectures = newSections[sectionIndex].lectures.length;
      } else {
        newSections[sectionIndex].lectures[lectureIndex] = {
          ...newSections[sectionIndex].lectures[lectureIndex],
          title: editingText
        };
      }
    }

    setSections(newSections);
    setEditingState({ type: null });
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingState({ type: null });
    setEditingText('');
  };

  const deleteSection = (index: number) => {
    if (window.confirm('Are you sure you want to delete this section? This action cannot be undone.')) {
      const newSections = sections.filter((_, i) => i !== index);
      setSections(newSections);
      toastService.success('Section deleted');
    }
  };

  const deleteLecture = (sectionIndex: number, lectureIndex: number) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      const newSections = [...sections];
      newSections[sectionIndex].lectures = newSections[sectionIndex].lectures.filter((_, i) => i !== lectureIndex);
      newSections[sectionIndex].totalLectures = newSections[sectionIndex].lectures.length;
      setSections(newSections);
      toastService.success('Lecture deleted');
    }
  };

  const handleVideoUpload = async (sectionIndex: number, lectureIndex: number, file: File) => {
    if (!course) return;

    const lectureKey = `${sectionIndex}-${lectureIndex}`;
    setUploadingVideo(prev => ({ ...prev, [lectureKey]: true }));
    setUploadProgress(prev => ({ ...prev, [lectureKey]: 0 }));

    try {
      const section = sections[sectionIndex];
      const lecture = section.lectures[lectureIndex];

      const result = await uploadVideoToLecture(
        course.id,
        section._id,
        lecture._id,
        file
      );

      if (result?.url) {
        const newSections = [...sections];
        newSections[sectionIndex].lectures[lectureIndex].videoUrl = result.url;
        setSections(newSections);
        toastService.success('Video uploaded successfully!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Video upload error:', error);
      toastService.error('Failed to upload video');
    } finally {
      setUploadingVideo(prev => ({ ...prev, [lectureKey]: false }));
      setUploadProgress(prev => ({ ...prev, [lectureKey]: 0 }));
    }
  };

  const getTotalStats = () => {
    const totalSections = sections.length;
    const totalLectures = sections.reduce((sum, section) => sum + section.lectures.length, 0);
    const totalVideos = sections.reduce((sum, section) =>
      sum + section.lectures.filter(lecture => lecture.videoUrl).length, 0
    );
    return { totalSections, totalLectures, totalVideos };
  };

  if (!course) return null;

  const { totalSections, totalLectures, totalVideos } = getTotalStats();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, maxHeight: '90vh' }
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'primary.main',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <School />
          <Box>
            <Typography variant="h6">Edit Course Content</Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {course.title}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{ color: 'white' }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Stats Overview */}
        <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Content Overview</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">{totalSections}</Typography>
                  <Typography variant="body2">Sections</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Typography variant="h4" color="secondary">{totalLectures}</Typography>
                  <Typography variant="body2">Lectures</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">{totalVideos}</Typography>
                  <Typography variant="body2">Videos</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Course Sections */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Course Sections</Typography>
            <Button
              startIcon={<Add />}
              variant="outlined"
              onClick={() => startEditingSection(sections.length, true)}
              size="small"
            >
              Add Section
            </Button>
          </Box>

          {sections.length === 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              No sections yet. Add your first section to get started.
            </Alert>
          )}

          {sections.map((section, sectionIndex) => (
            <Accordion
              key={section._id}
              expanded={expandedSections.has(sectionIndex)}
              onChange={() => handleSectionToggle(sectionIndex)}
              sx={{ mb: 1, border: 1, borderColor: 'divider' }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', pr: 2 }}>
                  <DragIndicator sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box sx={{ flex: 1 }}>
                    {editingState.type === 'section' && editingState.sectionIndex === sectionIndex ? (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <TextField
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          size="small"
                          fullWidth
                          autoFocus
                        />
                        <IconButton size="small" onClick={saveEdit} color="primary">
                          <Save />
                        </IconButton>
                        <IconButton size="small" onClick={cancelEdit}>
                          <Cancel />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="subtitle1">{section.title}</Typography>
                        <Chip
                          label={`${section.lectures.length} lectures`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }} onClick={(e) => e.stopPropagation()}>
                    <IconButton size="small" onClick={() => startEditingSection(sectionIndex)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" onClick={() => deleteSection(sectionIndex)} color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </AccordionSummary>

              <AccordionDetails>
                <Box sx={{ pl: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">Lectures</Typography>
                    <Button
                      startIcon={<Add />}
                      size="small"
                      onClick={() => startEditingLecture(sectionIndex, section.lectures.length, true)}
                    >
                      Add Lecture
                    </Button>
                  </Box>

                  {section.lectures.length === 0 ? (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      No lectures in this section. Add your first lecture.
                    </Alert>
                  ) : (
                    <List dense>
                      {section.lectures.map((lecture, lectureIndex) => {
                        const lectureKey = `${sectionIndex}-${lectureIndex}`;
                        const isUploading = uploadingVideo[lectureKey];

                        return (
                          <ListItem key={lecture._id} divider>
                            <PlayArrow sx={{ mr: 2, color: lecture.videoUrl ? 'success.main' : 'text.disabled' }} />
                            <ListItemText
                              primary={
                                editingState.type === 'lecture' &&
                                editingState.sectionIndex === sectionIndex &&
                                editingState.lectureIndex === lectureIndex ? (
                                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <TextField
                                      value={editingText}
                                      onChange={(e) => setEditingText(e.target.value)}
                                      size="small"
                                      fullWidth
                                      autoFocus
                                    />
                                    <IconButton size="small" onClick={saveEdit} color="primary">
                                      <Save />
                                    </IconButton>
                                    <IconButton size="small" onClick={cancelEdit}>
                                      <Cancel />
                                    </IconButton>
                                  </Box>
                                ) : (
                                  lecture.title
                                )
                              }
                              secondary={
                                <Box>
                                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                                    {lecture.videoUrl ? (
                                      <Chip label="Video uploaded" size="small" color="success" />
                                    ) : (
                                      <Chip label="No video" size="small" color="default" />
                                    )}
                                  </Box>

                                  {/* Caption Management */}
                                  {lecture.videoUrl && lecture._id && (
                                    <Box sx={{ mt: 1 }}>
                                      <CaptionManagement
                                        lectureId={lecture._id}
                                        lectureTitle={lecture.title}
                                        size="small"
                                        showTitle={false}
                                      />
                                    </Box>
                                  )}

                                  {isUploading && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                      <CircularProgress size={16} />
                                      <Typography variant="caption">Uploading...</Typography>
                                    </Box>
                                  )}
                                </Box>
                              }
                            />
                            <ListItemSecondaryAction>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <input
                                  accept="video/*"
                                  style={{ display: 'none' }}
                                  id={`video-upload-${lectureKey}`}
                                  type="file"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleVideoUpload(sectionIndex, lectureIndex, file);
                                    }
                                  }}
                                />
                                <label htmlFor={`video-upload-${lectureKey}`}>
                                  <IconButton size="small" component="span" disabled={isUploading}>
                                    <Upload />
                                  </IconButton>
                                </label>
                                <IconButton
                                  size="small"
                                  onClick={() => startEditingLecture(sectionIndex, lectureIndex)}
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => deleteLecture(sectionIndex, lectureIndex)}
                                  color="error"
                                >
                                  <Delete />
                                </IconButton>
                              </Box>
                            </ListItemSecondaryAction>
                          </ListItem>
                        );
                      })}
                    </List>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: 'grey.50', gap: 1 }}>
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} /> : <Save />}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}