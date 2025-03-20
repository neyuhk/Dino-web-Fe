import React from 'react';
import ExerciseForm from './ExerciseForm';
import { useParams } from 'react-router-dom'

const ExamplePage: React.FC = () => {
    const { lessonId } = useParams<{ lessonId: string }>();

    const handleExerciseCreated = () => {
        console.log("Exercise was created successfully!");
        // Here you could refresh data, navigate, etc.
    };

    return (
        <div style={{ padding: '20px' , height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {/*<h1 style={{*/}
            {/*    fontFamily: 'var(--font-primary)',*/}
            {/*    color: 'var(--text-color)',*/}
            {/*    marginBottom: '20px'*/}
            {/*}}>*/}
            {/*    Lesson Management*/}
            {/*</h1>*/}

            <ExerciseForm
                lessonId={lessonId? lessonId : ''}
                onSuccess={handleExerciseCreated}
            />
        </div>
    );
};

export default ExamplePage;