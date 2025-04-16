import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle, XCircle, Timer, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import styles from './QuizComponent.module.css';
import { Quiz, SubmitAnswerReq } from '../../../../../../model/classroom.ts'
import { getAnsweredQuiz } from '../../../../../../services/lesson.ts'
import RequireAuth from '../../../../../commons/RequireAuth/RequireAuth.tsx'
import { useSelector } from 'react-redux'

interface QuizComponentProps {
    quiz: Quiz;
    quizNumber: number;
    onSubmitAnswer: (quiz: Quiz, answer: string[]) => Promise<{ isCorrect: boolean, correctAnswer: string[] }>;
    onNextQuestion: () => void;
    time?: number;
    exerciseId: string;
    lessonId: string;
}

const COLORS = [
    { bg: '#EDF2FF', accent: '#4C6EF5' }, // Indigo
    { bg: '#FFF4E6', accent: '#FF922B' }, // Orange
    { bg: '#F3FAFB', accent: '#15AABF' }, // Cyan
    { bg: '#F8F0FC', accent: '#BE4BDB' }, // Purple
    { bg: '#EBF9F1', accent: '#40C057' }, // Green
];

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const QuizComponent: React.FC<QuizComponentProps> = ({ quiz, quizNumber, onSubmitAnswer, onNextQuestion, time, exerciseId, lessonId  }) => {
    const [selectedAnswers, setSelectedAnswers] = useState<boolean[]>([]);
    const [timeLeft, setTimeLeft] = useState(time);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
    const [showCelebration, setShowCelebration] = useState(false);
    const [isTimeOut, setIsTimeOut] = useState(false);
    const [nextQuestionCountdown, setNextQuestionCountdown] = useState<number | null>(null);
    const { user } = useSelector((state: any) => state.auth);

    if(!user){
        return (
            <RequireAuth></RequireAuth>
        );
    }
    const theme = useMemo(() =>
        COLORS[Math.floor(Math.random() * COLORS.length)], [quiz._id]
    );

    // Reset state on quiz change
    useEffect(() => {
        setSelectedAnswers(new Array(quiz.answers.length).fill(false));
        setTimeLeft(time);
        setIsSubmitted(false);
        setIsCorrect(null);
        setCorrectAnswers([]);
        setShowCelebration(false);
        setIsTimeOut(false);
        setNextQuestionCountdown(null);
    }, [quiz, time]);

    // Timer countdown effect
    useEffect(() => {
        if (timeLeft && timeLeft > 0 && !isSubmitted) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev? prev - 1 : prev);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !isSubmitted) {
            setIsTimeOut(true);
            handleSubmit(true);
        }
    }, [timeLeft, isSubmitted]);

    // Auto next question countdown
    useEffect(() => {
        if (nextQuestionCountdown !== null) {
            if (nextQuestionCountdown > 0) {
                const timer = setTimeout(() => {
                    setNextQuestionCountdown(prev => prev !== null ? prev - 1 : null);
                }, 1000);
                return () => clearTimeout(timer);
            } else {
                handleNextQuestion();
            }
        }
    }, [nextQuestionCountdown]);

    // Start next question countdown after submission
    useEffect(() => {
        if (isSubmitted && nextQuestionCountdown === null) {
            setNextQuestionCountdown(5);
        }
    }, [isSubmitted]);

    const handleAnswerSelect = (index: number) => {
        if (isSubmitted) return;

        setSelectedAnswers(prev => {

            if (quiz.type_answer === 'multiple_choice') {
                // Cho phép chọn nhiều đáp án
                const newAnswers = [...prev];
                newAnswers[index] = !newAnswers[index];
                return newAnswers;
            } else {
                // Chỉ cho phép chọn một đáp án
                const newAnswers = new Array(quiz.answers.length).fill(false);
                newAnswers[index] = true;
                return newAnswers;
            }
        });
    };
    const handleSubmit = async (isTimeout = false) => {
        if (isSubmitted) return;

        const answerArray = quiz.answers
            .map((answer, index) => (selectedAnswers[index] ? answer : null))
            .filter((answer) => answer !== null) as string[];

        try {
            // Call the onSubmitAnswer prop function instead of making a direct API call
            const response = await onSubmitAnswer(quiz, answerArray);

            setIsCorrect(response.isCorrect);
            setCorrectAnswers(response.correctAnswer);
            setIsSubmitted(true);

            if (response.isCorrect) {
                setShowCelebration(true);
                setTimeout(() => setShowCelebration(false), 3000);
            }
        } catch (error) {
            console.error("Error submitting answer:", error);
            setIsSubmitted(true);
            setIsCorrect(false);
        }
    };

    const handleNextQuestion = () => {
        onNextQuestion();
    };

    // Get class for answer buttons based on state
    const getAnswerButtonClass = (index: number) => {
        if (!isSubmitted) {
            return selectedAnswers[index] ? styles.selected : '';
        }

        const answer = quiz.answers[index];
        const isCorrectAnswer = correctAnswers.includes(answer);
        const userSelected = selectedAnswers[index];

        if (isCorrectAnswer && userSelected) {
            return styles.correct;
        } else if (isCorrectAnswer && !userSelected) {
            return styles.missed; // Đáp án đúng nhưng người dùng không chọn
        } else if (!isCorrectAnswer && userSelected) {
            return styles.incorrect; // Đáp án sai mà người dùng chọn
        }

        return '';
    };

    // Determine grid layout based on number of answers
    const getAnswersContainerStyle = () => {
        const gridClass = quiz.answers.length > 4
            ? styles.answersContainerGrid
            : styles.answersContainer;

        return gridClass;
    };

    // Get appropriate icon for answer result
    const getResultIcon = (index: number) => {
        if (!isSubmitted) return null;

        const answer = quiz.answers[index];
        const isCorrectAnswer = correctAnswers.includes(answer);
        const userSelected = selectedAnswers[index];

        if (isCorrectAnswer && userSelected) {
            return <CheckCircle size={20} className={styles.resultIcon} color="#4CAF50" />;
        } else if (isCorrectAnswer && !userSelected) {
            return <AlertTriangle size={20} className={styles.resultIcon} color="#FFC107" />;
        } else if (!isCorrectAnswer && userSelected) {
            return <XCircle size={20} className={styles.resultIcon} color="#FF5252" />;
        }

        return null;
    };

    return (
        <div className={styles.container} style={{ backgroundColor: theme.bg }}>
            {showCelebration && (
                <div className={styles.celebration}>
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div
                            key={i}
                            className={styles.confetti}
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`
                            }}
                        >
                            {['🎉', '🎊', '✨', '⭐', '🏆'][Math.floor(Math.random() * 5)]}
                        </div>
                    ))}
                </div>
            )}

            <div className={styles.header}>
                <div className={styles.timer} style={{ borderColor: isTimeOut ? '#FF5252' : theme.accent }}>
                    <Timer
                        size={20}
                        className={styles.timerIcon}
                        style={{ color: isTimeOut ? '#FF5252' : theme.accent }}
                    />
                    <span
                        className={styles.timerText}
                        style={{ color: isTimeOut ? '#FF5252' : theme.accent }}
                    >
                        {timeLeft}s
                    </span>
                </div>
                <div className={styles.questionNumber} style={{ color: theme.accent }}>
                    Câu hỏi {quizNumber}
                </div>
                <div className={styles.questionType} style={{ color: theme.accent }}>
                    {quiz.type_answer === 'multiple_choice' ? 'Nhiều đáp án' : 'Một đáp án'}
                </div>
            </div>

            {isTimeOut && !isCorrect && (
                <div className={styles.timeoutMessage}>
                    <XCircle size={24} color="#FF5252" />
                    <span>Hết thời gian!</span>
                </div>
            )}

            <div className={styles.questionContainer}>
                <h2 className={styles.question}>{quiz.question}</h2>
                {quiz.image && (
                    <div className={styles.imageWrapper}>
                        <img
                            src={quiz.image}
                            alt="Question image"
                            className={styles.questionImage}
                        />
                    </div>
                )}
            </div>

            <div className={getAnswersContainerStyle()}>
                {quiz.answers.map((answer, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`${styles.answerButton} ${getAnswerButtonClass(index)}`}
                        disabled={isSubmitted}
                        aria-label={`Option ${LETTERS[index]}: ${answer}`}
                    >
                        <span
                            className={styles.answerLetter}
                            style={{ backgroundColor: selectedAnswers[index] ? theme.accent : '#E0E0E0' }}
                        >
                            {LETTERS[index]}
                        </span>
                        <span className={styles.answerText}>{answer}</span>
                        {getResultIcon(index)}
                    </button>
                ))}
            </div>

            {!isSubmitted ? (
                <button
                    className={styles.submitButton}
                    onClick={() => handleSubmit()}
                    disabled={!selectedAnswers.some(answer => answer)}
                    style={{ backgroundColor: theme.accent }}
                >
                    <span>Kiểm tra đáp án</span>
                    <ArrowRight size={20} className={styles.submitIcon} />
                </button>
            ) : (
                <div className={styles.nextQuestionContainer}>
                    <button
                        className={styles.nextButton}
                        onClick={handleNextQuestion}
                        style={{ backgroundColor: theme.accent }}
                    >
                        <span>Câu hỏi tiếp theo</span>
                        <ArrowRight size={20} className={styles.nextIcon} />
                    </button>
                    <div className={styles.countdownIndicator}>
                        <Clock size={16} />
                        <span>Tự động sau {nextQuestionCountdown}s</span>
                    </div>
                </div>
            )}

            {isSubmitted && (
                <div className={styles.resultSummary}>
                    {isCorrect ? (
                        <div className={styles.correctResult}>
                            <CheckCircle size={24} color="#4CAF50" />
                            <span>Chính xác!</span>
                        </div>
                    ) : (
                        <div className={styles.incorrectResult}>
                            <XCircle size={24} color="#FF5252" />
                            <span>{isTimeOut ? 'Hết thời gian!' : 'Chưa chính xác!'}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuizComponent;