import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import QuizComponent from './Quiz/QuizComponent.tsx';
import { getAnsweredQuiz, getNextQuiz, getQuizByExerciseId } from '../../../../../services/lesson.ts'
import { Exercise, Quiz, SubmitAnswerReq } from '../../../../../model/classroom.ts'
import styles from './LearningChallenge.module.css';
import TestComponent from './TestComponent/TestComponent.tsx'
import { useSelector } from 'react-redux'
import RequireAuth from '../../../../commons/RequireAuth/RequireAuth.tsx'
import ConfirmationPopup from './PopupComponent/ConfirmationPopup.tsx'

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

    // const handleGetNextQuiz = async (currentIndex: number) => {
    //     const nextQuiz = await getNextQuiz(currentIndex) ?? null;
    //     setCurrentQuiz(nextQuiz);
    //     setProgress((currentIndex + 1) / quizList.length * 100);
    // };
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
            const result = await getAnsweredQuiz(submitData);
            return {
                isCorrect: result.isCorrect,
                correctAnswer: result.correctAnswer
            };
        } catch (error) {
            console.error("Error submitting answer:", error);
            return { isCorrect: false, correctAnswer: '' };
        }
    };

    const handleSubmitTest = async (answers: Record<string, string[]>) => {
        try {
            // Đây là nơi bạn sẽ gọi API để kiểm tra kết quả và lấy điểm số
            // Ví dụ mẫu:
            // const result = await submitTestAnswers(exercise.id, answers);
            // return result;

            // Trả về mẫu để demo:
            return { score: 85 }; // Điểm mẫu
        } catch (error) {
            console.error('Error submitting test:', error);
            return { score: 0 };
        }
    };

    const handleConfirmExercise = () => {
        setShowConfirmation(false);
        setQuizCount(1)
        // Optional: Randomize questions here
        if (quizList.length > 0) {
            const randomizedQuizzes = [...quizList].sort(() => Math.random() - 0.5);
            setQuizList(randomizedQuizzes);
            setCurrentQuiz(randomizedQuizzes[0]);
        }
    };

    const handleNextQuestion = () => {
        setProgress((currentQuizIndex + 1) / quizList.length * 100);
        const nextIndex = currentQuizIndex + 1;
        setQuizCount(quizCount + 1);
        // Check if we've reached the end of the questions
        if (nextIndex >= quizList.length) {
            // Set currentQuiz to null to display the completion screen
            setCurrentQuiz(null);
            // Set progress to 100%
            setProgress(100);
            return;
        }

        // Otherwise, move to the next question
        setCurrentQuizIndex(nextIndex);
        setCurrentQuiz(quizList[nextIndex]);
        // Update progress

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
                    <ConfirmationPopup
                        exercise={exercise}
                        quizCount={quizList.length}
                        onConfirm={handleConfirmExercise}
                        onCancel={() => navigate(-1)}
                    />
                ) : exercise.type === 'quiz' ? (
                    currentQuiz ? (
                        <QuizComponent
                            quiz={currentQuiz}
                            quizNumber = {quizCount}
                            onSubmitAnswer={(answer) => handleSubmitAnswer(currentQuiz, answer)}
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
                            <p>Bạn đã hoàn thành tất cả các câu hỏi.</p>
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
                        onSubmit={handleSubmitTest}
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