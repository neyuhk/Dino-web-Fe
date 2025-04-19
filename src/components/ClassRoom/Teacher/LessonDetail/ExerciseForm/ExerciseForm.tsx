import React, { useState, useEffect } from 'react';
import styles from './ExerciseForm.module.css';
import { newExercise } from '../../../../../services/lesson.ts';
import Toast, { ToastMessage } from '../../../../commons/Toast/Toast.tsx';
import QuestionForm from '../QuestionForm/QuestionForm.tsx';
import { useNavigate } from 'react-router-dom';
import { FaLayerGroup } from 'react-icons/fa';
import { Exercise } from '../../../../../model/classroom.ts';
import { editExercise } from '../../../../../services/exercise.ts'

interface ExerciseFormProps {
    lessonId: string;
    onSuccess?: (updatedExercise?: Exercise) => void;
    exerciseData?: Exercise;
    isEditing?: boolean;
}

type ExerciseType = 'quiz' | 'test' | 'file';

interface FormData {
    lesson_id: string;
    type: ExerciseType;
    title: string;
    description: string;
    time: number;
    timeUnit: 'seconds' | 'minutes' | 'hours';
    end_date: string | 'unlimited';
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({
                                                       lessonId,
                                                       onSuccess,
                                                       exerciseData,
                                                       isEditing = false
                                                   }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [exerciseId, setExerciseId] = useState<string | null>(null);
    const navigate = useNavigate();
    const [toast, setToast] = useState<ToastMessage>({
        show: false,
        type: 'info',
        title: '',
        message: ''
    });

    const [formData, setFormData] = useState<FormData>({
        lesson_id: lessonId,
        type: 'quiz',
        title: '',
        description: '',
        time: 30,
        timeUnit: 'minutes',
        end_date: 'unlimited',
    });

    useEffect(() => {
        if (isEditing && exerciseData) {
            let time = exerciseData.time;
            let timeUnit: 'seconds' | 'minutes' | 'hours' = 'seconds';

            if (time % 3600 === 0) {
                time = time / 3600;
                timeUnit = 'hours';
            } else if (time % 60 === 0) {
                time = time / 60;
                timeUnit = 'minutes';
            }

            setFormData({
                lesson_id: lessonId,
                type: exerciseData.type as ExerciseType,
                title: exerciseData.title || '',
                description: exerciseData.description || '',
                time: time,
                timeUnit: timeUnit,
                end_date: exerciseData.end_date ? new Date(exerciseData.end_date).toISOString().split('T')[0] : 'unlimited',
            });

            setExerciseId(exerciseData._id);
        } else {
            // Si no estamos editando, solo actualizamos el lesson_id
            setFormData(prev => ({ ...prev, lesson_id: lessonId }));
        }
    }, [lessonId, exerciseData, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value || 'unlimited';
        setFormData(prev => ({ ...prev, end_date: value }));
    };

    const hideToast = () => {
        setToast(prev => ({ ...prev, show: false }));
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Convert time based on selected unit to seconds
            let timeInSeconds = formData.type === 'file' ? 0 : formData.time;
            switch (formData.timeUnit) {
                case 'minutes':
                    timeInSeconds = formData.time * 60;
                    break;
                case 'hours':
                    timeInSeconds = formData.time * 60 * 60;
                    break;
            }

            // Prepare the end date
            const end_date = formData.end_date === 'unlimited' ? null : new Date(formData.end_date);

            // Prepare the payload
            const payload = {
                lesson_id: formData.lesson_id,
                type: formData.type,
                title: formData.title,
                description: formData.description,
                time: timeInSeconds, // Always in seconds
                end_date: end_date,
            };

            let response;

            if (isEditing && exerciseId) {
                response = await editExercise(exerciseId, payload);

                // Tạo object exercise đã cập nhật
                const updatedExercise = {
                    ...exerciseData,
                    ...payload,
                    _id: exerciseId,
                };

                // Hiển thị thông báo thành công
                setToast({
                    show: true,
                    type: 'success',
                    title: 'Thành công',
                    message: 'Cập nhật bài tập thành công!'
                });

                if (onSuccess) { // @ts-ignore
                    onSuccess(updatedExercise);
                }
            }  else {
                response = await newExercise(payload);
                const newExerciseId = response.data._id;
                setExerciseId(newExerciseId);

                setToast({
                    show: true,
                    type: 'success',
                    title: 'Thành công',
                    message: 'Tạo bài tập thành công. Bây giờ hãy thêm các câu hỏi.'
                });

                if (formData.type === 'quiz' || formData.type === 'test') {
                    setShowQuestionForm(true);
                } else {
                    if (onSuccess) onSuccess();
                }
            }
        } catch (error) {
            setToast({
                show: true,
                type: 'error',
                title: 'Lỗi',
                message: isEditing
                    ? 'Cập nhật bài tập không thành công. Hãy thử lại sau.'
                    : 'Tạo bài tập không thành công. Hãy thử lại sau.'
            });
            console.error(isEditing ? 'Error updating exercise:' : 'Error creating exercise:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClone = () => {
        setToast({
            show: true,
            type: 'info',
            title: 'Thông báo',
            message: 'Tính năng sao chép hiện đang được phát triển. Hãy thử lại sau!'
        });
    };

    const getTimeUnitHelp = () => {
        switch (formData.type) {
            case 'quiz':
                return 'Bài trắc nghiệm thường mất vài giây đến vài phút để hoàn thành.';
            case 'test':
                return 'Bài kiểm tra thường kéo dài từ 30 phút đến vài giờ.';
            case 'file':
                return 'Đặt thời hạn nộp bài tính bằng ngày cho việc tải tệp lên.';
            default:
                return '';
        }
    };

    const handleQuestionFormComplete = () => {
        // Reset everything
        setShowQuestionForm(false);

        if (!isEditing) {
            setExerciseId(null);
            setFormData({
                lesson_id: lessonId,
                type: 'quiz',
                title: '',
                description: '',
                time: 30,
                timeUnit: 'minutes',
                end_date: 'unlimited',
            });
        }

        setToast({
            show: true,
            type: 'success',
            title: 'Thành công',
            message: 'Bài tập và câu hỏi đã được tạo thành công!'
        });

        if (onSuccess) onSuccess();
    };

    if (showQuestionForm && exerciseId) {
        return (
            <QuestionForm
                lessonId={lessonId}
                exerciseId={exerciseId}
                exerciseType={formData.type}
                onComplete={handleQuestionFormComplete}
                onCancel={() => {
                    setShowQuestionForm(false);
                    if (!isEditing) {
                        setExerciseId(null);
                    }
                }}
            />
        );
    }

    return (
        <div className={styles.formContainer}>
            {!isEditing && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                    }}
                >
                    <button
                        type="button"
                        className="backButton"
                        onClick={handleBack}
                    >
                        ← Quay lại
                    </button>
                    <h2 className={styles.titleGradient}>Tạo bài tập mới</h2>
                    <button
                        type="button"
                        className={styles.cloneButton}
                        onClick={handleClone}
                    >
                        <FaLayerGroup />
                        <span>Sao chép từ bài tập trước</span>
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="type">Loại bài tập</label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className={styles.select}
                    >
                        <option value="quiz">Trắc nghiệm</option>
                        <option value="test">Kiểm tra</option>
                        <option value="file">Nộp tệp</option>
                    </select>
                    <small className={styles.helpText}>
                        {formData.type === 'quiz' &&
                            'Câu hỏi trắc nghiệm với chấm điểm tự động'}
                        {formData.type === 'test' &&
                            'Đánh giá toàn diện với nhiều loại câu hỏi khác nhau'}
                        {formData.type === 'file' &&
                            'Học viên tải lên tài liệu, bài thuyết trình, hoặc dự án'}
                    </small>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="title">Tiêu đề</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        placeholder="VD: Bài kiểm tra Chương 5, Dự án Cuối kỳ"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="description">Mô tả</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className={styles.textarea}
                        placeholder="Cung cấp hướng dẫn và chi tiết về bài tập"
                    />
                </div>

                <div className={styles.timeSection}>
                    {formData.type !== 'file' && (
                        <div className={styles.formGroup}>
                            <label htmlFor="time">Thời gian làm bài</label>
                            <div className={styles.timeInputGroup}>
                                <input
                                    type="number"
                                    id="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                    className={styles.timeInput}
                                />
                                <select
                                    name="timeUnit"
                                    value={formData.timeUnit}
                                    onChange={handleChange}
                                    className={styles.timeUnitSelect}
                                >
                                    <option value="seconds">Giây</option>
                                    <option value="minutes">Phút</option>
                                    <option value="hours">Giờ</option>
                                </select>
                            </div>
                            <small className={styles.helpText}>
                                {getTimeUnitHelp()}
                            </small>
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="end_date">Ngày kết thúc</label>
                        <div className={styles.endDateContainer}>
                            <input
                                type="date"
                                id="end_date"
                                name="end_date"
                                value={
                                    formData.end_date !== 'unlimited'
                                        ? formData.end_date
                                        : ''
                                }
                                onChange={handleDateChange}
                                className={styles.dateInput}
                                min={new Date().toISOString().split('T')[0]}
                            />
                            <div className={styles.unlimitedContainer}>
                                <input
                                    type="checkbox"
                                    id="unlimited"
                                    checked={formData.end_date === 'unlimited'}
                                    onChange={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            end_date:
                                                prev.end_date === 'unlimited'
                                                    ? ''
                                                    : 'unlimited',
                                        }))
                                    }
                                    className={styles.checkbox}
                                />
                                <label
                                    htmlFor="unlimited"
                                    className={styles.checkboxLabel}
                                >
                                    Không giới hạn
                                </label>
                            </div>
                        </div>
                        <small className={styles.helpText}>
                            {formData.end_date === 'unlimited'
                                ? 'Không có thời hạn - học viên có thể nộp bất kỳ lúc nào'
                                : 'Sau ngày này, bài nộp sẽ không được chấp nhận'}
                        </small>
                    </div>
                </div>

                <div className={styles.buttonGroup}>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? (isEditing ? 'Đang cập nhật...' : 'Đang tạo...')
                            : (isEditing ? 'Cập nhật bài tập' : 'Tạo bài tập')
                        }
                    </button>
                </div>
            </form>

            {toast.show && <Toast toast={toast} onClose={hideToast} type={''} />}
        </div>
    );
};

export default ExerciseForm;
