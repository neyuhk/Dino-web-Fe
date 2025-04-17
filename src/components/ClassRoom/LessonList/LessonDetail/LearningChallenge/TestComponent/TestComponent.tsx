import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TestComponent.module.css';
import { Quiz, Exercise, SubmitAnswerReq } from '../../../../../../model/classroom.ts'

interface TestComponentProps {
    exercise: Exercise;
    quizList: Quiz[];
    userId: string;
    lessonId: string;
    onSubmit: (answers: Record<string, string[]>) => Promise<{
        score: number,
        quizResults: Record<string, {
            isCorrect: boolean,
            correctAnswers: string[],
            userAnswers: string[]
        }>
    }>;
}

const TestComponent: React.FC<TestComponentProps> = ({
                                                         exercise,
                                                         quizList,
                                                         userId,
                                                         lessonId,
                                                         onSubmit
                                                     }) => {
    const navigate = useNavigate();
    const [answers, setAnswers] = useState<Record<string, string[]>>({});
    const [timeLeft, setTimeLeft] = useState<number>(exercise.time);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isCompleted, setIsCompleted] = useState<boolean>(exercise.isCompleted);
    const [score, setScore] = useState<number | undefined>(exercise.score);
    const [quizResults, setQuizResults] = useState<Record<string, any>>({});
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [showDetailedResults, setShowDetailedResults] = useState<boolean>(false);

    useEffect(() => {
        const initialAnswers: Record<string, string[]> = {};
        quizList.forEach(quiz => {
            initialAnswers[quiz._id] = [];
        });
        setAnswers(initialAnswers);
    }, [quizList]);

    useEffect(() => {
        if (isCompleted || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isCompleted, timeLeft]);

    const handleSubmit = async () => {
        if (timeLeft > 0) {
            setShowConfirmModal(true);
            return;
        }
        await performSubmit();
    };

    const performSubmit = async () => {
        setIsSubmitting(true);
        try {
            const result = await onSubmit(answers);
            setScore(result.score);
            setQuizResults(result.quizResults);
            setIsCompleted(true);
            setShowConfirmModal(false);
        } catch (error) {
            console.error("Error submitting test:", error);
        }
        setIsSubmitting(false);
    };

    const handleAutoSubmit = async () => {
        try {
            const result = await onSubmit(answers);
            setScore(result.score);
            setQuizResults(result.quizResults);
            setIsCompleted(true);
        } catch (error) {
            console.error("Error in auto submit:", error);
        }
        setIsSubmitting(false);
    };

    const handleAnswerChange = (quizId: string, answer: string, isMultiple: boolean) => {
        if (isCompleted) return;

        setAnswers(prev => {
            const newAnswers = { ...prev };

            if (isMultiple) {
                if (newAnswers[quizId].includes(answer)) {
                    newAnswers[quizId] = newAnswers[quizId].filter(a => a !== answer);
                } else {
                    newAnswers[quizId] = [...newAnswers[quizId], answer];
                }
            } else {
                newAnswers[quizId] = [answer];
            }

            return newAnswers;
        });
    };
    const getAnswerStatus = (quizId: string, answer: string): string => {
        if (!isCompleted) return '';

        const quizResult = quizResults[quizId];
        if (!quizResult) return '';

        const { correctAnswers, userAnswers } = quizResult;

        console.log("Debugging answer status:", {
            quizId,
            answer,
            correctAnswers,
            userAnswers
        });

        // Correctly answered (user selected the right answer)
        if (correctAnswers.includes(answer) && userAnswers.includes(answer)) {
            return styles.correctAnswer;
        }

        // Incorrect answer (user selected a wrong answer)
        if (userAnswers.includes(answer) && !correctAnswers.includes(answer)) {
            return styles.incorrectAnswer;
        }

        // Correct answer not selected by user
        if (correctAnswers.length > 1 && correctAnswers.includes(answer) && !userAnswers.includes(answer)) {
            return styles.partialAnswer;
        }

        return '';
    };
    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const paddedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

        return hours > 0
            ? `${hours}:${paddedMinutes}:${paddedSeconds}`
            : `${minutes}:${paddedSeconds}`;
    };


    const renderConfirmationModal = () => {
        return (
            <div className={styles.confirmationModal}>
                <div className={styles.modalContent}>
                    <h2>Xác nhận nộp bài</h2>
                    <p>Bạn có chắc chắn muốn nộp bài ngay bây giờ không?</p>
                    <div className={styles.modalButtons}>
                        <button
                            className={`${styles.button} ${styles.submitButton}`}
                            onClick={performSubmit}
                        >
                            Nộp bài
                        </button>
                        <button
                            className={`${styles.button} ${styles.cancelButton}`}
                            onClick={() => setShowConfirmModal(false)}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderDetailedResults = () => {
        return (
            <div className={styles.detailedResultsContainer}>
                <h2 className={styles.resultTitle}>Chi tiết bài làm</h2>
                {quizList.map((quiz) => {
                    const quizResult = quizResults[quiz._id];

                    // If no quiz result, return null or handle accordingly
                    if (!quizResult) return null;

                    const { isCorrect, correctAnswers, userAnswers } = quizResult;

                    return (
                        <div key={quiz._id} className={styles.quizResultItem}>
                            <div className={styles.questionHeader}>
                                <h3 className={styles.questionNumber}>Câu {quiz.index}:</h3>
                                <h3 className={styles.questionText}>{quiz.question}</h3>
                                <div className={`${
                                    isCorrect
                                        ? styles.correctResultBadge
                                        : styles.incorrectResultBadge
                                }`}>
                                    {isCorrect ? 'Đúng' : 'Sai'}
                                </div>
                            </div>

                            <div className={styles.answerContainer}>
                                {quiz.answers.map((answer, index) => {
                                    let answerStatus = '';
                                    let isSystemCorrect = correctAnswers.includes(answer);
                                    let isUserSelected = userAnswers.includes(answer);

                                    if (isUserSelected) {
                                        // Nếu user chọn đáp án này
                                        if (isSystemCorrect) {
                                            answerStatus = styles.correctAnswer; // Đúng (màu xanh)
                                        } else {
                                            answerStatus = styles.incorrectAnswer; // Sai (màu đỏ)
                                        }
                                    } else {
                                        // Nếu user KHÔNG chọn đáp án này
                                        if (correctAnswers.length > 1 && isSystemCorrect) {
                                            answerStatus = styles.partialAnswer; // Đúng nhưng chưa chọn (màu vàng, nhiều đáp án)
                                        }
                                        // 🆕 Bổ sung: Nếu chỉ có 1 đáp án đúng và user sai, vẫn cần hiển thị màu xanh cho đáp án đúng
                                        else if (correctAnswers.length === 1 && isSystemCorrect) {
                                            answerStatus = styles.correctAnswer; // Chỉ có 1 đáp án đúng → Luôn sáng xanh nếu đúng
                                        }
                                    }

                                    return (
                                        <div key={index} className={`${styles.answerItem} ${answerStatus}`}>
                                            <div className={styles.answerText}>
                                                {answer}
                                                {isUserSelected && <span className={styles.userAnswerIndicator}>(Của bạn)</span>}
                                                {!isUserSelected && isSystemCorrect && <span className={styles.correctAnswerIndicator}>(Đáp án đúng)</span>}
                                            </div>
                                        </div>
                                    );
                                })}

                            </div>
                        </div>
                    );
                })}
                <div className={styles.submitContainer}>
                    <button
                        className={`${styles.button} ${styles.submitButton}`}
                        onClick={() => navigate(-1)}
                    >
                        Thoát
                    </button>
                </div>
            </div>
        );
    };
    // Main render method
    return (
        <div className={styles.testContainer}>
            {showConfirmModal && renderConfirmationModal()}

            {!isCompleted ? (
                <>
                    <div className={styles.testHeader}>
                        <h1 className={styles.testTitle}>{exercise.title}</h1>
                        <p className={styles.testDescription}>{exercise.description}</p>
                        <div className={styles.timer}>
                            Thời gian còn lại: {formatTime(timeLeft)}
                        </div>
                    </div>

                    <div className={styles.quizContainer}>
                        {quizList.map((quiz) => (
                            <div key={quiz._id} className={styles.quizItem}>
                                <div className={styles.questionHeader}>
                                    <h3 className={styles.questionNumber}>Câu {quiz.index}:</h3>
                                    <h3 className={styles.questionText}>{quiz.question}</h3>
                                </div>

                                <div className={styles.answerContainer}>
                                    {quiz.answers.map((answer, answerIndex) => (
                                        <div
                                            key={answerIndex}
                                            className={`${styles.answerItem} ${
                                                answers[quiz._id]?.includes(answer)
                                                    ? styles.selectedAnswer
                                                    : ''
                                            }`}
                                            onClick={() =>
                                                handleAnswerChange(
                                                    quiz._id,
                                                    answer,
                                                    quiz.type_answer === 'multiple_choice'
                                                )
                                            }
                                        >
                                            <div className={styles.answerCheckbox}>
                                                {quiz.type_answer === 'multiple_choice' ? (
                                                    <div className={`${styles.checkbox} ${
                                                        answers[quiz._id]?.includes(answer)
                                                            ? styles.checked
                                                            : ''
                                                    }`}>
                                                        {answers[quiz._id]?.includes(answer) && <span>✓</span>}
                                                    </div>
                                                ) : (
                                                    <div className={`${styles.radio} ${
                                                        answers[quiz._id]?.includes(answer)
                                                            ? styles.checked
                                                            : ''
                                                    }`}>
                                                        {answers[quiz._id]?.includes(answer) &&
                                                            <span className={styles.radioInner}></span>
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                            <div className={styles.answerText}>{answer}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.submitContainer}>
                        <button
                            className={`${styles.button} ${styles.submitButton}`}
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
                        </button>
                    </div>
                </>
            ) : showDetailedResults ? (
                renderDetailedResults()
            ) : (
                <div className={styles.resultContainer}>
                    <h2 className={styles.resultTitle}>Hoàn thành bài thi</h2>
                    <div className={styles.scoreDisplay}>
                        Điểm số: <span className={styles.score}>{score}/10</span>
                    </div>
                    <div className={styles.submitContainer}>
                        <button
                            className={`${styles.button} ${styles.submitButton}`}
                            onClick={() => setShowDetailedResults(true)}
                        >
                            Xem chi tiết
                        </button>
                        <button
                            className={`${styles.button} ${styles.cancelButton}`}
                            onClick={() => navigate(-1)}
                        >
                            Thoát
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestComponent;