// ProjectList.tsx
import React, { useEffect, useState } from 'react'
import styles from './ProjectList.module.css';
import { getListProjectsByUser } from '../../../services/project.ts'
import { useSelector } from 'react-redux'
import { Project } from '../../../model/model.ts'

// type Project = {
//     id: number;
//     name: string;
//     image: string;
//     time: string;
// };

// const projects: Project[] = [
//     { id: 1, name: "Arduino MIDI controller", image: "https://i.pinimg.com/736x/9c/ec/0f/9cec0fd47ca37616889858eaab0e196d.jpg", time: "3 months ago" },
//     { id: 2, name: "LED strip music visualizer", image: "https://i.pinimg.com/736x/9c/ec/0f/9cec0fd47ca37616889858eaab0e196d.jpg", time: "1 year ago" },
//     { id: 3, name: "ESP32 weather station", image: "https://i.pinimg.com/736x/9c/ec/0f/9cec0fd47ca37616889858eaab0e196d.jpg", time: "2 years ago" },
// ];

const ProjectList: React.FC = () => {
    const user = useSelector((state: any) => state.auth)
    console.log(user)
    const [projects, setProjects] = useState<Project[]>([])

    useEffect(() => {
        const fetchProjects = async () => {
            const data = await getListProjectsByUser(user._id);
            setProjects(data.data);
        };

        fetchProjects();
    }, []);

    return (
        <div className={styles.projectList}>
            <h2 className={styles.title}>Projects</h2>
            <div className={styles.grid}>
                {projects.map((project) => (
                    <div className={styles.card} key={project._id}>
                        <img src={project.images[0]} alt={project.name} className={styles.image} />
                        <h3 className={styles.name}>{project.name}</h3>
                        <p className={styles.time}>{project.createdAt}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectList;
