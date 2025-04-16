import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, AlertCircle, Loader2, Trophy } from 'lucide-react';
import QuizComponent from './Quiz/QuizComponent.tsx';
import { getAnsweredQuiz, getQuizByExerciseId } from '../../../../../services/lesson.ts'
import { Exercise, Quiz, SubmitAnswerReq } from '../../../../../model/classroom.ts'
import styles from './LearningChallenge.module.css';
import TestComponent from './TestComponent/TestComponent.tsx'
import { useSelector } from 'react-redux'
import RequireAuth from '../../../../commons/RequireAuth/RequireAuth.tsx'
import ConfirmationPopup from './PopupComponent/ConfirmationPopup.tsx'
import EmptyStateNotification from '../../../Teacher/common/EmptyStateNotification/EmptyStateNotification.tsx'
import { createScore } from '../../../../../services/score.ts'

const LearningChallenge: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { exercise, lessonId } = location.state as { exercise: Exercise, lessonId: string };
    const [quizList, setQuizList] = useState<Quiz[]>([]);
    const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [quizCount, setQuizCount] = useState(0);
    const { user } = useSelector((state: any) => state.auth);
    const [showConfirmation, setShowConfirmation] = useState(true);

    // Score tracking
    const [quizResults, setQuizResults] = useState<Record<string, boolean>>({});
    const [finalScore, setFinalScore] = useState<number | null>(null);
    const scoreSubmitted = useRef(false);

    if(!user){
        return (
            <RequireAuth></RequireAuth>
        );
    }

    useEffect(() => {
        if (!exercise) {
            setLoading(false);
            return;
        }

        const fetchQuizzes = async () => {
            try {
                const quizzes = await getQuizByExerciseId(exercise._id);
                setQuizList(quizzes.data);
                // Don't set currentQuiz here, wait for confirmation
                setLoading(false);
            } catch (error) {
                console.error('Lỗi khi tải câu hỏi:', error);
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, [exercise]);

    const handleSubmitAnswer = async (quiz: Quiz, answer: string[]) => {
        if (!quiz) {
            console.error("Quiz not found!");
            return { isCorrect: false, correctAnswer: '' };
        }

        const submitData: SubmitAnswerReq = {
            questionId: quiz._id,
            exerciseId: exercise._id,
            lessonId,
            userId: user._id,
            answer, // Mảng đáp án đã chọn
        };

        try {
            const data = await getAnsweredQuiz(submitData);
            const result = data.data;

            // Track individual quiz results - store this on each submit for later score calculation
            setQuizResults(prev => ({
                ...prev,
                [quiz._id]: result.isCorrect
            }));

            return {
                isCorrect: result.isCorrect,
                correctAnswer: result.correctAnswer
            };
        } catch (error) {
            console.error("Error submitting answer:", error);
            // Make sure to mark this question as incorrect in our tracking
            setQuizResults(prev => ({
                ...prev,
                [quiz._id]: false
            }));
            return { isCorrect: false, correctAnswer: '' };
        }
    };

    const handleSubmitTest = async (answers: Record<string, string[]>) => {
        try {
            // Ensure we have answers and valid data
            if (!answers || Object.keys(answers).length === 0) {
                throw new Error('No answers provided');
            }

            // Detailed quiz results
            const quizResults: Record<string, {
                isCorrect: boolean,
                correctAnswers: string[],
                userAnswers: string[]
            }> = {};

            // Array to store individual quiz check results
            const quizCheckPromises = Object.entries(answers).map(async ([quizId, selectedAnswers]) => {
                const submitData: SubmitAnswerReq = {
                    questionId: quizId,
                    exerciseId: exercise._id,
                    lessonId,
                    userId: user._id,
                    answer: selectedAnswers
                };

                try {
                    // Check each quiz individually
                    const data = await getAnsweredQuiz(submitData);
                    const result = data.data;

                    // Store detailed results
                    quizResults[quizId] = {
                        isCorrect: result.isCorrect,
                        correctAnswers: result.correctAnswer || [],
                        userAnswers: selectedAnswers
                    };

                    return {
                        quizId,
                        isCorrect: result.isCorrect,
                        partialCorrect: result.partialCorrect || false
                    };
                } catch (error) {
                    console.error(`Error checking quiz ${quizId}:`, error);
                    return {
                        quizId,
                        isCorrect: false,
                        partialCorrect: false
                    };
                }
            });

            // Wait for all quiz checks to complete
            const quizResultsList = await Promise.all(quizCheckPromises);

            // Calculate total score
            const totalQuestions = quizList.length;
            const correctQuestions = quizResultsList.filter(result => result.isCorrect).length;
            const partialQuestions = quizResultsList.filter(result => result.partialCorrect).length;

            // Calculate score (out of 10)
            const score = Math.round(
                ((correctQuestions + partialQuestions * 0.5) / totalQuestions) * 10
            );

            // Optional: Submit score to backend
            try {
                await createScore({
                    userId: user._id,
                    exerciseId: exercise._id,
                    score: score
                });
            } catch (scoreSubmitError) {
                console.error('Error submitting score:', scoreSubmitError);
            }

            // Return score and detailed quiz results
            return {
                score,
                quizResults
            };
        } catch (error) {
            console.error('Error submitting test:', error);
            return {
                score: 0,
                quizResults: {}
            };
        }
    };

    const calculateAndSubmitFinalScore = async () => {
        if (scoreSubmitted.current) return;

        try {
            // Calculate correct answers from tracked results
            const correctCount = Object.values(quizResults).filter(result => result === true).length;

            // Calculate final score (out of 10)
            const totalQuestions = quizList.length;
            const score = Math.round((correctCount / totalQuestions) * 10);
            setFinalScore(score);
            await createScore({
                userId: user._id,
                exerciseId: exercise._id,
                score: score
            });

            // Mark as submitted to prevent duplicate submissions
            scoreSubmitted.current = true;

            console.log(`Final score submitted: ${score}/10 (${correctCount}/${totalQuestions} correct)`);
        } catch (error) {
            console.error('Error calculating or submitting final score:', error);
        }
    };

    const handleConfirmExercise = () => {
        setShowConfirmation(false);
        setQuizCount(1);
        // Reset quiz tracking
        setQuizResults({});
        setFinalScore(null);
        scoreSubmitted.current = false;
        setCurrentQuizIndex(0);

        // Optional: Randomize questions here
        if (quizList.length > 0) {
            const randomizedQuizzes = [...quizList].sort(() => Math.random() - 0.5);
            setQuizList(randomizedQuizzes);
            setCurrentQuiz(randomizedQuizzes[0]);
        }
    };

    const handleNextQuestion = () => {
        const nextIndex = currentQuizIndex + 1;
        setCurrentQuizIndex(nextIndex);
        setQuizCount(quizCount + 1);
        setProgress((nextIndex) / quizList.length * 100);

        // Check if we've reached the end of the questions
        if (nextIndex >= quizList.length) {
            // Set currentQuiz to null to display the completion screen
            setCurrentQuiz(null);
            // Set progress to 100%
            setProgress(100);
            // Calculate and submit final score
            calculateAndSubmitFinalScore();
            return;
        }

        // Otherwise, move to the next question
        setCurrentQuiz(quizList[nextIndex]);
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader2 className={styles.loadingSpinner} size={48} />
                <p>Đang tải bài tập...</p>
            </div>
        );
    }

    if (!exercise) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorContent}>
                    <AlertCircle size={64} className={styles.errorIcon} />
                    <h2>Không tìm thấy bài tập!</h2>
                    <p>Hãy quay lại và chọn một bài tập để tiếp tục.</p>
                    <button
                        className={styles.backButton}
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={20} />
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <button
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={20} />
                    Quay lại
                </button>
                <div className={styles.exerciseInfo}>
                    <BookOpen size={24} />
                    <div>
                        <h1>{exercise.title || 'Bài tập'}</h1>
                        <p>{quizList.length} câu hỏi</p>
                    </div>
                </div>
            </header>

            {progress > 0 && (
                <div className={styles.progressContainer}>
                    <div
                        className={styles.progressBar}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            <main className={styles.mainContent}>
                {showConfirmation ? (
                    quizList.length > 0 ? (
                        <ConfirmationPopup
                            exercise={exercise}
                            quizCount={quizList.length}
                            onConfirm={handleConfirmExercise}
                            onCancel={() => navigate(-1)}
                        />
                    ) : (
                        <EmptyStateNotification
                            title="Chưa có bài tập"
                            message="Chưa có bài tập được thêm, hãy liên hệ với giáo viên của bạn nhé!"
                            image="https://i.pinimg.com/originals/9f/7c/90/9f7c9024044595556cf3025fa510e369.gif"
                        />
                    )
                ) : exercise.type === 'quiz' ? (
                    currentQuiz ? (
                        <QuizComponent
                            quiz={currentQuiz}
                            quizNumber={quizCount}
                            onSubmitAnswer={handleSubmitAnswer}
                            onNextQuestion={handleNextQuestion}
                            time={exercise.time}
                            exerciseId={exercise._id}
                            lessonId={lessonId}
                        />
                    ) : (
                        <div className={styles.completionContainer}>
                            <img
                                src="https://i.pinimg.com/originals/62/c3/79/62c379ae3baad2a6f3810a8ad1a19d47.gif"
                                alt="Completion"
                                className={styles.completionImage}
                            />
                            <h2>Hoàn thành bài tập!</h2>
                            <div className={styles.scoreDisplay}>
                                <Trophy size={32} className={styles.trophyIcon} />
                                <div className={styles.scoreInfo}>
                                    <p className={styles.scoreLabel}>Điểm số của bạn:</p>
                                    <h3 className={styles.scoreValue}>{finalScore}/10</h3>
                                </div>
                            </div>
                            <p className={styles.scoreDetail}>
                                Bạn đã trả lời đúng {Object.values(quizResults).filter(result => result === true).length}/{quizList.length} câu hỏi.
                            </p>
                            <button
                                className={styles.backButton}
                                onClick={() => navigate(-1)}
                            >
                                <ArrowLeft size={20} />
                                Quay lại danh sách
                            </button>
                        </div>
                    )
                ) : exercise.type === 'test' ? (
                    <TestComponent
                        exercise={exercise}
                        quizList={quizList}
                        userId={user._id}
                        lessonId={lessonId}
                        onSubmit={handleSubmitTest}  // Pass the function directly, not calling it
                    />
                ) : (
                    <div className={styles.errorContainer}>
                        <AlertCircle size={64} className={styles.errorIcon} />
                        <h2>Loại bài tập không hợp lệ</h2>
                        <p>Loại bài tập này hiện không được hỗ trợ.</p>
                        <button
                            className={styles.backButton}
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft size={20} />
                            Quay lại
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default LearningChallenge;