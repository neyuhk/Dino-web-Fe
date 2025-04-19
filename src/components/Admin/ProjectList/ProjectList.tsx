// import React, { useEffect, useState } from 'react';
// import { List, Pagination } from 'antd';
// @ts-ignore
import ProjectItem from '../../Project/ProjectItem.tsx';
import styles from './ProjectList.module.css';
import { getProjects } from '../../../services/project.ts';
import { Project } from '../../../model/model.ts';

import { useEffect, useState } from 'react'
import { List, Pagination } from 'antd'

const ProjectList: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchProjects = async () => {
            const data = await getProjects(page, perPage, '', '');
            setProjects(data.data);
            setTotal(data.total);
        };

        fetchProjects();
    }, [page, perPage]);

    const handlePageChange = (page: number, pageSize: number) => {
        setPage(page);
        setPerPage(pageSize);
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <List
                    grid={{ gutter: 16, column: 4 }}
                    dataSource={projects}
                    renderItem={item => (
                        <List.Item>
                            <ProjectItem item={item} />
                        </List.Item>
                    )}
                />
                <Pagination
                    align="end"
                    current={page}
                    pageSize={perPage}
                    total={total}
                    onChange={handlePageChange}
                    showSizeChanger
                />
            </div>
        </section>
    );
};

export default ProjectList;
