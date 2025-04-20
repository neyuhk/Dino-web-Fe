import React from 'react'
import './Section1.css'
import Search from '../../Search/Search.tsx'

const Section: React.FC = () => {
    const handleSearch = (query: string) => {
        // This will be replaced with actual search logic when integrated
        console.log('Searching for:', query)
    }

    return (
        <section className="hero-section">
            <div className="content-container">
                <div className="text-content">
                    <h1 className="title">
                        Khóa Học Lập Trình Arduino Bằng Kéo Thả Học Từ Cơ Bản
                        Đến Nâng Cao
                    </h1>
                    <p className="description">
                        Khám phá khóa học lập trình Arduino dễ dàng và thú vị
                        với phương pháp kéo thả. Dino cung cấp các bài giảng từ
                        cơ bản đến nâng cao, giúp bạn tạo ra các dự án phần mềm
                        và phần cứng độc đáo mà không cần kiến thức lập trình
                        phức tạp. Tham gia ngay hôm nay để bắt đầu hành trình
                        sáng tạo của bạn!
                    </p>
                    {/*<div className="searchContainer">*/}
                    {/*    <Search onSearch={handleSearch} />*/}
                    {/*</div>*/}

                </div>
                <div className="image-container">
                    <img
                        src="src/components/CoursePage/Section1/image/ss1.png"
                        alt="Arduino Course"
                        className="hero-image"
                    />
                </div>
            </div>
        </section>
    )
}

export default Section
