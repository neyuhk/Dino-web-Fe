import React from 'react';
import styles from './Section1.module.css';
import { Search } from 'lucide-react'
import robotic from './image/Robotics-cuate.png'

interface Section2Props {
    onSearch: (query: string) => void;
}
const Section1: React.FC<Section2Props> = ({onSearch}) => {
    const [searchValue, setSearchValue] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchValue);
    };
    return (
        <section className={styles.introSection}>
            <div className={styles.container}>
                <div className={styles.contentColumn}>
                    <div className={styles.headingWrapper}>
                        <h1 className={styles.mainHeading}>
                            Học Arduino Dễ Dàng - Sáng Tạo Không Giới Hạn
                        </h1>
                        <h2 className={styles.subHeading}>
                            Khám phá các khóa học từ cơ bản đến nâng cao để hiện thực hóa ý tưởng sáng tạo của bạn!
                        </h2>
                    </div>

                    <p className={styles.description}>
                        Trang web này cung cấp các khóa học lập trình Arduino với phương pháp kéo thả dễ dàng.
                        Bắt đầu từ các dự án đơn giản đến các ứng dụng IoT và robotics, bạn sẽ được hướng dẫn
                        chi tiết để tự tay tạo ra những sản phẩm sáng tạo.
                    </p>

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
                </div>

                <div className={styles.imageColumn}>
                    <div className={styles.imageWrapper}>
                        <img
                            src={robotic}
                            alt="Arduino Learning"
                            className={styles.illustrationImage}
                        />
                    </div>
                    <div className={styles.backgroundShape}></div>
                </div>
            </div>
        </section>
    );
};

export default Section1;
