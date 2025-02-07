import React from 'react';
import { Search } from 'lucide-react';
import styles from './Section2.module.css';

interface Section2Props {
    onSearch: (query: string) => void;
}

const Section2: React.FC<Section2Props> = ({ onSearch }) => {
    const [searchValue, setSearchValue] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchValue);
    };

    return (
        <section className={styles.section2}>
            <form className={styles.searchContainer} onSubmit={handleSubmit}>
                <div className={styles.searchWrapper}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm dự án..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className={styles.searchInput}
                    />
                    <button type="submit" className={styles.searchButton}>
                        <Search size={20} />
                    </button>
                </div>
            </form>
        </section>
    );
};

export default Section2;