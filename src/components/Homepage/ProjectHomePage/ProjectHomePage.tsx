// src/components/Homepage/ProjectList/ProjectList.tsx
import React, { useEffect, useState } from 'react';
import { Row, Col, Spin } from 'antd';
import styles from './ProjectList.module.css';
import { getProjectByType } from '../../../services/project.ts'
import { Project } from '../../../model/model.ts'
import ProjectItem from '../../Project/ProjectItem.tsx'

const ProjectListHomePage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getProjects = async () => {
        try {
            const response = await getProjectByType('DEFAULT');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProjects();
    }, []);

    if (loading) {
        return <Spin />;
    }

    return (
        <div className={styles.projectListContainer}>
            <Row gutter={[16, 16]} wrap={false}>
                {projects.map((project) => (
                    <Col key={project._id} flex="0 0 25%">
                        <ProjectItem item={project} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ProjectListHomePage;
