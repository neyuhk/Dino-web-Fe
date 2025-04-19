import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, AlertCircle, Loader2, Trophy } from 'lucide-react';
import QuizComponent from './Quiz/QuizComponent.tsx';
import { getAnsweredQuiz, getQuizByExerciseId } from '../../../../../services/lesson.ts'
import { Exercise, Lesson, Quiz, SubmitAnswerReq } from '../../../../../model/classroom.ts'
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
    const params = useParams();
    // Get lessonId from URL params instead of state
    const lessonId = params.lessonId || (location.state?.lessonId as string);
    const exercise = location.state?.exercise as Exercise;

    const [quizList, setQuizList] = useState<Quiz[]>([]);
    const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(false); // Changed to false initially since we're not loading on mount
    const [progress, setProgress] = useState(0);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [quizCount, setQuizCount] = useState(0);
    const { user } = useSelector((state: any) => state.auth);
    const [showConfirmation, setShowConfirmation] = useState(true);
    const [showExitConfirmation, setShowExitConfirmation] = useState(false);

    // Score tracking
    const [quizResults, setQuizResults] = useState<Record<string, boolean>>({});
    const [finalScore, setFinalScore] = useState<number | null>(null);
    const scoreSubmitted = useRef(false);
    const exerciseStarted = useRef(false);

    // Track if navigating back to previous page
    const isExiting = useRef(false);

    if(!user){
        return (
            <RequireAuth></RequireAuth>
        );
    }

    useEffect(() => {
        // No initial fetch of quizzes - will fetch only when user confirms

        // Handle browser back button or page refresh
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (exerciseStarted.current && !scoreSubmitted.current && !isExiting.current) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        };

        // Handle browser back button - similar to back button
        const handlePopState = () => {
            if (exerciseStarted.current && !scoreSubmitted.current && !isExiting.current) {
                // Prevent default back event
                window.history.pushState(null, '', window.location.pathname);

                // Show confirmation popup like back button
                setShowExitConfirmation(true);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);

        // Add a state to history stack to capture popstate events
        window.history.pushState(null, '', window.location.pathname);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    const fetchQuizzes = async () => {
        if (!exercise) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const quizzes = await getQuizByExerciseId(exercise._id);

            // If exercise.countQuiz is defined, limit the number of questions
            let questionList = quizzes.data;
            if (exercise.countQuiz && exercise.countQuiz > 0) {
                // Randomize and limit the number of questions
                questionList = [...quizzes.data]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, exercise.countQuiz);
            } else {
                // Just randomize all available questions
                questionList = [...quizzes.data].sort(() => Math.random() - 0.5);
            }

            setQuizList(questionList);

            // Set the first question
            if (questionList.length > 0) {
                setCurrentQuiz(questionList[0]);
            }

            setLoading(false);
        } catch (error) {
            console.error('Lỗi khi tải câu hỏi:', error);
            setLoading(false);
        }
    };

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
                scoreSubmitted.current = true;
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

    const submitZeroScore = async () => {
        if (scoreSubmitted.current) return;

        try {
            // Submit a score of zero
            await createScore({
                userId: user._id,
                exerciseId: exercise._id,
                score: 0
            });

            // Mark as submitted
            scoreSubmitted.current = true;

            console.log('Zero score submitted due to early exit');
        } catch (error) {
            console.error('Error submitting zero score:', error);
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
        // Mark that the exercise has been started
        exerciseStarted.current = true;

        // Fetch quizzes when user confirms
        fetchQuizzes();
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

    const handleNavigateBack = () => {
        if (exerciseStarted.current && !scoreSubmitted.current) {
            // Show exit confirmation popup
            setShowExitConfirmation(true);
        } else {
            // If exercise hasn't started or score is already submitted, navigate back directly
            goToLessonPage();
        }
    };

    // Function to navigate back to lesson page using params instead of state
    const goToLessonPage = () => {
        isExiting.current = true;
        navigate(`/classroom/courses/lesson/${lessonId}`, {
            replace: true,
        });
    };

    const handleConfirmExit = async () => {
        // Mark that we are intentionally exiting
        isExiting.current = true;

        // Submit a score of 0 before exiting
        await submitZeroScore();

        // Hide popup and navigate to lesson page
        setShowExitConfirmation(false);
        goToLessonPage();
    };

    const handleCancelExit = () => {
        // Just hide the popup and continue with the exercise
        setShowExitConfirmation(false);

        // Add a new state to history to ensure we can catch the next popstate event
        window.history.pushState(null, '', window.location.pathname);
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
                        onClick={goToLessonPage}
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
            {showExitConfirmation && (
                <div className={styles.confirmationOverlay}>
                    <div className={styles.confirmationModal}>
                        <AlertCircle size={48} className={styles.warningIcon} />
                        <h3>Cảnh báo!</h3>
                        <p>Nếu bạn thoát khỏi bài tập bây giờ, điểm số của bạn sẽ là 0.</p>
                        {exercise.type === 'quiz' ? (
                            <p>Hãy hoàn thành tất cả các câu hỏi để có được điểm số tốt nhất.</p>
                        ) : (
                            <p>Hãy nhấn nút "Nộp bài" để lưu điểm của bạn trước khi thoát.</p>
                        )}
                        <div className={styles.confirmationButtons}>
                            <button
                                className={styles.cancelButton}
                                onClick={handleCancelExit}
                            >
                                Tiếp tục làm bài
                            </button>
                            <button
                                className={styles.confirmButton}
                                onClick={handleConfirmExit}
                            >
                                Thoát và nhận điểm 0
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <header className={styles.header}>
                <button
                    className={styles.backButton}
                    onClick={handleNavigateBack}
                >
                    <ArrowLeft size={20} />
                    Quay lại
                </button>
                <div className={styles.exerciseInfo}>
                    <BookOpen size={24} />
                    <div>
                        <h1>{exercise.title || 'Bài tập'}</h1>
                        <p>{exercise.countQuiz || quizList.length} câu hỏi</p>
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
                    <ConfirmationPopup
                        exercise={exercise}
                        quizCount={exercise.countQuiz || 0}
                        onConfirm={handleConfirmExercise}
                        onCancel={goToLessonPage}
                    />
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
                                onClick={goToLessonPage}
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
                        onSubmit={handleSubmitTest}
                    />
                ) : (
                    <div className={styles.errorContainer}>
                        <AlertCircle size={64} className={styles.errorIcon} />
                        <h2>Loại bài tập không hợp lệ</h2>
                        <p>Loại bài tập này hiện không được hỗ trợ.</p>
                        <button
                            className={styles.backButton}
                            onClick={goToLessonPage}
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