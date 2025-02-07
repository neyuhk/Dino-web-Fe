import React, { useState } from 'react';
import styles from './SubmitAssignment.module.css';

const SubmitAssignment = () => {
    const [file, setFile] = useState<File | null>(null);
    const [notes, setNotes] = useState('');

    return (
        <section className={styles.submitSection}>
            <h2>Nộp bài tập</h2>
            <form className={styles.submitForm}>
                <div className={styles.fileUpload}>
                    <label>Chọn file (.ino, .pdf):</label>
                    <input
                        type="file"
                        accept=".ino,.pdf"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                </div>
                <div className={styles.notes}>
                    <label>Ghi chú:</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Nhập ghi chú nếu cần..."
                    />
                </div>
                <button type="submit" className={styles.submitButton}>Nộp bài</button>
            </form>
        </section>
    );
};

export default SubmitAssignment;
