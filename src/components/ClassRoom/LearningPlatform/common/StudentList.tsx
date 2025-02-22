import styles from '../common/styles/StudentList.module.css';
import { User } from '../../../../model/model.ts'
const StudentList = ({ students }: { students: User[] }) => {
    return (
        <div className={styles.studentsContainer}>
            <h2>Class Students</h2>
            <div className={styles.studentGrid}>
                {students.map((student, index) => (
                    <div key={index} className={styles.studentCard}>
                        <img
                            src={student.avatar[0]}
                            alt={student.username}
                            className={styles.studentAvatar}
                        />
                        <p>{student.username}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default StudentList;