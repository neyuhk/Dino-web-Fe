import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './QuestionForm.module.css';
import { addQuiz } from '../../../../../services/lesson.ts' // Adjust the import path as needed

type AnswerType = 'multiple_choice' | 'one_choice';

interface Answer {
    id: string;
    text: string;
}

interface Question {
    question: string;
    type_answer: AnswerType;
    answers: Answer[];
    correct_answer: string[];
    image?: File | null;
    imagePreview?: string;
    index: number;
}

interface QuestionFormProps {
    lessonId: string;
    exerciseId: string;
    exerciseType: string;
    onComplete: () => void;
    onCancel: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
                                                       lessonId,
                                                       exerciseId,
                                                       exerciseType,
                                                       onComplete,
                                                       onCancel
                                                   }) => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<Question>({
        question: '',
        type_answer: 'one_choice',
        answers: [{ id: '1', text: '' }, { id: '2', text: '' }],
        correct_answer: [],
        image: null,
        imagePreview: undefined,
        index: 1,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addAnswer = () => {
        const newId = (currentQuestion.answers.length + 1).toString();
        setCurrentQuestion({
            ...currentQuestion,
            answers: [...currentQuestion.answers, { id: newId, text: '' }]
        });
    };

    const removeAnswer = (id: string) => {
        if (currentQuestion.answers.length <= 2) {
            setError('Phải có ít nhất 2 câu trả lời');
            return;
        }

        // Remove from answers array
        const updatedAnswers = currentQuestion.answers.filter(answer => answer.id !== id);

        // Remove from correct_answer array if present
        const updatedCorrectAnswers = currentQuestion.correct_answer.filter(answerId => answerId !== id);

        setCurrentQuestion({
            ...currentQuestion,
            answers: updatedAnswers,
            correct_answer: updatedCorrectAnswers
        });

        setError(null);
    };

    const handleAnswerChange = (id: string, text: string) => {
        const updatedAnswers = currentQuestion.answers.map(answer =>
            answer.id === id ? { ...answer, text } : answer
        );

        setCurrentQuestion({
            ...currentQuestion,
            answers: updatedAnswers
        });
    };

    const handleCorrectAnswerChange = (id: string) => {
        let updatedCorrectAnswers: string[];

        if (currentQuestion.type_answer === 'one_choice') {
            // For one_choice, only keep the selected answer
            updatedCorrectAnswers = [id];
        } else {
            // For multiple_choice, toggle the answer's presence in the array
            if (currentQuestion.correct_answer.includes(id)) {
                updatedCorrectAnswers = currentQuestion.correct_answer.filter(answerId => answerId !== id);
            } else {
                updatedCorrectAnswers = [...currentQuestion.correct_answer, id];
            }
        }

        setCurrentQuestion({
            ...currentQuestion,
            correct_answer: updatedCorrectAnswers
        });
    };

    const handleTypeChange = (type: AnswerType) => {
        let updatedCorrectAnswers = currentQuestion.correct_answer;

        // If changing from multiple to one choice and multiple are selected,
        // only keep the first selected answer
        if (type === 'one_choice' && currentQuestion.correct_answer.length > 1) {
            updatedCorrectAnswers = [currentQuestion.correct_answer[0]];
        }

        setCurrentQuestion({
            ...currentQuestion,
            type_answer: type,
            correct_answer: updatedCorrectAnswers
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCurrentQuestion({
                    ...currentQuestion,
                    image: file,
                    imagePreview: reader.result as string
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setCurrentQuestion({
            ...currentQuestion,
            image: null,
            imagePreview: undefined
        });
    };

    const validateQuestion = (): boolean => {
        if (!currentQuestion.question.trim()) {
            setError('Vui lòng nhập câu hỏi');
            return false;
        }

        if (currentQuestion.answers.some(answer => !answer.text.trim())) {
            setError('Tất cả các câu trả lời phải có nội dung');
            return false;
        }

        if (currentQuestion.correct_answer.length === 0) {
            setError('Vui lòng chọn ít nhất một câu trả lời đúng');
            return false;
        }

        // Add validation for multiple_choice type - must have more than one correct answer
        if (currentQuestion.type_answer === 'multiple_choice' && currentQuestion.correct_answer.length < 2) {
            setError('Với câu hỏi nhiều đáp án, vui lòng chọn ít nhất 2 đáp án đúng');
            return false;
        }

        return true;
    };

    const addQuestion = () => {
        if (!validateQuestion()) return;

        setQuestions([...questions, { ...currentQuestion }]);

        // Reset current question form
        setCurrentQuestion({
            question: '',
            type_answer: 'one_choice',
            answers: [{ id: '1', text: '' }, { id: '2', text: '' }],
            correct_answer: [],
            image: null,
            imagePreview: undefined,
            index: questions.length + 1,
        });

        setError(null);
    };

    const updateQuestion = () => {
        if (!validateQuestion() || editIndex === null) return;

        const updatedQuestions = [...questions];
        updatedQuestions[editIndex] = { ...currentQuestion, index: editIndex + 1 };  // Giữ nguyên index

        setQuestions(updatedQuestions);
        setIsEditing(false);
        setEditIndex(null);

        setCurrentQuestion({
            index: questions.length + 1,
            question: '',
            type_answer: 'one_choice',
            answers: [{ id: '1', text: '' }, { id: '2', text: '' }],
            correct_answer: [],
            image: null,
            imagePreview: undefined
        });

        setError(null);
    };


    const editQuestion = (index: number) => {
        setCurrentQuestion({ ...questions[index] });
        setIsEditing(true);
        setEditIndex(index);
    };

    const deleteQuestion = (index: number) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);

        // Update indexes for remaining questions
        const reindexedQuestions = updatedQuestions.map((q, i) => ({
            ...q,
            index: i + 1
        }));

        setQuestions(reindexedQuestions);
    };

    const handleSubmit = async () => {
        if (questions.length === 0) {
            setError('Vui lòng thêm ít nhất một câu hỏi');
            return;
        }

        // Final validation check for all questions
        for (const question of questions) {
            if (question.type_answer === 'multiple_choice' && question.correct_answer.length < 2) {
                setError(`Câu hỏi "${question.question}" có loại nhiều đáp án nhưng chỉ có 1 đáp án đúng`);
                return;
            }
        }

        setIsSubmitting(true);
        try {
            for (const question of questions) {
                const formData = new FormData();
                formData.append('lesson_id', lessonId);
                formData.append('exercise_id', exerciseId);
                formData.append('index', question.index.toString());
                formData.append('question', question.question);
                formData.append('type', question.type_answer);

                // Chuyển đổi mảng answer objects thành mảng strings
                const answerTexts = question.answers.map(answer => answer.text);

                // Lấy các câu trả lời đúng dựa trên text thay vì ids
                const correctAnswerTexts = question.answers
                    .filter(answer => question.correct_answer.includes(answer.id))
                    .map(answer => answer.text);

                // Không sử dụng JSON.stringify nữa
                for (const answerText of answerTexts) {
                    formData.append('answers[]', answerText);
                }

                for (const correctAnswer of correctAnswerTexts) {
                    formData.append('correct_answer[]', correctAnswer);
                }

                if (question.image) {
                    formData.append('image', question.image);
                }

                await addQuiz(formData);
            }
            onComplete();
        } catch (err) {
            setError('Có lỗi xảy ra khi gửi câu hỏi');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button type="button" className={styles.backButton} onClick={handleBack}>
                    ← Quay lại
                </button>
                <h2 className={styles.title}>Tạo câu hỏi cho bài tập</h2>
            </div>

            <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Thông tin câu hỏi</h3>

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.formGroup}>
                    <label htmlFor="question" className={styles.label}>Câu hỏi:</label>
                    <textarea
                        id="question"
                        className={styles.textarea}
                        value={currentQuestion.question}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                        placeholder="Nhập câu hỏi của bạn"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Hình ảnh (không bắt buộc):</label>
                    <div className={styles.imageUploadContainer}>
                        <input
                            type="file"
                            id="imageUpload"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className={styles.imageInput}
                        />
                        <label htmlFor="imageUpload" className={styles.imageUploadButton}>
                            Chọn ảnh
                        </label>
                        {currentQuestion.imagePreview && (
                            <div className={styles.imagePreviewContainer}>
                                <img
                                    src={currentQuestion.imagePreview}
                                    alt="Preview"
                                    className={styles.imagePreview}
                                />
                                <button
                                    type="button"
                                    className={styles.removeImageButton}
                                    onClick={removeImage}
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Loại câu trả lời:</label>
                    <div className={styles.typeToggle}>
                        <button
                            type="button"
                            className={`${styles.typeButton} ${currentQuestion.type_answer === 'one_choice' ? styles.active : ''}`}
                            onClick={() => handleTypeChange('one_choice')}
                        >
                            Một đáp án
                        </button>
                        <button
                            type="button"
                            className={`${styles.typeButton} ${currentQuestion.type_answer === 'multiple_choice' ? styles.active : ''}`}
                            onClick={() => handleTypeChange('multiple_choice')}
                        >
                            Nhiều đáp án
                        </button>
                    </div>
                </div>

                <h3 className={styles.sectionTitle}>Danh sách câu trả lời</h3>
                {currentQuestion.type_answer === 'multiple_choice' && (
                    <div className={styles.typeHint}>
                        Lưu ý: Với câu hỏi nhiều đáp án, bạn phải chọn ít nhất 2 đáp án đúng
                    </div>
                )}
                {currentQuestion.answers.map((answer) => (
                    <div key={answer.id} className={styles.answerItem}>
                        <div className={styles.answerInput}>
                            <input
                                type={currentQuestion.type_answer === 'one_choice' ? 'radio' : 'checkbox'}
                                id={`answer-${answer.id}`}
                                name="correctAnswer"
                                checked={currentQuestion.correct_answer.includes(answer.id)}
                                onChange={() => handleCorrectAnswerChange(answer.id)}
                                className={styles.answerCheck}
                            />
                            <input
                                type="text"
                                value={answer.text}
                                onChange={(e) => handleAnswerChange(answer.id, e.target.value)}
                                placeholder="Nhập câu trả lời"
                                className={styles.answerText}
                            />
                        </div>
                        <button
                            type="button"
                            className={styles.removeButton}
                            onClick={() => removeAnswer(answer.id)}
                        >
                            ×
                        </button>
                    </div>
                ))}

                <button type="button" className={styles.addButton} onClick={addAnswer}>
                    + Thêm câu trả lời
                </button>

                <div className={styles.questionActions}>
                    {isEditing ? (
                        <button type="button" className={styles.saveButton} onClick={updateQuestion}>
                            Cập nhật câu hỏi
                        </button>
                    ) : (
                        <button type="button" className={styles.saveButton} onClick={addQuestion}>
                            Thêm vào danh sách
                        </button>
                    )}
                </div>
            </div>

            {questions.length > 0 && (
                <div className={styles.questionsListSection}>
                    <h3 className={styles.sectionTitle}>Danh sách câu hỏi đã tạo ({questions.length})</h3>

                    <div className={styles.questionsList}>
                        {questions.map((q, index) => (
                            <div key={index} className={styles.questionListItem}>
                                <div className={styles.questionInfo}>
                                    <h4 className={styles.questionText}>{q.question}</h4>
                                    {q.imagePreview && (
                                        <div className={styles.thumbnailContainer}>
                                            <img
                                                src={q.imagePreview}
                                                alt="Question image"
                                                className={styles.thumbnail}
                                            />
                                        </div>
                                    )}
                                    <p className={styles.questionMeta}>
                                        {q.type_answer === 'one_choice' ? 'Một đáp án' : 'Nhiều đáp án'} -
                                        {q.answers.length} câu trả lời
                                    </p>
                                </div>
                                <div className={styles.questionActions}>
                                    <button
                                        type="button"
                                        className={styles.editButton}
                                        onClick={() => editQuestion(index)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.deleteButton}
                                        onClick={() => deleteQuestion(index)}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={onCancel}>
                    Hủy
                </button>
                <button
                    type="button"
                    className={styles.submitButton}
                    onClick={handleSubmit}
                    disabled={questions.length === 0 || isSubmitting}
                >
                    {isSubmitting ? 'Đang gửi...' : 'Gửi tất cả câu hỏi'}
                </button>
            </div>
        </div>
    );
};

export default QuestionForm;