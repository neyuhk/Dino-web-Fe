import React from 'react';
import './DinoLoading.css'; // Tạo file CSS riêng

const DinoLoading = ({ message = "Đang tải..." }) => {
    return (
        <div className="dino-loading-container">
            <div className="dino-loading-spinner">
                <div className="dino-container">
                    <svg className="dino" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        {/* Dino Body */}
                        <path className="dino-body" d="M20,70 Q20,80 30,85 L70,85 Q80,80 80,70 L80,40 Q80,30 70,25 L45,15 Q35,10 25,15 L20,30 Z" />

                        {/* Dino Spikes */}
                        <path className="dino-accent" d="M30,25 L35,15 L40,25 L45,15 L50,25 L55,15 L60,25 L65,15 L70,25" strokeWidth="2" fill="none" stroke="#3a8a34" />

                        {/* Dino Head */}
                        <path className="dino-body" d="M20,30 L10,40 L5,60 L15,65 L20,55 Z" />

                        {/* Dino Eye */}
                        <circle className="dino-eye" cx="15" cy="45" r="4" />
                        <circle className="dino-pupil" cx="15" cy="45" r="2" />

                        {/* Dino Arm */}
                        <path className="dino-body" d="M30,50 L25,65 L30,70 L35,65 Z" />

                        {/* Dino Leg 1 */}
                        <path className="dino-body" d="M40,85 L38,95 L43,95 L45,85 Z" />

                        {/* Dino Leg 2 */}
                        <path className="dino-body" d="M60,85 L58,95 L63,95 L65,85 Z" />

                        {/* Dino Tail */}
                        <path className="dino-body" d="M80,60 Q90,60 95,55 Q100,50 90,45 L80,50 Z" />
                    </svg>

                    <div className="letter">D</div>
                    <div className="letter">I</div>
                    <div className="letter">N</div>
                    <div className="letter">O</div>
                </div>

                <div className="track">
                    <div className="footprint"></div>
                    <div className="footprint"></div>
                    <div className="footprint"></div>
                    <div className="footprint"></div>
                    <div className="footprint"></div>
                </div>
            </div>
            <p>{message}</p>
        </div>
    );
};

export default DinoLoading;