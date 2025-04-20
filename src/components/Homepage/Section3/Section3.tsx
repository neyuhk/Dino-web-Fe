import React, { useEffect, useRef, useState } from 'react';
import styles from './Section3.module.css';
import ButtonGradient from '../../ButtonGradient/ButtonGradient.tsx';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import image sources
import servoBlock from './image/servo block.png';
import servoCode from './image/servo.png';
import lcdBlock from './image/lcd block.png';
import lcdCode from './image/lcd.png';
import buttonBlock from './image/button block.png';
import buttonCode from './image/button.png';

// Define the type for our example items
interface CodeExample {
    id: number;
    title: string;
    blockImageSrc: string;
    codeImageSrc: string;
}

const Section3: React.FC = () => {
    const navigate = useNavigate();
    const sectionRef = useRef<HTMLElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [showDemo, setShowDemo] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const codeExamples: CodeExample[] = [
        {
            id: 1,
            title: "Servo Example",
            blockImageSrc: servoBlock,
            codeImageSrc: servoCode,
        },
        {
            id: 2,
            title: "Liquid-Crystal Display Example",
            blockImageSrc: lcdBlock,
            codeImageSrc: lcdCode,
        },
        {
            id: 3,
            title: "Led Control With Button Example",
            blockImageSrc: buttonBlock,
            codeImageSrc: buttonCode,
        },
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    useEffect(() => {
        let slideInterval: ReturnType<typeof setInterval>;

        if (showDemo && !isHovering) {
            slideInterval = setInterval(() => {
                setCurrentSlide((prev) =>
                    prev === codeExamples.length - 1 ? 0 : prev + 1
                );
            }, 3000);
        }

        return () => {
            if (slideInterval) clearInterval(slideInterval);
        };
    }, [showDemo, isHovering, codeExamples.length]);

    const toggleDemo = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setShowDemo(!showDemo);
            setTimeout(() => {
                setIsAnimating(false);
            }, 300);
        }, 300);
    };

    const goToPrevSlide = () => {
        setCurrentSlide((prev) =>
            prev === 0 ? codeExamples.length - 1 : prev - 1
        );
    };

    const goToNextSlide = () => {
        setCurrentSlide((prev) =>
            prev === codeExamples.length - 1 ? 0 : prev + 1
        );
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <section ref={sectionRef} className={styles.section}>
            <div className={styles.container}>
                <div ref={cardRef} className={`${styles.card} ${isVisible ? styles.visible : ''}`}>
                    <div className={styles.mainContent}>
                        <div className={styles.content}>
                            <h2 className={styles.title}>Lập trình dễ dàng</h2>
                            <p className={styles.description}>
                                Thực hiện chuyển đổi code từ các khối một cách dễ dàng, chính xác
                            </p>
                            <p className={styles.description}>
                                Dino hỗ trợ nạp mã nguồn sang phần cứng
                            </p>

                            <div className={styles.buttonGroup}>
                                <ButtonGradient
                                    text="Thử ngay"
                                    onClick={() => navigate('/blockly')}
                                />
                                <ButtonGradient
                                    text={showDemo ? 'Ẩn ví dụ' : 'Xem ví dụ'}
                                    onClick={toggleDemo}
                                    disabled={isAnimating}
                                />
                            </div>
                        </div>
                        <div className={styles.imageWrapper}>
                            <img
                                ref={imageRef}
                                src="src/assets/homepage/section3.png"
                                alt="Programming"
                                className={`${styles.image} ${isVisible ? styles.animatedImage : ''}`}
                            />
                        </div>
                    </div>

                    <div className={`${styles.demoWrapper} ${showDemo ? styles.demoVisible : styles.demoHidden}`}>
                        <div className={styles.demoContainer}>
                            <h3 className={styles.demoTitle}>Ví dụ mã nguồn</h3>

                            <div
                                className={styles.sliderContainer}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button
                                    className={`${styles.sliderButton} ${styles.prevButton}`}
                                    onClick={goToPrevSlide}
                                >
                                    <ChevronLeft size={24} />
                                </button>

                                <div className={styles.sliderWrapper}>
                                    <div
                                        ref={sliderRef}
                                        className={styles.sliderTrack}
                                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                    >
                                        {codeExamples.map((example) => (
                                            <div key={example.id} className={styles.slide}>
                                                <h4 className={styles.slideTitle}>{example.title}</h4>
                                                <div className={styles.imageComparison}>
                                                    <div className={styles.imageContainer}>
                                                        <p className={styles.imageLabel}>Block</p>
                                                        <img
                                                            src={example.blockImageSrc}
                                                            alt={`${example.title} blocks`}
                                                            className={styles.exampleImage}
                                                        />
                                                    </div>
                                                    <div className={styles.imageContainer}>
                                                        <p className={styles.imageLabel}>Code</p>
                                                        <img
                                                            src={example.codeImageSrc}
                                                            alt={`${example.title} code`}
                                                            className={styles.exampleImage}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    className={`${styles.sliderButton} ${styles.nextButton}`}
                                    onClick={goToNextSlide}
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>

                            <div className={styles.indicators}>
                                {codeExamples.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`${styles.indicator} ${index === currentSlide ? styles.activeIndicator : ''}`}
                                        onClick={() => setCurrentSlide(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Section3;
