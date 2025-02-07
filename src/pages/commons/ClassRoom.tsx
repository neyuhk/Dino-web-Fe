
import styles from '../../pages/commons/styles/ClassRoom.module.css';
import Header from '../../components/ClassRoom/ClassroomNav/ClassroomNavBar.tsx'
import LectureList from '../../components/ClassRoom/LectureList/LectureList.tsx'
import Exercise from '../../components/ClassRoom/Exercise/Exercise.tsx'
import SubmitAssignment from '../../components/ClassRoom/SubmitAssignment/SubmitAssignment.tsx'
import Grades from '../../components/ClassRoom/Grades/Grades.tsx'
import Footer from '../../components/ClassRoom/Footer/Footer.tsx'
import LearningPlatform from '../../components/ClassRoom/LearningPlatform/LearningPlatform.tsx'
const ClassroomPage = () => {
    return (
        <div className={styles.container}>
            <LearningPlatform></LearningPlatform>
        </div>
    );
};

export default ClassroomPage;
