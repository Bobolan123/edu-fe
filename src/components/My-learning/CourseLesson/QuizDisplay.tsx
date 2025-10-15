"use client";

import { Box, Typography, Chip } from "@mui/material";
import { IQuizSubmission } from "../../../../types/entities";

interface QuizQuestion {
    id: string;
    type: 'multiple_choice' | 'true_false' | 'fill_blank';
    question: string;
    options?: string[];
    explanation?: string;
}

interface QuizContent {
    questions: QuizQuestion[];
    passingScore: number;
    timeLimit?: number;
}

interface QuizDisplayProps {
    title: string;
    quizContent: QuizContent;
    submission: IQuizSubmission | null;
    quizAnswers: Record<string, string | number | boolean>;
    quizResult: any;
    isSubmitting: boolean;
    onAnswerSelect: (questionId: string, answer: string | number | boolean) => void;
    onSubmit: () => void;
    onRetake?: () => void;
}

export default function QuizDisplay({
    title,
    quizContent,
    submission,
    quizAnswers,
    quizResult,
    isSubmitting,
    onAnswerSelect,
    onSubmit,
    onRetake,
}: QuizDisplayProps) {
    const hasSubmission = !!submission;
    const hasFailed = quizResult && !quizResult.passed;

    return (
        <div className="w-full h-full overflow-auto bg-white p-6 pt-16">
            <Box className="max-w-3xl mx-auto">
                {/* Quiz Title */}
                <Typography variant="h5" className="font-bold text-gray-900 mb-1">
                    {title}
                </Typography>

                {/* Quiz Info */}
                <Box className="flex items-center gap-3 text-xs text-gray-600 mb-4 pb-4 border-b">
                    <Typography variant="caption">
                        {quizContent.questions?.length} questions
                    </Typography>
                    <Typography variant="caption">•</Typography>
                    <Typography variant="caption">
                        Passing grade: {quizContent.passingScore}%
                    </Typography>
                    {quizContent.timeLimit && (
                        <>
                            <Typography variant="caption">•</Typography>
                            <Typography variant="caption">
                                Time limit: {quizContent.timeLimit} min
                            </Typography>
                        </>
                    )}
                </Box>

                {/* Submission Notice */}
                {hasSubmission && (
                    <Box className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                        <Typography variant="body2" className="text-blue-900 font-semibold mb-1">
                            Previous Submission
                        </Typography>
                        <Typography variant="caption" className="text-blue-800">
                            Showing your previous quiz submission. The questions below display your submitted answers and results.
                        </Typography>
                    </Box>
                )}

                {/* Quiz Questions */}
                {quizContent.questions?.map((question, index) => {
                    const questionId = question.id || `q-${index}`;
                    const selectedAnswer = quizAnswers[questionId];
                    const isFillBlank = question.type === 'fill_blank';

                    // Get result data from submission or current result
                    const resultData = hasSubmission
                        ? submission.results?.find((r) => r.questionId === questionId)
                        : quizResult?.results?.find((r: any) => r.questionId === questionId);

                    const isCorrect = resultData?.isCorrect;
                    const correctAnswer = resultData?.correctAnswer;

                    return (
                        <Box key={questionId} className="mb-6">
                            {/* Question Text */}
                            <Box className="flex items-start gap-2 mb-3">
                                <Typography variant="body1" className="font-semibold text-gray-900 flex-1">
                                    {index + 1}. {question.question}
                                </Typography>
                                <Box className="flex gap-2">
                                    {isFillBlank && (
                                        <Chip
                                            label="Not graded"
                                            size="small"
                                            sx={{ height: '20px', fontSize: '0.7rem', bgcolor: '#fef3c7', color: '#92400e' }}
                                        />
                                    )}
                                    {resultData && (
                                        <Chip
                                            label={isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                            size="small"
                                            sx={{
                                                height: '20px',
                                                fontSize: '0.7rem',
                                                bgcolor: isCorrect ? '#dcfce7' : '#fee2e2',
                                                color: isCorrect ? '#166534' : '#991b1b',
                                                fontWeight: 600
                                            }}
                                        />
                                    )}
                                </Box>
                            </Box>

                            {/* Multiple Choice Options */}
                            {question.type === 'multiple_choice' && question.options && (
                                <Box className="space-y-2">
                                    {question.options.map((option: string, optIndex: number) => {
                                        const isSelected = selectedAnswer === optIndex;
                                        const isCorrectOption = resultData && correctAnswer === optIndex;
                                        const isWrongSelection = resultData && isSelected && !isCorrect;

                                        // Determine border and background color based on result
                                        let borderColor = 'border-gray-300';
                                        let bgColor = '';
                                        let isDisabled = hasSubmission || !!resultData;

                                        if (resultData) {
                                            if (isCorrectOption) {
                                                borderColor = 'border-green-500';
                                                bgColor = 'bg-green-50';
                                            } else if (isWrongSelection) {
                                                borderColor = 'border-red-500';
                                                bgColor = 'bg-red-50';
                                            }
                                        } else if (isSelected) {
                                            borderColor = 'border-blue-500';
                                            bgColor = 'bg-blue-50';
                                        }

                                        return (
                                            <Box
                                                key={optIndex}
                                                onClick={() => !isDisabled && onAnswerSelect(questionId, optIndex)}
                                                className={`p-3 border-2 rounded transition-all ${borderColor} ${bgColor} ${
                                                    !isDisabled ? 'cursor-pointer hover:border-gray-400 hover:bg-gray-50' : 'cursor-default'
                                                }`}
                                            >
                                                <Box className="flex items-center gap-2.5">
                                                    <Box
                                                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                                            isCorrectOption
                                                                ? 'border-green-500 bg-green-500'
                                                                : isWrongSelection
                                                                ? 'border-red-500 bg-red-500'
                                                                : isSelected
                                                                ? 'border-blue-500 bg-blue-500'
                                                                : 'border-gray-400'
                                                        }`}
                                                    >
                                                        {(isSelected || isCorrectOption) && (
                                                            <Box className="w-1.5 h-1.5 bg-white rounded-full"></Box>
                                                        )}
                                                    </Box>
                                                    <Typography variant="body2" className="text-gray-800 flex-1">
                                                        {option}
                                                    </Typography>
                                                    {isCorrectOption && (
                                                        <Typography variant="caption" className="text-green-700 font-semibold">
                                                            ✓ Correct
                                                        </Typography>
                                                    )}
                                                    {isWrongSelection && (
                                                        <Typography variant="caption" className="text-red-700 font-semibold">
                                                            ✗ Your Answer
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            )}

                            {/* True/False Options */}
                            {question.type === 'true_false' && (
                                <Box className="space-y-2">
                                    {[{ value: true, label: 'True' }, { value: false, label: 'False' }].map((option) => {
                                        const isSelected = selectedAnswer === option.value;
                                        const isCorrectOption = resultData && correctAnswer === (option.value ? 1 : 0);
                                        const isWrongSelection = resultData && isSelected && !isCorrect;

                                        // Determine border and background color based on result
                                        let borderColor = 'border-gray-300';
                                        let bgColor = '';
                                        let isDisabled = hasSubmission || !!resultData;

                                        if (resultData) {
                                            if (isCorrectOption) {
                                                borderColor = 'border-green-500';
                                                bgColor = 'bg-green-50';
                                            } else if (isWrongSelection) {
                                                borderColor = 'border-red-500';
                                                bgColor = 'bg-red-50';
                                            }
                                        } else if (isSelected) {
                                            borderColor = 'border-blue-500';
                                            bgColor = 'bg-blue-50';
                                        }

                                        return (
                                            <Box
                                                key={option.label}
                                                onClick={() => !isDisabled && onAnswerSelect(questionId, option.value)}
                                                className={`p-3 border-2 rounded transition-all ${borderColor} ${bgColor} ${
                                                    !isDisabled ? 'cursor-pointer hover:border-gray-400 hover:bg-gray-50' : 'cursor-default'
                                                }`}
                                            >
                                                <Box className="flex items-center gap-2.5">
                                                    <Box
                                                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                                            isCorrectOption
                                                                ? 'border-green-500 bg-green-500'
                                                                : isWrongSelection
                                                                ? 'border-red-500 bg-red-500'
                                                                : isSelected
                                                                ? 'border-blue-500 bg-blue-500'
                                                                : 'border-gray-400'
                                                        }`}
                                                    >
                                                        {(isSelected || isCorrectOption) && (
                                                            <Box className="w-1.5 h-1.5 bg-white rounded-full"></Box>
                                                        )}
                                                    </Box>
                                                    <Typography variant="body2" className="text-gray-800 flex-1">
                                                        {option.label}
                                                    </Typography>
                                                    {isCorrectOption && (
                                                        <Typography variant="caption" className="text-green-700 font-semibold">
                                                            ✓ Correct
                                                        </Typography>
                                                    )}
                                                    {isWrongSelection && (
                                                        <Typography variant="caption" className="text-red-700 font-semibold">
                                                            ✗ Your Answer
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            )}

                            {/* Fill in the Blank */}
                            {question.type === 'fill_blank' && (
                                <Box>
                                    <input
                                        type="text"
                                        value={selectedAnswer as string || ''}
                                        onChange={(e) => !hasSubmission && onAnswerSelect(questionId, e.target.value)}
                                        placeholder="Enter your answer (for practice - not graded)"
                                        disabled={hasSubmission}
                                        className="w-full p-3 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    />
                                    <Typography variant="caption" className="text-gray-500 mt-1 block">
                                        Note: Fill-in-the-blank questions are for practice and won't affect your score.
                                    </Typography>
                                </Box>
                            )}

                            {/* Explanation/Hint */}
                            {question.explanation && resultData && (
                                <Box className="mt-2 p-2.5 bg-blue-50 border-l-3 border-blue-400 rounded">
                                    <Typography variant="caption" className="text-blue-900">
                                        <strong>Explanation:</strong> {question.explanation}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    );
                })}

                {/* Quiz Results */}
                {quizResult && (
                    <Box className={`mb-6 p-4 rounded-lg border-2 ${
                        quizResult.passed
                            ? 'bg-green-50 border-green-500'
                            : 'bg-red-50 border-red-500'
                    }`}>
                        <Box className="flex items-center justify-between mb-3">
                            <Typography variant="h6" className={`font-bold ${
                                quizResult.passed
                                    ? 'text-green-700'
                                    : 'text-red-700'
                            }`}>
                                {quizResult.passed
                                    ? '✓ Quiz Passed!'
                                    : '✗ Quiz Not Passed'}
                            </Typography>
                            <Typography variant="h5" className={`font-bold ${
                                quizResult.passed
                                    ? 'text-green-700'
                                    : 'text-red-700'
                            }`}>
                                {quizResult.percentage}%
                            </Typography>
                        </Box>
                        <Box className="grid grid-cols-3 gap-4 text-sm">
                            <Box>
                                <Typography variant="caption" className="text-gray-600">Score</Typography>
                                <Typography variant="body2" className="font-semibold">
                                    {quizResult.correctAnswers} / {quizResult.totalQuestions} points
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" className="text-gray-600">Correct</Typography>
                                <Typography variant="body2" className="font-semibold">
                                    {quizResult.correctAnswers} / {quizResult.totalQuestions}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" className="text-gray-600">Status</Typography>
                                <Typography variant="body2" className="font-semibold">
                                    {quizResult.passed ? 'Passed' : 'Failed'}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                )}

                {/* Submit Section - Only show if no submission exists */}
                {!hasSubmission && (
                    <Box className="mt-6 pt-4 border-t">
                        <Box className="flex items-center justify-between">
                            <Typography variant="caption" className="text-gray-600">
                                {(() => {
                                    const totalQuestions = quizContent.questions?.length || 0;
                                    const gradedQuestions = quizContent.questions?.filter((q) => q.type !== 'fill_blank').length || 0;
                                    const answeredGraded = Object.keys(quizAnswers).filter(qId => {
                                        const question = quizContent.questions?.find((q) => q.id === qId || `q-${quizContent.questions?.indexOf(q)}` === qId);
                                        return question && question.type !== 'fill_blank';
                                    }).length;
                                    return `${answeredGraded} of ${gradedQuestions} graded questions answered`;
                                })()}
                            </Typography>
                            <button
                                onClick={onSubmit}
                                className="px-6 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                disabled={(() => {
                                    const gradedQuestions = quizContent.questions?.filter((q) => q.type !== 'fill_blank') || [];
                                    const answeredGraded = Object.keys(quizAnswers).filter(qId => {
                                        const question = quizContent.questions?.find((q) => q.id === qId || `q-${quizContent.questions?.indexOf(q)}` === qId);
                                        return question && question.type !== 'fill_blank';
                                    }).length;
                                    return answeredGraded !== gradedQuestions.length || isSubmitting;
                                })()}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                            </button>
                        </Box>
                    </Box>
                )}

                {/* Retake Button for Failed Quizzes */}
                {hasFailed && onRetake && (
                    <Box className="mt-6 pt-4 border-t flex justify-center">
                        <button
                            onClick={onRetake}
                            className="px-6 py-2.5 bg-orange-600 text-white font-semibold text-sm rounded hover:bg-orange-700 transition-colors"
                        >
                            Retake Quiz
                        </button>
                    </Box>
                )}

                {/* View Only Notice - Only for passed quizzes */}
                {hasSubmission && !hasFailed && (
                    <Box className="mt-6 pt-4 border-t">
                        <Typography variant="caption" className="text-gray-600 block text-center">
                            You have passed this quiz. Great job!
                        </Typography>
                    </Box>
                )}
            </Box>
        </div>
    );
}
