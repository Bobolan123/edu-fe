"use client";

import {
    Box,
    Button,
    IconButton,
    TextField,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormControlLabel,
    Switch,
    Divider,
    Paper,
    Stack,
    Collapse,
    Radio,
    RadioGroup,
} from "@mui/material";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { QuizContent, QuizQuestion } from "../../../../types/entities";

interface QuizEditorProps {
    quizContent: QuizContent;
    onChange: (content: QuizContent) => void;
}

export default function QuizEditor({ quizContent, onChange }: QuizEditorProps) {
    const [expandedQuestions, setExpandedQuestions] = useState<{
        [key: string]: boolean;
    }>({});

    const toggleQuestion = (questionId: string) => {
        setExpandedQuestions((prev) => ({
            ...prev,
            [questionId]: !prev[questionId],
        }));
    };

    const handleAddQuestion = () => {
        const newQuestion: QuizQuestion = {
            id: `temp-question-${Date.now()}`,
            type: "multiple_choice",
            question: "",
            options: ["", "", "", ""],
            correctAnswer: 0,
            explanation: "",
        };
        onChange({
            ...quizContent,
            questions: [...quizContent.questions, newQuestion],
        });
        // Auto-expand new question
        setExpandedQuestions((prev) => ({
            ...prev,
            [newQuestion.id]: true,
        }));
    };

    const handleDeleteQuestion = (questionId: string) => {
        onChange({
            ...quizContent,
            questions: quizContent.questions.filter((q) => q.id !== questionId),
        });
    };

    const handleQuestionChange = (
        questionId: string,
        field: keyof QuizQuestion,
        value: any
    ) => {
        onChange({
            ...quizContent,
            questions: quizContent.questions.map((q) =>
                q.id === questionId ? { ...q, [field]: value } : q
            ),
        });
    };

    const handleQuestionTypeChange = (questionId: string, newType: QuizQuestion["type"]) => {
        const question = quizContent.questions.find((q) => q.id === questionId);
        if (!question) return;

        let updatedQuestion: QuizQuestion = { ...question, type: newType };

        // Update question structure based on type
        switch (newType) {
            case "multiple_choice":
                updatedQuestion.options = question.options || ["", "", "", ""];
                updatedQuestion.correctAnswer = 0;
                break;
            case "true_false":
                delete updatedQuestion.options;
                updatedQuestion.correctAnswer = "true";
                break;
            case "fill_blank":
                delete updatedQuestion.options;
                updatedQuestion.correctAnswer = "";
                break;
        }

        onChange({
            ...quizContent,
            questions: quizContent.questions.map((q) =>
                q.id === questionId ? updatedQuestion : q
            ),
        });
    };

    const handleOptionChange = (questionId: string, optionIndex: number, value: string) => {
        const question = quizContent.questions.find((q) => q.id === questionId);
        if (!question || !question.options) return;

        const newOptions = [...question.options];
        newOptions[optionIndex] = value;

        handleQuestionChange(questionId, "options", newOptions);
    };

    const handleAddOption = (questionId: string) => {
        const question = quizContent.questions.find((q) => q.id === questionId);
        if (!question || !question.options) return;

        handleQuestionChange(questionId, "options", [...question.options, ""]);
    };

    const handleRemoveOption = (questionId: string, optionIndex: number) => {
        const question = quizContent.questions.find((q) => q.id === questionId);
        if (!question || !question.options || question.options.length <= 2) return;

        const newOptions = question.options.filter((_, i) => i !== optionIndex);
        handleQuestionChange(questionId, "options", newOptions);

        // Adjust correct answer if needed
        if (typeof question.correctAnswer === "number" && question.correctAnswer >= optionIndex) {
            handleQuestionChange(
                questionId,
                "correctAnswer",
                Math.max(0, question.correctAnswer - 1)
            );
        }
    };

    return (
        <Box className="space-y-4">
            {/* Quiz Settings */}
            <Paper
                elevation={0}
                className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl"
            >
                <Typography variant="subtitle2" className="font-bold text-purple-800 mb-3">
                    📝 Quiz Settings
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                        label="Passing Score (%)"
                        type="number"
                        size="small"
                        value={quizContent.passingScore || 70}
                        onChange={(e) =>
                            onChange({
                                ...quizContent,
                                passingScore: Number(e.target.value),
                            })
                        }
                        InputProps={{ inputProps: { min: 0, max: 100 } }}
                        sx={{
                            flex: 1,
                            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                        }}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={quizContent.allowMultipleAttempts ?? true}
                                onChange={(e) =>
                                    onChange({
                                        ...quizContent,
                                        allowMultipleAttempts: e.target.checked,
                                    })
                                }
                            />
                        }
                        label="Multiple Attempts"
                        sx={{ flex: 1 }}
                    />
                </Stack>
            </Paper>

            {/* Questions List */}
            <Box>
                <Box className="flex justify-between items-center mb-3">
                    <Typography variant="subtitle2" className="font-bold text-gray-800">
                        Questions ({quizContent.questions.length})
                    </Typography>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={handleAddQuestion}
                        sx={{
                            background: "linear-gradient(45deg, #7c3aed, #a855f7)",
                            borderRadius: "12px",
                            textTransform: "none",
                            fontWeight: "bold",
                        }}
                    >
                        Add Question
                    </Button>
                </Box>

                {quizContent.questions.length === 0 ? (
                    <Paper
                        elevation={0}
                        className="p-8 text-center bg-gray-50 border border-gray-200 rounded-xl"
                    >
                        <Typography variant="body2" className="text-gray-600">
                            No questions yet. Click "Add Question" to get started.
                        </Typography>
                    </Paper>
                ) : (
                    quizContent.questions.map((question, index) => (
                        <Paper
                            key={question.id}
                            elevation={0}
                            className="mb-3 p-4 bg-white border border-purple-100 rounded-xl"
                        >
                            {/* Question Header */}
                            <Box className="flex items-center justify-between mb-2">
                                <Box className="flex items-center gap-2 flex-1">
                                    <Typography
                                        variant="caption"
                                        className="font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded"
                                    >
                                        Q{index + 1}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        className="font-medium text-gray-700 truncate"
                                    >
                                        {question.question || "Untitled Question"}
                                    </Typography>
                                </Box>
                                <Box className="flex items-center gap-1">
                                    <IconButton
                                        size="small"
                                        onClick={() => toggleQuestion(question.id)}
                                        sx={{ color: "#7c3aed" }}
                                    >
                                        {expandedQuestions[question.id] ? (
                                            <ExpandLessIcon />
                                        ) : (
                                            <ExpandMoreIcon />
                                        )}
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDeleteQuestion(question.id)}
                                        sx={{
                                            color: "#dc2626",
                                            "&:hover": { backgroundColor: "rgba(220, 38, 38, 0.1)" },
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>

                            <Collapse in={expandedQuestions[question.id]}>
                                <Divider sx={{ my: 2 }} />

                                {/* Question Type */}
                                <FormControl size="small" fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Question Type</InputLabel>
                                    <Select
                                        value={question.type}
                                        label="Question Type"
                                        onChange={(e) =>
                                            handleQuestionTypeChange(
                                                question.id,
                                                e.target.value as QuizQuestion["type"]
                                            )
                                        }
                                        sx={{ borderRadius: "12px" }}
                                    >
                                        <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                                        <MenuItem value="true_false">True/False</MenuItem>
                                        <MenuItem value="fill_blank">Fill in the Blank</MenuItem>
                                    </Select>
                                </FormControl>

                                {/* Question Text */}
                                <TextField
                                    fullWidth
                                    label="Question"
                                    multiline
                                    rows={2}
                                    value={question.question}
                                    onChange={(e) =>
                                        handleQuestionChange(question.id, "question", e.target.value)
                                    }
                                    sx={{
                                        mb: 2,
                                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                                    }}
                                />

                                {/* Options based on question type */}
                                {question.type === "multiple_choice" && question.options && (
                                    <Box className="mb-2">
                                        <Typography variant="caption" className="font-bold text-gray-700 mb-1 block">
                                            Options (select correct answer)
                                        </Typography>
                                        <RadioGroup
                                            value={question.correctAnswer}
                                            onChange={(e) =>
                                                handleQuestionChange(
                                                    question.id,
                                                    "correctAnswer",
                                                    Number(e.target.value)
                                                )
                                            }
                                        >
                                            {question.options.map((option, optionIndex) => (
                                                <Box key={optionIndex} className="flex items-center gap-2 mb-2">
                                                    <FormControlLabel
                                                        value={optionIndex}
                                                        control={<Radio />}
                                                        label=""
                                                        sx={{ mr: 0 }}
                                                    />
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        placeholder={`Option ${optionIndex + 1}`}
                                                        value={option}
                                                        onChange={(e) =>
                                                            handleOptionChange(
                                                                question.id,
                                                                optionIndex,
                                                                e.target.value
                                                            )
                                                        }
                                                        sx={{
                                                            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                                                        }}
                                                    />
                                                    {question.options && question.options.length > 2 && (
                                                        <IconButton
                                                            size="small"
                                                            onClick={() =>
                                                                handleRemoveOption(question.id, optionIndex)
                                                            }
                                                            sx={{ color: "#dc2626" }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                </Box>
                                            ))}
                                        </RadioGroup>
                                        <Button
                                            size="small"
                                            startIcon={<AddIcon />}
                                            onClick={() => handleAddOption(question.id)}
                                            sx={{
                                                textTransform: "none",
                                                color: "#7c3aed",
                                            }}
                                        >
                                            Add Option
                                        </Button>
                                    </Box>
                                )}

                                {question.type === "true_false" && (
                                    <FormControl size="small" fullWidth sx={{ mb: 2 }}>
                                        <InputLabel>Correct Answer</InputLabel>
                                        <Select
                                            value={question.correctAnswer}
                                            label="Correct Answer"
                                            onChange={(e) =>
                                                handleQuestionChange(
                                                    question.id,
                                                    "correctAnswer",
                                                    e.target.value
                                                )
                                            }
                                            sx={{ borderRadius: "12px" }}
                                        >
                                            <MenuItem value="true">True</MenuItem>
                                            <MenuItem value="false">False</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}

                                {question.type === "fill_blank" && (
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Correct Answer"
                                        value={question.correctAnswer}
                                        onChange={(e) =>
                                            handleQuestionChange(
                                                question.id,
                                                "correctAnswer",
                                                e.target.value
                                            )
                                        }
                                        sx={{
                                            mb: 2,
                                            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                                        }}
                                    />
                                )}

                                {/* Explanation */}
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Explanation (Optional)"
                                    multiline
                                    rows={2}
                                    value={question.explanation || ""}
                                    onChange={(e) =>
                                        handleQuestionChange(
                                            question.id,
                                            "explanation",
                                            e.target.value
                                        )
                                    }
                                    sx={{
                                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                                    }}
                                />
                            </Collapse>
                        </Paper>
                    ))
                )}
            </Box>
        </Box>
    );
}
