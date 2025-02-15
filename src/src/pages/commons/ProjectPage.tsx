import React from 'react';
import styles from '../../pages/commons/styles/ProjectPage.module.css'
import Section1 from '../../components/ProjectsPage/Section1/Section1.tsx'
import Section2 from '../../components/ProjectsPage/Section2/Section2.tsx'
import Section3 from '../../components/ProjectsPage/Section3/Section3.tsx'

const ProjectsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        // Implement search logic here
    };

    return (
        <div className={styles.projectsPage}>
            <Section1  onSearch={handleSearch}/>
            {/*<Section2 onSearch={handleSearch} />*/}
            <Section3 searchQuery={searchQuery} />
        </div>
    );
};

export default ProjectsPage;