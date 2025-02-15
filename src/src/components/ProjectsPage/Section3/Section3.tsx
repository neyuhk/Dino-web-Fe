import React, { useEffect, useState } from 'react'
import { Heart, Bookmark, Download } from 'lucide-react';
import styles from './Section3.module.css';
import { Project } from '../../../model/model.ts'
import { getProjects } from '../../../services/project.ts'

// interface Project {
//     id: number;
//     title: string;
//     author: string;
//     description: string;
//     image: string;
//     likes: number;
//     saves: number;
//     downloads: number;
// }

interface Section3Props {
    searchQuery: string;
}

const Section3: React.FC<Section3Props> = ({ searchQuery }) => {
    // const [projects, setProjects] = React.useState<Project[]>([
    //     {
    //         id: 1,
    //         title: "Thiết Kế Bảng Điều Khiển Hiện Đại",
    //         author: "Nguyễn Văn E",
    //         description: "Một bảng điều khiển hiện đại với hỗ trợ chế độ tối và bố cục linh hoạt trên mọi thiết bị.",
    //         image: "src/components/ProjectsPage/Section3/image/1.jpg",
    //         likes: 150,
    //         saves: 45,
    //         downloads: 89
    //     },
    //     {
    //         id: 2,
    //         title: "Điều Khiển LED Bằng Arduino",
    //         author: "Nguyễn Văn B",
    //         description: "Hướng dẫn lập trình Arduino để điều khiển LED với các hiệu ứng ánh sáng đa dạng.",
    //         image: "src/components/ProjectsPage/Section3/image/2.jpg",
    //         likes: 120,
    //         saves: 40,
    //         downloads: 75
    //     },
    //     {
    //         id: 3,
    //         title: "Giám Sát Nhiệt Độ Bằng Cảm Biến",
    //         author: "Trần Thị C",
    //         description: "Dự án sử dụng Arduino và cảm biến nhiệt độ để giám sát và hiển thị dữ liệu trên màn hình LCD.",
    //         image: "src/components/ProjectsPage/Section3/image/3.jpg",
    //         likes: 180,
    //         saves: 55,
    //         downloads: 95
    //     },
    //     {
    //         id: 4,
    //         title: "Xe Tự Hành Dùng Arduino",
    //         author: "Lê Văn D",
    //         description: "Xây dựng xe tự hành sử dụng Arduino để phát hiện và tránh chướng ngại vật.",
    //         image: "src/components/ProjectsPage/Section3/image/4.jpg",
    //         likes: 250,
    //         saves: 80,
    //         downloads: 130
    //     },
    //     {
    //         id: 5,
    //         title: "Hệ Thống Tưới Cây Tự Động",
    //         author: "Phạm Thị F",
    //         description: "Tạo hệ thống tưới cây tự động dựa trên cảm biến độ ẩm và Arduino.",
    //         image: "src/components/ProjectsPage/Section3/image/5.jpg",
    //         likes: 300,
    //         saves: 100,
    //         downloads: 150
    //     },
    //     {
    //         id: 6,
    //         title: "Đo Nồng Độ Khí Bằng Arduino",
    //         author: "Hoàng Văn G",
    //         description: "Dự án sử dụng cảm biến khí và Arduino để đo và hiển thị nồng độ khí độc.",
    //         image: "src/components/ProjectsPage/Section3/image/1.jpg",
    //         likes: 220,
    //         saves: 70,
    //         downloads: 110
    //     },
    //     {
    //         id: 7,
    //         title: "Hệ Thống Báo Động Chống Trộm",
    //         author: "Vũ Thị H",
    //         description: "Xây dựng hệ thống báo động chống trộm sử dụng cảm biến hồng ngoại và Arduino.",
    //         image: "/projects/arduino-alarm.jpg",
    //         likes: 270,
    //         saves: 90,
    //         downloads: 140
    //     },
    //     {
    //         id: 8,
    //         title: "Mô Phỏng Đèn Giao Thông",
    //         author: "Trịnh Văn I",
    //         description: "Lập trình mô phỏng hệ thống đèn giao thông với Arduino và LED RGB.",
    //         image: "/projects/arduino-traffic.jpg",
    //         likes: 190,
    //         saves: 60,
    //         downloads: 100
    //     },
    //     {
    //         id: 9,
    //         title: "Máy Đo Khoảng Cách Siêu Âm",
    //         author: "Ngô Thị J",
    //         description: "Sử dụng cảm biến siêu âm và Arduino để đo khoảng cách và hiển thị trên màn hình OLED.",
    //         image: "/projects/arduino-distance.jpg",
    //         likes: 230,
    //         saves: 75,
    //         downloads: 115
    //     },
    //     {
    //         id: 10,
    //         title: "Điều Khiển Động Cơ Servo Bằng Bluetooth",
    //         author: "Đinh Văn K",
    //         description: "Dự án điều khiển động cơ servo từ xa qua kết nối Bluetooth và Arduino.",
    //         image: "/projects/arduino-servo.jpg",
    //         likes: 210,
    //         saves: 85,
    //         downloads: 125
    //     }
    // ]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchProjects = async () => {
            const data = await getProjects(page, perPage);
            setProjects(data.data);
            setTotal(data.total);
        };

        fetchProjects();
    }, [page, perPage]);

    const [interactions, setInteractions] = React.useState<{
        [key: string]: { liked: boolean; saved: boolean; }
    }>({});

    const handleInteraction = (projectId: string, type: 'like' | 'save' | 'download') => {
        setProjects(prev => {
            return prev.map(project => {
                if (project._id === projectId) {
                    const updated = { ...project };
                    switch (type) {
                        case 'like':
                            updated.like_count = interactions[projectId]?.liked ? project.like_count - 1 : project.like_count + 1;
                            break;
                        case 'save':
                            updated.like_count = interactions[projectId]?.saved ? project.like_count - 1 : project.like_count + 1;
                            break;
                        case 'download':
                            updated.view_count = project.view_count + 1;
                            break;
                    }
                    return updated;
                }
                return project;
            });
        });

        if (type !== 'download') {
            setInteractions(prev => ({
                ...prev,
                [projectId]: {
                    ...prev[projectId],
                    [type === 'like' ? 'liked' : 'saved']: !prev[projectId]?.[type === 'like' ? 'liked' : 'saved']
                }
            }));
        }
    };

    return (
        <section className={styles.section3}>
            <div className={styles.projectsGrid}>
                {projects.map(project => (
                    <div key={project._id} className={styles.projectCard}>
                        <div className={styles.imageContainer}>
                            <img src={project.images[0]} alt={project.name} className={styles.projectImage} />
                        </div>
                        <div className={styles.projectContent}>
                            <h3 className={styles.projectTitle}>{project.name}</h3>
                            <p className={styles.projectAuthor}>{project.user_id.username}</p>
                            <p className={styles.projectDescription}>
                                {project.description.length > 100
                                    ? `${project.description.slice(0, 100)}... `
                                    : project.description}
                                {project.description.length > 100 && (
                                    <span className={styles.readMore}>xem thêm</span>
                                )}
                            </p>
                            <div className={styles.interactions}>
                                <button
                                    className={`${styles.interactionButton} ${interactions[project._id]?.liked ? styles.liked : ''}`}
                                    onClick={() => handleInteraction(project._id, 'like')}
                                >
                                    <Heart size={20} />
                                    <span>{project.like_count}</span>
                                </button>
                                <button
                                    className={`${styles.interactionButton} ${interactions[project._id]?.saved ? styles.saved : ''}`}
                                    onClick={() => handleInteraction(project._id, 'save')}
                                >
                                    <Bookmark size={20} />
                                    <span>{project.like_count}</span>
                                </button>
                                <button
                                    className={styles.interactionButton}
                                    onClick={() => handleInteraction(project._id, 'download')}
                                >
                                    <Download size={20} />
                                    <span>{project.like_count}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Section3;