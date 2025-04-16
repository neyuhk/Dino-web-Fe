import React, { useEffect, useState } from 'react'
import styles from './CourseScore.module.css' // Add your CSS styles here
import { getScoreForCourse } from '../../../../services/score.ts'

interface Props {
    courseId: string;
}

const CourseScore: React.FC<Props> = ({ courseId }) => {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchScores = async () => {
            try {
                setLoading(true)
                const response = await getScoreForCourse(courseId)
                const lessons = response.data.lessons
                console.log('Fetched lessons:', lessons)

                const transformedData = lessons.flatMap((lesson: any) =>
                    lesson.exercises.flatMap((exercise: any) =>
                        exercise.member.map((member: any) => ({
                            lessonTitle: lesson.title,
                            exerciseTitle: exercise.title,
                            username: member.username,
                            userAvatar: member.avatar || 'https://i.pinimg.com/474x/0b/10/23/0b10236ae55b58dceaef6a1d392e1d15.jpg',
                            score: member.score,
                            status: member.score !== null ? 'Completed' : 'Not Completed',
                        })),
                    ),
                )

                setData(transformedData)
            } catch (err) {
                setError('Failed to fetch scores')
            } finally {
                setLoading(false)
            }
        }

        fetchScores()
    }, [courseId])

    if (loading) return <p>Loading...</p>
    if (error) return <p>{error}</p>

    return (
        <div className={styles.container}>
            <h2>Course Scores</h2>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Lesson Title</th>
                    <th>Exercise Title</th>
                    <th>Score</th>
                    <th>User</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {(() => {
                    let lastLessonTitle = ''
                    let lastExerciseTitle = ''
                    return data.map((row, index) => {
                        const showLessonTitle = row.lessonTitle !== lastLessonTitle
                        const showExerciseTitle = row.exerciseTitle !== lastExerciseTitle

                        if (showLessonTitle) lastLessonTitle = row.lessonTitle
                        if (showExerciseTitle) lastExerciseTitle = row.exerciseTitle

                        return (
                            <tr key={index}>
                                <td>{showLessonTitle ? row.lessonTitle : ''}</td>
                                <td>{showExerciseTitle ? row.exerciseTitle : ''}</td>
                                <td>{row.score}</td>
                                <td>
                                    <div className={styles.userCell}>
                                        <img
                                            src={row.userAvatar}
                                            alt={row.username}
                                            className={styles.avatar}
                                        />
                                        <span>{row.username}</span>
                                    </div>
                                </td>
                                <td>{row.status}</td>
                            </tr>
                        )
                    })
                })()}
                </tbody>
            </table>
        </div>
    )
}

export default CourseScore
