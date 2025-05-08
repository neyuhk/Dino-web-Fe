import React, { useEffect, useState } from 'react';
import './DinoLoading.css';
import dino from '../../../assets/dinosaur.png';

// Định nghĩa kiểu props cho component
interface DinoLoadingProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
}

// Định nghĩa kiểu dữ liệu cho các bong bóng chữ cái
interface DinoLetter {
    id: number;
    letter: string;
    animationDelay: number;
}

const DinoLoading: React.FC<DinoLoadingProps> = ({
                                                     message = 'Đang tải...',
                                                     size = 'md'
                                                 }) => {
    const [letters, setLetters] = useState<DinoLetter[]>([]);
    const [smallBubbles, setSmallBubbles] = useState<{id: number, size: number, x: number, y: number, animationDuration: number, delay: number}[]>([]);

    useEffect(() => {
        // Tạo các chữ cái DINO với animation đồng bộ hơn
        const dinoLetters = "DINO".split('').map((letter, index) => ({
            id: index,
            letter,
            animationDelay: index * 0.1 // Độ trễ nhỏ để tạo hiệu ứng lần lượt
        }));

        setLetters(dinoLetters);

        // Tạo các bong bóng nhỏ xung quanh
        const bubbleCount = size === 'sm' ? 4 : size === 'md' ? 6 : 8;
        const newBubbles = [];

        for (let i = 0; i < bubbleCount; i++) {
            // Phân bố bong bóng đều hơn xung quanh
            const angle = (i * (360 / bubbleCount)) + (Math.random() * 20 - 10);
            const distance = Math.random() * 10 + 40; // Khoảng cách đồng đều hơn

            const x = Math.cos(angle * (Math.PI / 180)) * distance;
            const y = Math.sin(angle * (Math.PI / 180)) * distance;

            newBubbles.push({
                id: i,
                size: Math.random() * 4 + 3, // 3px đến 7px - nhỏ hơn và đồng đều hơn
                x: x,
                y: y,
                animationDuration: 2.5 + Math.random(), // 2.5-3.5s
                delay: i * 0.2 % 1 // Đảm bảo delay có mẫu lặp lại
            });
        }

        setSmallBubbles(newBubbles);
    }, [size]);

    return (
        <div className="dino-loading-wrapper">
            <div className={`dino-content ${size}`}>
                {/* Các bong bóng nhỏ xung quanh */}
                {smallBubbles.map((bubble) => (
                    <div
                        key={bubble.id}
                        className="bubble"
                        style={{
                            width: `${bubble.size}px`,
                            height: `${bubble.size}px`,
                            left: `calc(50% + ${bubble.x}%)`,
                            top: `calc(50% + ${bubble.y}%)`,
                            animation: `float ${bubble.animationDuration}s infinite alternate ease-in-out`,
                            animationDelay: `${bubble.delay}s`
                        }}
                    ></div>
                ))}

                {/* Hình ảnh dino - đưa lên trên chữ DINO */}
                <div className="dino-image-wrapper">
                    <img src={dino} alt="Dino" className="dino-image" />
                    <div className="dino-shadow"></div>
                </div>

                {/* Khu vực chữ DINO - được đặt bên dưới hình */}
                <div className="dino-letters">
                    {letters.map((item) => (
                        <div
                            key={item.id}
                            className="dino-letter-bubble"
                            style={{
                                animationDelay: `${item.animationDelay}s`
                            }}
                        >
                            {item.letter}
                        </div>
                    ))}
                </div>

                {/* Thông báo đang tải */}
                <div className="loading-message">{message}</div>

                {/* Dấu chấm đang tải */}
                <div className="loading-dots">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                </div>
            </div>
        </div>
    );
};

export default DinoLoading;