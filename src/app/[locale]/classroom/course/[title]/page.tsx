'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    TextField,
    Button,
    Divider,
    Card,
    CardContent,
    ButtonBase,
    Tabs,
    Tab,
    CircularProgress,
} from '@mui/material';
import {
    PlayCircleOutline,
    ExpandMore,
    CheckCircle,
    Send,
    QuestionAnswer,
    SmartToy,
} from '@mui/icons-material';
import ReactPlayer from 'react-player';
import { copilotService, type CopilotMessage } from '@/services/copilot.service';

// Sample course data - replace with actual data from your backend
const courseData = {
    title: "Web Development Bootcamp",
    sections: [
        {
            id: 1,
            title: "Getting Started",
            lectures: [
                { id: 1, title: "Introduction to Web Development", duration: "10:00", completed: true, videoUrl: "https://example.com/video1" },
                { id: 2, title: "Setting Up Your Environment", duration: "15:00", completed: false, videoUrl: "https://example.com/video2" },
            ]
        },
        {
            id: 2,
            title: "HTML Fundamentals",
            lectures: [
                { id: 3, title: "HTML Structure", duration: "12:00", completed: false, videoUrl: "https://example.com/video3" },
                { id: 4, title: "Working with Forms", duration: "20:00", completed: false, videoUrl: "https://example.com/video4" },
            ]
        }
    ]
};

// Sample QA data
const qaData = [
    { id: 1, question: "How do I set up my development environment?", answer: "First, install Node.js and VS Code...", timestamp: "5:30" },
    { id: 2, question: "What's the difference between let and const?", answer: "let allows reassignment while const...", timestamp: "12:45" },
];

// Sample chat messages
const initialMessages = [
    { id: 1, text: "Hi! I'm your Copilot. How can I help you with this course?", isBot: true },
];

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
            style={{ height: '100%' }}
        >
            {value === index && (
                <Box sx={{ height: '100%' }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function CourseLecturePage({ params }: { params: { title: string } }) {
    const [currentVideo, setCurrentVideo] = useState(courseData.sections[0].lectures[0].videoUrl);
    const [currentLecture, setCurrentLecture] = useState(courseData.sections[0].lectures[0]);
    const [messages, setMessages] = useState<CopilotMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [newQuestion, setNewQuestion] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Load chat history when lecture changes
        loadChatHistory();
    }, [currentLecture.id]);

    const loadChatHistory = async () => {
        try {
            const history = await copilotService.getMessageHistory(
                params.title, // courseId
                currentLecture.id.toString() // lectureId
            );
            setMessages(history);
        } catch (error) {
            console.error('Failed to load chat history:', error);
            // You might want to show an error message to the user
        }
    };

    const handleLectureClick = (lecture: any) => {
        setCurrentVideo(lecture.videoUrl);
        setCurrentLecture(lecture);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || isLoading) return;

        const userMessage: CopilotMessage = {
            id: messages.length + 1,
            text: newMessage,
            isBot: false,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');
        setIsLoading(true);

        try {
            const response = await copilotService.sendMessage(
                newMessage,
                params.title, // courseId
                currentLecture.id.toString() // lectureId
            );

            const botMessage: CopilotMessage = {
                id: messages.length + 2,
                text: response.answer,
                isBot: true,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Failed to send message:', error);
            // Show error message to user
            const errorMessage: CopilotMessage = {
                id: messages.length + 2,
                text: "Sorry, I couldn't process your message. Please try again.",
                isBot: true,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAskQuestion = () => {
        if (!newQuestion.trim()) return;
        // Handle question submission
        setNewQuestion('');
    };

    return (
        <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex' }}>
            {/* Left side - Video Player and Tabs */}
            <Box sx={{ width: '70%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Video Player */}
                <Paper sx={{ flex: '0 0 auto', bgcolor: 'black' }}>
                    <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                        <ReactPlayer
                            url={currentVideo}
                            width="100%"
                            height="100%"
                            controls
                            style={{ position: 'absolute', top: 0, left: 0 }}
                        />
                    </Box>
                </Paper>

                {/* Video Title */}
                <Box sx={{ p: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        {currentLecture.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Duration: {currentLecture.duration}
                    </Typography>
                </Box>

                {/* Tabs Section */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderTop: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tab icon={<QuestionAnswer />} label="Q&A Session" />
                        <Tab icon={<SmartToy />} label="Copilot Chat" />
                    </Tabs>

                    {/* Q&A Panel */}
                    <TabPanel value={tabValue} index={0}>
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
                            <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
                                {qaData.map((qa) => (
                                    <Card key={qa.id} sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    Q: {qa.question}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {qa.timestamp}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2">
                                                A: {qa.answer}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Ask a question..."
                                    value={newQuestion}
                                    onChange={(e) => setNewQuestion(e.target.value)}
                                />
                                <Button variant="contained" onClick={handleAskQuestion}>
                                    Ask
                                </Button>
                            </Box>
                        </Box>
                    </TabPanel>

                    {/* Copilot Chat Panel */}
                    <TabPanel value={tabValue} index={1}>
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
                            <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
                                {messages.map((message) => (
                                    <Card
                                        key={message.id}
                                        sx={{
                                            mb: 1,
                                            bgcolor: message.isBot ? 'primary.light' : 'grey.100',
                                            maxWidth: '80%',
                                            ml: message.isBot ? 0 : 'auto',
                                        }}
                                    >
                                        <CardContent>
                                            <Typography variant="body2" color={message.isBot ? 'white' : 'text.primary'}>
                                                {message.text}
                                            </Typography>
                                            <Typography variant="caption" color={message.isBot ? 'white' : 'text.secondary'} sx={{ mt: 1, display: 'block' }}>
                                                {new Date(message.timestamp).toLocaleTimeString()}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                                {isLoading && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                        <CircularProgress size={24} />
                                    </Box>
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Ask your question..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    disabled={isLoading}
                                />
                                <Button
                                    variant="contained"
                                    endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                                    onClick={handleSendMessage}
                                    disabled={isLoading}
                                >
                                    Send
                                </Button>
                            </Box>
                        </Box>
                    </TabPanel>
                </Box>
            </Box>

            {/* Right side - Course Content */}
            <Box sx={{ width: '30%', height: '100%', borderLeft: 1, borderColor: 'divider', overflowY: 'auto' }}>
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {courseData.sections.map((section) => (
                        <Accordion key={section.id} defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {section.title}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ padding: 0 }}>
                                <List>
                                    {section.lectures.map((lecture) => (
                                        <ListItem
                                            key={lecture.id}
                                            component={ButtonBase}
                                            onClick={() => handleLectureClick(lecture)}
                                            sx={{ 
                                                width: '100%',
                                                textAlign: 'left',
                                                bgcolor: currentLecture.id === lecture.id ? 'action.selected' : 'transparent'
                                            }}
                                        >
                                            <ListItemIcon>
                                                {lecture.completed ? <CheckCircle color="success" /> : <PlayCircleOutline />}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={lecture.title}
                                                secondary={lecture.duration}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </List>
            </Box>
        </Box>
    );
}
