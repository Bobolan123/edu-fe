"use client";

import React, { useState } from "react";
import {
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    Box,
    FormHelperText,
} from "@mui/material";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { QuizContent, QuizQuestion } from "../../../../types/entities";

interface QuizBuilderProps {
    quizContent: QuizContent;
    onQuizChange: (quiz: QuizContent) => void;
}

const questionTypes = [
    { value: 'multiple_choice', label: 'Multiple Choice' },
    { value: 'true_false', label: 'True/False' },
    { value: 'fill_blank', label: 'Fill in the Blank' },
] as const;

export default function QuizBuilder({ quizContent, onQuizChange }: QuizBuilderProps) {
    const [expandedQuestion, setExpandedQuestion] = useState<string | false>(false);

    const addQuestion = () => {
        const newQuestion: QuizQuestion = {
            id: `q-${Date.now()}`,
            type: 'multiple_choice',
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0,
            explanation: '',
            points: 10,
        };

        const updatedQuiz = {
            ...quizContent,
            questions: [...quizContent.questions, newQuestion],
        };
        onQuizChange(updatedQuiz);
        setExpandedQuestion(newQuestion.id);
    };

    const removeQuestion = (questionId: string) => {
        const updatedQuiz = {
            ...quizContent,
            questions: quizContent.questions.filter(q => q.id !== questionId),
        };
        onQuizChange(updatedQuiz);
    };

    const updateQuestion = (questionId: string, field: keyof QuizQuestion, value: any) => {
        const updatedQuiz = {
            ...quizContent,
            questions: quizContent.questions.map(q =>
                q.id === questionId ? { ...q, [field]: value } : q
            ),
        };
        onQuizChange(updatedQuiz);
    };

    const updateQuizSettings = (field: keyof QuizContent, value: any) => {
        const updatedQuiz = {
            ...quizContent,
            [field]: value,
        };
        onQuizChange(updatedQuiz);
    };

    const updateQuestionOption = (questionId: string, optionIndex: number, value: string) => {
        const question = quizContent.questions.find(q => q.id === questionId);
        if (!question || !question.options) return;

        const updatedOptions = [...question.options];
        updatedOptions[optionIndex] = value;
        updateQuestion(questionId, 'options', updatedOptions);
    };

    const addOption = (questionId: string) => {
        const question = quizContent.questions.find(q => q.id === questionId);
        if (!question || !question.options) return;

        const updatedOptions = [...question.options, ''];
        updateQuestion(questionId, 'options', updatedOptions);
    };

    const removeOption = (questionId: string, optionIndex: number) => {
        const question = quizContent.questions.find(q => q.id === questionId);
        if (!question || !question.options || question.options.length <= 2) return;

        const updatedOptions = question.options.filter((_, index) => index !== optionIndex);
        updateQuestion(questionId, 'options', updatedOptions);

        // Adjust correct answer if necessary
        if (typeof question.correctAnswer === 'number' && question.correctAnswer >= optionIndex) {
            const newCorrectAnswer = question.correctAnswer > optionIndex
                ? question.correctAnswer - 1
                : question.correctAnswer;
            updateQuestion(questionId, 'correctAnswer', Math.max(0, newCorrectAnswer));
        }
    };

    const getTotalPoints = () => {
        return quizContent.questions.reduce((total, q) => total + q.points, 0);
    };

    const handleAccordionChange = (questionId: string) => (
        event: React.SyntheticEvent,
        isExpanded: boolean
    ) => {
        setExpandedQuestion(isExpanded ? questionId : false);
    };

    return (
        <div className="space-y-4">
            {/* Quiz Settings */}
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Quiz Settings
                    </Typography>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <TextField
                            label="Passing Score (%)"
                            type="number"
                            value={quizContent.passingScore}
                            onChange={(e) => updateQuizSettings('passingScore', Math.max(0, Math.min(100, Number(e.target.value))))}
                            inputProps={{ min: 0, max: 100 }}
                            helperText="Minimum score required to pass"
                        />
                        <TextField
                            label="Time Limit (minutes)"
                            type="number"
                            value={quizContent.timeLimit ? Math.floor(quizContent.timeLimit / 60) : ''}
                            onChange={(e) => updateQuizSettings('timeLimit', e.target.value ? Number(e.target.value) * 60 : undefined)}
                            inputProps={{ min: 1 }}
                            helperText="Leave empty for no time limit"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={quizContent.allowMultipleAttempts}
                                    onChange={(e) => updateQuizSettings('allowMultipleAttempts', e.target.checked)}
                                />
                            }
                            label="Allow Multiple Attempts"
                        />
                    </div>
                    <Box mt={2}>
                        <Typography variant="body2" color="text.secondary">
                            Total Questions: {quizContent.questions.length} | Total Points: {getTotalPoints()}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            {/* Questions */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Typography variant="h6">
                        Questions ({quizContent.questions.length})
                    </Typography>
                    <Button
                        startIcon={<AddIcon />}
                        onClick={addQuestion}
                        variant="outlined"
                        size="small"
                    >
                        Add Question
                    </Button>
                </div>

                {quizContent.questions.map((question, index) => (
                    <Accordion
                        key={question.id}
                        expanded={expandedQuestion === question.id}
                        onChange={handleAccordionChange(question.id)}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <div className="flex items-center justify-between w-full mr-4">
                                <div className="flex items-center gap-2">
                                    <Typography className="font-medium">
                                        Question {index + 1}
                                    </Typography>
                                    <Chip
                                        label={questionTypes.find(t => t.value === question.type)?.label}
                                        size="small"
                                        variant="outlined"
                                    />
                                </div>
                                <Typography variant="body2" color="text.secondary">
                                    {question.points} points
                                </Typography>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="space-y-4">
                                {/* Question Header */}
                                <div className="flex items-center gap-2">
                                    <FormControl size="small" sx={{ minWidth: 160 }}>
                                        <InputLabel>Question Type</InputLabel>
                                        <Select
                                            value={question.type}
                                            label="Question Type"
                                            onChange={(e) => {
                                                const newType = e.target.value as QuizQuestion['type'];
                                                let updates: Partial<QuizQuestion> = { type: newType };

                                                if (newType === 'true_false') {
                                                    updates.options = ['True', 'False'];
                                                    updates.correctAnswer = 0;
                                                } else if (newType === 'fill_blank') {
                                                    updates.options = undefined;
                                                    updates.correctAnswer = '';
                                                } else if (newType === 'multiple_choice' && !question.options) {
                                                    updates.options = ['', '', '', ''];
                                                    updates.correctAnswer = 0;
                                                }

                                                Object.entries(updates).forEach(([field, value]) => {
                                                    updateQuestion(question.id, field as keyof QuizQuestion, value);
                                                });
                                            }}
                                        >
                                            {questionTypes.map((type) => (
                                                <MenuItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        label="Points"
                                        type="number"
                                        size="small"
                                        value={question.points}
                                        onChange={(e) => updateQuestion(question.id, 'points', Math.max(1, Number(e.target.value)))}
                                        inputProps={{ min: 1 }}
                                        sx={{ width: 100 }}
                                    />
                                    <IconButton
                                        onClick={() => removeQuestion(question.id)}
                                        color="error"
                                        size="small"
                                        disabled={quizContent.questions.length <= 1}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </div>

                                {/* Question Text */}
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    label="Question"
                                    value={question.question}
                                    onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                                    placeholder="Enter your question here..."
                                />

                                {/* Question Options based on type */}
                                {question.type === 'multiple_choice' && question.options && (
                                    <div className="space-y-2">
                                        <Typography variant="subtitle2">Answer Options</Typography>
                                        {question.options.map((option, optionIndex) => (
                                            <div key={optionIndex} className="flex items-center gap-2">
                                                <FormControlLabel
                                                    control={
                                                        <input
                                                            type="radio"
                                                            checked={question.correctAnswer === optionIndex}
                                                            onChange={() => updateQuestion(question.id, 'correctAnswer', optionIndex)}
                                                        />
                                                    }
                                                    label=""
                                                />
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label={`Option ${optionIndex + 1}`}
                                                    value={option}
                                                    onChange={(e) => updateQuestionOption(question.id, optionIndex, e.target.value)}
                                                />
                                                <IconButton
                                                    onClick={() => removeOption(question.id, optionIndex)}
                                                    disabled={question.options!.length <= 2}
                                                    size="small"
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </div>
                                        ))}
                                        <Button
                                            startIcon={<AddIcon />}
                                            onClick={() => addOption(question.id)}
                                            variant="outlined"
                                            size="small"
                                        >
                                            Add Option
                                        </Button>
                                    </div>
                                )}

                                {question.type === 'true_false' && (
                                    <div className="space-y-2">
                                        <Typography variant="subtitle2">Correct Answer</Typography>
                                        <FormControl>
                                            <Select
                                                value={question.correctAnswer}
                                                onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                                                size="small"
                                            >
                                                <MenuItem value={0}>True</MenuItem>
                                                <MenuItem value={1}>False</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                )}

                                {question.type === 'fill_blank' && (
                                    <TextField
                                        fullWidth
                                        label="Correct Answer"
                                        value={question.correctAnswer}
                                        onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                                        helperText="Enter the exact answer students should provide"
                                    />
                                )}

                                {/* Explanation */}
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    label="Explanation (Optional)"
                                    value={question.explanation || ''}
                                    onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
                                    placeholder="Explain why this is the correct answer..."
                                />
                            </div>
                        </AccordionDetails>
                    </Accordion>
                ))}

                {quizContent.questions.length === 0 && (
                    <Card variant="outlined" className="p-8 text-center">
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            No questions added yet
                        </Typography>
                        <Button
                            startIcon={<AddIcon />}
                            onClick={addQuestion}
                            variant="contained"
                        >
                            Add First Question
                        </Button>
                    </Card>
                )}
            </div>
        </div>
    );
}