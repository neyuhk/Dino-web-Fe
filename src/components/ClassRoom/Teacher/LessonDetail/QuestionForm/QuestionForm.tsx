import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './QuestionForm.module.css';
import { addQuiz } from '../../../../../services/lesson.ts';
import { importQuizExcel } from '../../../../../services/exercise.ts'
import fileMau from '../../../../../assets/mau_import_exercise.xlsx'

type AnswerType = 'multiple_choice' | 'one_choice';

interface Question {
    question: string;
    type_answer: AnswerType;
    answers: string[];
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
        answers: ['', ''],
        correct_answer: [],
        image: null,
        imagePreview: undefined,
        index: 1,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [excelFileName, setExcelFileName] = useState<string>('');

    const addAnswer = () => {
        setCurrentQuestion({
            ...currentQuestion,
            answers: [...currentQuestion.answers, '']
        });
    };

    const removeAnswer = (index: number) => {
        if (currentQuestion.answers.length <= 2) {
            setError('Phải có ít nhất 2 câu trả lời');
            return;
        }

        const updatedAnswers = currentQuestion.answers.filter((_, i) => i !== index);
        const updatedCorrectAnswers = currentQuestion.correct_answer.filter(
            answer => !currentQuestion.answers[index].includes(answer)
        );

        setCurrentQuestion({
            ...currentQuestion,
            answers: updatedAnswers,
            correct_answer: updatedCorrectAnswers
        });

        setError(null);
    };

    const handleAnswerChange = (index: number, text: string) => {
        const updatedAnswers = [...currentQuestion.answers];
        updatedAnswers[index] = text;

        setCurrentQuestion({
            ...currentQuestion,
            answers: updatedAnswers
        });
    };

    const handleCorrectAnswerChange = (answer: string) => {
        let updatedCorrectAnswers: string[];

        if (currentQuestion.type_answer === 'one_choice') {
            updatedCorrectAnswers = [answer];
        } else {
            if (currentQuestion.correct_answer.includes(answer)) {
                updatedCorrectAnswers = currentQuestion.correct_answer.filter(a => a !== answer);
            } else {
                updatedCorrectAnswers = [...currentQuestion.correct_answer, answer];
            }
        }

        setCurrentQuestion({
            ...currentQuestion,
            correct_answer: updatedCorrectAnswers
        });
    };

    const handleTypeChange = (type: AnswerType) => {
        let updatedCorrectAnswers = currentQuestion.correct_answer;

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

    const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setExcelFile(file);
            setExcelFileName(file.name);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('exercise_id', exerciseId);

            try {
                const importedQuestions = await importQuizExcel(formData);
                setQuestions(importedQuestions.data);
                setError(null);
            } catch (err) {
                setError('Lỗi khi import file Excel');
                console.error(err);
            }
        }
    };

    const removeExcelFile = () => {
        setExcelFile(null);
        setExcelFileName('');
        setQuestions([]);
    };

    const validateQuestion = (): boolean => {
        if (!currentQuestion.question.trim()) {
            setError('Vui lòng nhập câu hỏi');
            return false;
        }

        if (currentQuestion.answers.some(answer => !answer.trim())) {
            setError('Tất cả các câu trả lời phải có nội dung');
            return false;
        }

        if (currentQuestion.correct_answer.length === 0) {
            setError('Vui lòng chọn ít nhất một câu trả lời đúng');
            return false;
        }

        if (currentQuestion.type_answer === 'multiple_choice' && currentQuestion.correct_answer.length < 2) {
            setError('Với câu hỏi nhiều đáp án, vui lòng chọn ít nhất 2 đáp án đúng');
            return false;
        }

        return true;
    };

    const addQuestion = () => {
        if (!validateQuestion()) return;

        setQuestions([...questions, { ...currentQuestion }]);

        setCurrentQuestion({
            question: '',
            type_answer: 'one_choice',
            answers: ['', ''],
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
        updatedQuestions[editIndex] = { ...currentQuestion, index: editIndex + 1 };

        setQuestions(updatedQuestions);
        setIsEditing(false);
        setEditIndex(null);

        setCurrentQuestion({
            index: questions.length + 1,
            question: '',
            type_answer: 'one_choice',
            answers: ['', ''],
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

        setIsSubmitting(true);
        try {
            for (const question of questions) {
                const formData = new FormData();
                formData.append('lesson_id', lessonId);
                formData.append('exercise_id', exerciseId);
                formData.append('index', question.index.toString());
                formData.append('question', question.question);
                formData.append('type', question.type_answer);

                for (const answer of question.answers) {
                    formData.append('answers[]', answer);
                }

                for (const correctAnswer of question.correct_answer) {
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

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button type="button" className={styles.backButton} onClick={() => navigate(-1)}>
                    ← Quay lại
                </button>
                <h2 className={`${styles.title} title-gradian`}>Tạo câu hỏi cho bài tập</h2>
            </div>

            <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Import câu hỏi từ Excel</h3>
                <div className={styles.formGroup}>
                    <input
                        type="file"
                        id="excelUpload"
                        accept=".xlsx,.xls"
                        onChange={handleExcelUpload}
                        className={styles.imageInput}
                    />
                    <label htmlFor="excelUpload" className={styles.imageUploadButton}>
                        Chọn file Excel
                    </label>
                    {/*<a*/}
                    {/*    href={fileMau}*/}
                    {/*    download="sample.xlsx"*/}
                    {/*    className={styles.downloadButton}*/}
                    {/*>*/}
                    {/*    Tải file mẫu*/}
                    {/*</a>*/}
                    {excelFileName && (
                        <div className={styles.imagePreviewContainer}>
                            <span style={{color: 'black'}} >File: {excelFileName}</span>
                            <button
                                type="button"
                                className={styles.removeImageButton}
                                onClick={removeExcelFile}
                            >
                                ×
                            </button>
                        </div>
                    )}
                </div>

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
                {currentQuestion.answers.map((answer, index) => (
                    <div key={index} className={styles.answerItem}>
                        <div className={styles.answerInput}>
                            <input
                                type={currentQuestion.type_answer === 'one_choice' ? 'radio' : 'checkbox'}
                                id={`answer-${index}`}
                                name="correctAnswer"
                                checked={currentQuestion.correct_answer.includes(answer)}
                                onChange={() => handleCorrectAnswerChange(answer)}
                                className={styles.answerCheck}
                            />
                            <input
                                type="text"
                                value={answer}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                placeholder="Nhập câu trả lời"
                                className={styles.answerText}
                            />
                        </div>
                        <button
                            type="button"
                            className={styles.removeButton}
                            onClick={() => removeAnswer(index)}
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
                                        {q.type_answer === 'one_choice' ? 'Một đáp án' : 'Nhiều đáp án'} - {q.answers.length} câu trả lời
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
