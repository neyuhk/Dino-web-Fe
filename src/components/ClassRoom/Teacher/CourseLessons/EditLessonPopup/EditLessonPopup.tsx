import React, { useState, useEffect, useRef } from 'react';
import styles from './EditLessonPopup.module.css';
import { FaTimes, FaUpload, FaTrash, FaSave, FaYoutube } from 'react-icons/fa';
import { editLesson } from '../../../../../services/lesson.ts'
import { Lesson } from '../../../../../model/classroom.ts'

interface EditLessonPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    lessonId: string;
    lesson: Lesson;
}

const EditLessonPopup: React.FC<EditLessonPopupProps> = ({
                                                             isOpen,
                                                             onClose,
                                                             onSuccess,
                                                             lessonId,
                                                             lesson
                                                         }) => {
    const [title, setTitle] = useState<string>(lesson?.title || '');
    const [description, setDescription] = useState<string>(lesson?.description || '');
    const [videoUrl, setVideoUrl] = useState<string>(lesson?.video_url || '');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        lesson?.images && lesson?.images.length > 0 ? lesson.images[0] : null
    );
    const [body, setBody] = useState<string>(lesson?.body || '');
    const [status, setStatus] = useState<string>(lesson?.status || 'active');
    const [isDeleteImg, setIsDeleteImg] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState<string>('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Convert YouTube URL to embed URL
    useEffect(() => {
        if (videoUrl) {
            const embedUrl = convertToEmbedUrl(videoUrl);
            setYoutubeEmbedUrl(embedUrl);
        }
    }, [videoUrl]);

    const convertToEmbedUrl = (url: string): string => {
        // Handle different YouTube URL formats
        let videoId = '';
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(youtubeRegex);

        if (match && match[1]) {
            videoId = match[1];
            return `https://www.youtube.com/embed/${videoId}`;
        }

        // If it's already an embed URL or doesn't match YouTube format, return as is
        return url;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setIsDeleteImg(false);

            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
        setIsDeleteImg(true);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError('');

            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('videoUrl', videoUrl);
            formData.append('body', body);
            formData.append('status', status);
            formData.append('isDeleteImg', isDeleteImg ? 'true' : 'false');

            if (image) {
                formData.append('images', image);
            }

            console.log('edit lesson',formData.values());
            await editLesson(lessonId, formData);
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error updating lesson:', err);
            setError('Có lỗi xảy ra khi cập nhật bài học. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer} ref={modalRef}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Chỉnh sửa bài học</h2>
                    <div className={styles.closeButton} onClick={onClose}>
                        <FaTimes />
                    </div>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formContent}>
                        <div className={styles.formColumn}>
                            <div className={styles.formGroup}>
                                <label htmlFor="title" className={styles.label}>Tiêu đề</label>
                                <input
                                    type="text"
                                    id="title"
                                    className={styles.input}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="description" className={styles.label}>Mô tả</label>
                                <textarea
                                    id="description"
                                    className={styles.textarea}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="video" className={styles.label}>Video URL (YouTube)</label>
                                <div className={styles.videoInputContainer}>
                                    <input
                                        type="text"
                                        id="video"
                                        className={styles.input}
                                        value={videoUrl}
                                        onChange={(e) => setVideoUrl(e.target.value)}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                    <FaYoutube className={styles.youtubeIcon} />
                                </div>
                            </div>

                            {youtubeEmbedUrl && (
                                <div className={styles.videoPreview}>
                                    <iframe
                                        width="100%"
                                        height="200"
                                        src={youtubeEmbedUrl}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}

                            <div className={styles.formGroup}>
                                <label htmlFor="body" className={styles.label}>Nội dung</label>
                                <textarea
                                    id="body"
                                    className={styles.textarea}
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    rows={6}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="status" className={styles.label}>Trạng thái</label>
                                <select
                                    id="status"
                                    className={styles.select}
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="active">Hoạt động</option>
                                    <option value="inactive">Không hoạt động</option>
                                    <option value="draft">Bản nháp</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.formColumn}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Hình ảnh bài học</label>
                                <div className={styles.imageUpload}>
                                    {imagePreview ? (
                                        <div className={styles.imagePreviewContainer}>
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className={styles.imagePreview}
                                            />
                                            <button
                                                type="button"
                                                className={styles.removeImageButton}
                                                onClick={handleRemoveImage}
                                            >
                                                <FaTrash /> Xóa ảnh
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={styles.uploadArea}>
                                            <input
                                                type="file"
                                                id="image"
                                                ref={fileInputRef}
                                                className={styles.fileInput}
                                                onChange={handleImageChange}
                                                accept="image/*"
                                            />
                                            <label htmlFor="image" className={styles.uploadButton}>
                                                <FaUpload /> Tải ảnh lên
                                            </label>
                                            <p className={styles.uploadHint}>
                                                Hỗ trợ JPG, PNG, WEBP (tối đa 5MB)
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && <div className={styles.errorMessage}>{error}</div>}

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={onClose}
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Đang cập nhật...' : (
                                <>
                                    <FaSave /> Lưu thay đổi
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditLessonPopup;