import React, { useEffect, useState } from 'react';
import styles from './ExerciseDetail.module.css';
import { X, CheckCircle, XCircle, Clock, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { getAnswerResultByExerciseAndUser } from '../../../services/score.ts'
import { convertDateTime, convertDateTimeToDate } from '../../../helpers/convertDateTime.ts'

interface Props {
    userId: string;
    userName: string;
    exerciseId: string;
    onClose: () => void;
}

const ExerciseDetail: React.FC<Props> = ({ userId, userName, exerciseId, onClose }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<any[]>([]);
    const [user_name, setUserName] = useState<string>('');
    const [exerciseTitle, setExerciseTitle] = useState<string>('');
    const [submissionDate, setSubmissionDate] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<string | null>(null);
    const [scoreDetails, setScoreDetails] = useState({
        total: 0,
        correct: 0,
        percentage: 0
    });

    useEffect(() => {
        const fetchSubmissionDetails = async () => {
            try {
                setLoading(true);
                setUserName(userName)
                console.log("name", user_name)
                const response = await getAnswerResultByExerciseAndUser(exerciseId, userId);
                console.log('response',response.data)
                if (response.data) {
                    console.log("oke ma")
                    setResults(response.data);

                    const updateAt = response.data.reduce((latest: any, item: any) => {
                        return new Date(item.updatedAt) > new Date(latest) ? item.updatedAt : latest;
                    }, response.data[0].updatedAt);
                    setLastUpdate(updateAt)
                    console.log("last update", convertDateTime(lastUpdate));

                    // Calculate score
                    const totalQuestions = response.data.length;  // Changed from response.length
                    const correctAnswers = response.data.filter((item: { is_correct: any; }) => item.is_correct).length;  // Changed from response.filter
                    const percentage = totalQuestions > 0
                        ? Math.round((correctAnswers / totalQuestions) * 100)
                        : 0;
                    console.log("tinh %", correctAnswers, totalQuestions)
                    setScoreDetails({
                        total: totalQuestions,
                        correct: correctAnswers,
                        percentage
                    });

                    // Extract submission date from the first result (if available)
                    if (response.length > 0) {
                        const firstSubmission = response[0];
                        setSubmissionDate(firstSubmission.createdAt);

                        // Use question data to infer exercise title (we don't have it directly)
                        // This is just a placeholder - in a real app, you might want to fetch this separately
                        setExerciseTitle(`Bài tập #${firstSubmission.question_id.exercise_id.slice(-6)}`);

                        // This would be replaced with actual user data in a real implementation
                        setUserName(`Học viên #${firstSubmission.user_id.slice(-6)}`);
                    }
                } else {
                    setError("Không có dữ liệu bài làm");
                }
            } catch (err) {
                console.error("Error fetching exercise details:", err);
                setError("Không thể tải dữ liệu bài làm");
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissionDetails();
    }, [exerciseId, userId]);

    // Format date from ISO string
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
        } catch (e) {
            return 'Không xác định';
        }
    };

    // Handle click outside to close modal
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Determine if option was selected by student
    const isOptionSelected = (answer: string[], option: string) => {
        return answer.includes(option);
    };

    // Determine if option is correct
    const isOptionCorrect = (correctAnswers: string[], option: string) => {
        return correctAnswers.includes(option);
    };

    // Sort results by question index
    const sortedResults = results

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h3>Chi tiết bài làm</h3>
                    <button className={styles.closeButton} onClick={onClose} aria-label="Đóng">
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    {loading ? (
                        <div className={styles.loadingContainer}>
                            <div className={styles.spinner}></div>
                            <p>Đang tải dữ liệu bài làm...</p>
                        </div>
                    ) : error ? (
                        <div className={styles.errorContainer}>
                            <XCircle size={24} />
                            <p>{error}</p>
                        </div>
                    ) : (
                        <>
                            <div className={styles.summarySection}>
                                <div className={styles.summaryHeader}>
                                    <h4>Thời gian nộp bài {convertDateTime(lastUpdate)} </h4>
                                    <div className={styles.summaryScore}>
                    <span
                        className={`${styles.scorePercentage} ${
                            scoreDetails.percentage >= 80 ? styles.excellent :
                                scoreDetails.percentage >= 60 ? styles.good :
                                    scoreDetails.percentage >= 40 ? styles.average :
                                        styles.poor
                        }`}
                    >
                      {scoreDetails.percentage}%
                    </span>
                                        <span className={styles.scoreText}>
                      {scoreDetails.correct}/{scoreDetails.total} câu đúng
                    </span>
                                    </div>
                                </div>

                                <div className={styles.summaryDetails}>
                                    <div className={styles.summaryItem}>
                                        <User size={16} className={styles.summaryIcon} />
                                        <span>{userName}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.questionsContainer}>
                                {sortedResults.length === 0 ? (
                                    <div className={styles.noContentMessage}>
                                        Không có dữ liệu bài làm cho học viên này
                                    </div>
                                ) : (
                                    sortedResults.map((result, resultIndex) => (
                                        <div
                                            key={result._id}
                                            className={`${styles.questionCard} ${result.is_correct ? styles.correctAnswer : styles.incorrectAnswer}`}
                                        >
                                            <div className={styles.questionHeader}>
                                                <div className={styles.questionNumber}>
                                                    Câu {resultIndex + 1}
                                                    <span className={styles.questionStatus}>
                            {result.is_correct ? (
                                <CheckCircle size={18} className={styles.correctIcon} />
                            ) : (
                                <XCircle size={18} className={styles.incorrectIcon} />
                            )}
                          </span>
                                                </div>
                                                <div className={styles.questionType}>
                                                    {result.question_id.type_answer === 'one_choice'
                                                        ? 'Chọn một đáp án'
                                                        : 'Chọn nhiều đáp án'}
                                                </div>
                                            </div>

                                            <div className={styles.questionContent}>
                                                <p className={styles.questionText}>{result.question_id.question}</p>

                                                {result.question_id.image && (
                                                    <div className={styles.questionImage}>
                                                        <img src={result.question_id.image} alt="Hình minh họa" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className={styles.answers}>
                                                {result.question_id.answers.map((option: any, index: any) => {
                                                    const isSelected = isOptionSelected(result.answer, option);
                                                    const isCorrect = isOptionCorrect(result.question_id.correct_answer, option);

                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`${styles.answerOption} ${
                                                                isSelected && isCorrect ? styles.selectedCorrect :
                                                                    isSelected && !isCorrect ? styles.selectedIncorrect :
                                                                        !isSelected && isCorrect ? styles.unselectedCorrect :
                                                                            styles.unselected
                                                            }`}
                                                        >
                              <span className={styles.optionLabel}>
                                {String.fromCharCode(65 + index)}
                              </span>
                                                            <span className={styles.optionText}>{option}</span>

                                                            {/* Show indicators for correct/incorrect selections */}
                                                            {isSelected && (
                                                                <span className={styles.selectionIndicator}>
                                  {isCorrect ? (
                                      <CheckCircle size={16} className={styles.correctIcon} />
                                  ) : (
                                      <XCircle size={16} className={styles.incorrectIcon} />
                                  )}
                                </span>
                                                            )}

                                                            {/* Highlight correct answer if student chose wrong */}
                                                            {!isSelected && isCorrect && result.answer.length > 0 && !result.is_correct && (
                                                                <span className={styles.selectionIndicator}>
                                  <CheckCircle size={16} className={styles.correctIndicator} />
                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.closeButton} onClick={onClose}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExerciseDetail;
