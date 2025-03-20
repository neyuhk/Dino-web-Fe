import React, { useState, useEffect } from 'react';
import styles from './TestComponent.module.css';
import { Quiz, Exercise } from '../../../../../../model/classroom.ts'

interface TestComponentProps {
    exercise: Exercise;
    quizList: Quiz[];
    onSubmit: (answers: Record<string, string[]>) => Promise<{score: number}>;
}

const TestComponent: React.FC<TestComponentProps> = ({ exercise, quizList, onSubmit }) => {
    const [answers, setAnswers] = useState<Record<string, string[]>>({});
    const [timeLeft, setTimeLeft] = useState<number>(exercise.time * 60);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isCompleted, setIsCompleted] = useState<boolean>(exercise.isCompleted);
    const [score, setScore] = useState<number | undefined>(exercise.score);
    const [correctAnswers, setCorrectAnswers] = useState<Record<string, string[]>>({});

    // Initialize answers
    useEffect(() => {
        const initialAnswers: Record<string, string[]> = {};
        quizList.forEach(quiz => {
            initialAnswers[quiz.id] = [];
        });
        setAnswers(initialAnswers);
    }, [quizList]);

    // Countdown timer
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

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = (quizId: string, answer: string, isMultiple: boolean) => {
        setAnswers(prev => {
            const newAnswers = { ...prev };

            if (isMultiple) {
                // For multiple choice, toggle the answer
                if (newAnswers[quizId].includes(answer)) {
                    newAnswers[quizId] = newAnswers[quizId].filter(a => a !== answer);
                } else {
                    newAnswers[quizId] = [...newAnswers[quizId], answer];
                }
            } else {
                // For one choice, replace the answer
                newAnswers[quizId] = [answer];
            }

            return newAnswers;
        });
    };

    const handleAutoSubmit = async () => {
        setIsSubmitting(true);
        try {
            const result = await onSubmit(answers);
            setScore(result.score);
            setIsCompleted(true);

            // Mock correct answers (in a real app this would come from backend)
            const mockCorrect: Record<string, string[]> = {};
            quizList.forEach(quiz => {
                // This is just a placeholder - in reality this would come from your API
                mockCorrect[quiz.id] = quiz.answer.slice(0, 1);
            });
            setCorrectAnswers(mockCorrect);
        } catch (error) {
            console.error("Error submitting test:", error);
        }
        setIsSubmitting(false);
    };

    const handleSubmitClick = () => {
        setIsSubmitting(true);
    };

    const handleConfirmSubmit = async () => {
        try {
            const result = await onSubmit(answers);
            setScore(result.score);
            setIsCompleted(true);

            // Mock correct answers (in a real app this would come from backend)
            const mockCorrect: Record<string, string[]> = {};
            quizList.forEach(quiz => {
                // This is just a placeholder - in reality this would come from your API
                mockCorrect[quiz.id] = quiz.answer.slice(0, 1);
            });
            setCorrectAnswers(mockCorrect);
        } catch (error) {
            console.error("Error submitting test:", error);
        }
        setIsSubmitting(false);
    };

    const handleCancelSubmit = () => {
        setIsSubmitting(false);
    };

    const isAnswerCorrect = (quizId: string, answer: string): boolean => {
        if (!isCompleted || !correctAnswers[quizId]) return false;
        return correctAnswers[quizId].includes(answer);
    };

    const isAnswerSelected = (quizId: string, answer: string): boolean => {
        return answers[quizId]?.includes(answer) || false;
    };

    const getAnswerClass = (quizId: string, answer: string): string => {
        if (!isCompleted) {
            return isAnswerSelected(quizId, answer) ? styles.selectedAnswer : '';
        }

        if (isAnswerCorrect(quizId, answer)) {
            return styles.correctAnswer;
        }

        if (isAnswerSelected(quizId, answer) && !isAnswerCorrect(quizId, answer)) {
            return styles.incorrectAnswer;
        }

        if (correctAnswers[quizId]?.includes(answer)) {
            return styles.correctAnswer;
        }

        return '';
    };

    return (
        <div className={styles.testContainer}>
            <div className={styles.testHeader}>
                <h1 className={styles.testTitle}>{exercise.title}</h1>
                <p className={styles.testDescription}>{exercise.description}</p>
                <div className={styles.timer}>
                    {isCompleted ? 'Completed' : `Time Remaining: ${formatTime(timeLeft)}`}
                </div>
            </div>

            {isSubmitting && !isCompleted && (
                <div className={styles.confirmationModal}>
                    <div className={styles.modalContent}>
                        <p>Thời gian còn {formatTime(timeLeft)}, bạn có chắc chắn muốn nộp bài?</p>
                        <div className={styles.modalButtons}>
                            <button
                                className={`${styles.button} ${styles.submitButton}`}
                                onClick={handleConfirmSubmit}
                            >
                                Nộp bài
                            </button>
                            <button
                                className={`${styles.button} ${styles.cancelButton}`}
                                onClick={handleCancelSubmit}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.quizContainer}>
                {quizList.map((quiz) => (
                    <div key={quiz.id} className={styles.quizItem}>
                        <div className={styles.questionHeader}>
                            <h3 className={styles.questionNumber}>Câu {quiz.index}:</h3>
                            <h3 className={styles.questionText}>{quiz.question}</h3>
                        </div>

                        {quiz.image && (
                            <div className={styles.imageContainer}>
                                <img src={quiz.image} alt={`Question ${quiz.index}`} className={styles.questionImage} />
                            </div>
                        )}

                        <div className={styles.answerContainer}>
                            {quiz.answer.map((answer, answerIndex) => (
                                <div
                                    key={answerIndex}
                                    className={`${styles.answerItem} ${getAnswerClass(quiz.id, answer)}`}
                                    onClick={() => !isCompleted && handleAnswerChange(quiz.id, answer, quiz.typeAnswer === 'multiple_choice')}
                                >
                                    <div className={styles.answerCheckbox}>
                                        {quiz.typeAnswer === 'multiple_choice' ? (
                                            <div className={`${styles.checkbox} ${isAnswerSelected(quiz.id, answer) ? styles.checked : ''}`}>
                                                {isAnswerSelected(quiz.id, answer) && <span>✓</span>}
                                            </div>
                                        ) : (
                                            <div className={`${styles.radio} ${isAnswerSelected(quiz.id, answer) ? styles.checked : ''}`}>
                                                {isAnswerSelected(quiz.id, answer) && <span className={styles.radioInner}></span>}
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

            {isCompleted ? (
                <div className={styles.resultContainer}>
                    <h2 className={styles.resultTitle}>Kết quả</h2>
                    <div className={styles.scoreDisplay}>
                        <p>Điểm của bạn: <span className={styles.score}>{score}</span></p>
                    </div>
                </div>
            ) : (
                <div className={styles.submitContainer}>
                    <button
                        className={`${styles.button} ${styles.submitButton}`}
                        onClick={handleSubmitClick}
                        disabled={isSubmitting}
                    >
                        Nộp bài
                    </button>
                </div>
            )}
        </div>
    );
};

export default TestComponent;