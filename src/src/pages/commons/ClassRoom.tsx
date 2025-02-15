
import styles from '../../pages/commons/styles/ClassRoom.module.css';
import LearningPlatform from '../../components/ClassRoom/LearningPlatform/LearningPlatform.tsx'
const ClassroomPage = () => {
    return (
        <div className={styles.container}>
            <LearningPlatform></LearningPlatform>
        </div>
    );
};

export default ClassroomPage;
