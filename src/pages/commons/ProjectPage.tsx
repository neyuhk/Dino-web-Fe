import React from 'react';
import styles from '../../pages/commons/styles/ProjectPage.module.css'
import Section1 from '../../components/ProjectsPage/Section1/ProjectPages.tsx'
import Section2 from '../../components/ProjectsPage/Section2/Section2.tsx'
import Section3 from '../../components/ProjectsPage/Section3/Section3.tsx'
import { useSelector } from 'react-redux'
import RequireAuth from '../../components/commons/RequireAuth/RequireAuth.tsx'
import ProjectPages from '../../components/ProjectsPage/Section1/ProjectPages.tsx'

const ProjectsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const { user } = useSelector((state: any) => state.auth);
    // const handleSearch = (query: string) => {
    //     setSearchQuery(query);
    //     // Implement search logic here
    // };

    if(!user){
        return (
            <RequireAuth></RequireAuth>
        );
    }

    return (
        <div className={styles.projectsPage}>
            <ProjectPages></ProjectPages>
            {/*<Section3 searchQuery={searchQuery} />*/}
        </div>
    );
};

export default ProjectsPage;