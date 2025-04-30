// AdminDashboard.tsx
import React from 'react';
import {
    BarChart, Users, BookOpen, MessageSquare,
    ArrowRight, TrendingUp, Award, Settings, Check, AlertCircle
} from 'lucide-react';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/dinologo-nobgr.png'

// Định nghĩa types
type SectionProps = {
    title: string;
    icon: React.ReactNode;
    colorClass: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    onClick: () => void;
};

const AdminDashboard: React.FC = () => {
    // Xử lý chuyển hướng
    const navigate = useNavigate()
    const handleNavigate = (section: string): void => {
        console.log(`Navigating to ${section}`);
        // Thực tế sẽ sử dụng router để điều hướng
        navigate(`/admin/${section}`);
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1 className="dashboard-title title-gradian">Bảng Điều Khiển Quản Trị</h1>
                <p className="dashboard-subtitle">Chọn một mục để bắt đầu quản lý hệ thống của bạn</p>
            </header>

            {/* Grid layout với 4 phần chính */}
            <div className="dashboard-grid">
                <Section
                    title="Quản Lý Dự Án"
                    icon={<BarChart size={24} />} // Giảm kích thước từ 36px xuống 24px
                    colorClass="project-theme"
                    position="top-left"
                    onClick={() => handleNavigate('projects')}
                />

                <Section
                    title="Quản Lý Người Dùng"
                    icon={<Users size={24} />} // Giảm kích thước
                    colorClass="user-theme"
                    position="top-right"
                    onClick={() => handleNavigate('users')}
                />

                <Section
                    title="Quản Lý Diễn Đàn"
                    icon={<MessageSquare size={24} />} // Giảm kích thước
                    colorClass="forum-theme"
                    position="bottom-left"
                    onClick={() => handleNavigate('forum')}
                />

                <Section
                    title="Quản Lý Khóa Học"
                    icon={<BookOpen size={24} />} // Giảm kích thước
                    colorClass="course-theme"
                    position="bottom-right"
                    onClick={() => handleNavigate('courses')}
                />
            </div>
        </div>
    );
};

// Component cho mỗi phần trong dashboard
const Section: React.FC<SectionProps> = ({ title, icon, colorClass, position, onClick }) => {
    const getFeatures = () => {
        switch(title) {
            case 'Quản Lý Dự Án':
                return [
                    { icon: <TrendingUp size={16} />, text: 'Thống kê và tiến độ' }, // Giảm kích thước từ 20px xuống 16px
                    { icon: <Settings size={16} />, text: 'Cấu hình dự án' },
                    { icon: <Check size={16} />, text: 'Phê duyệt dự án' }
                ];
            case 'Quản Lý Người Dùng':
                return [
                    { icon: <Users size={16} />, text: 'Danh sách người dùng' },
                    { icon: <Settings size={16} />, text: 'Phân quyền hệ thống' },
                    { icon: <AlertCircle size={16} />, text: 'Báo cáo hoạt động' }
                ];
            case 'Quản Lý Diễn Đàn':
                return [
                    { icon: <MessageSquare size={16} />, text: 'Quản lý bài viết' },
                    { icon: <Settings size={16} />, text: 'Kiểm duyệt nội dung' },
                    { icon: <Users size={16} />, text: 'Người dùng hoạt động' }
                ];
            case 'Quản Lý Khóa Học':
                return [
                    { icon: <BookOpen size={16} />, text: 'Danh sách khóa học' },
                    { icon: <Award size={16} />, text: 'Cấp chứng chỉ' },
                    { icon: <TrendingUp size={16} />, text: 'Thống kê học tập' }
                ];
            default:
                return [];
        }
    };

    const features = getFeatures();

    return (
        <div className={`section ${colorClass} ${position}`} onClick={onClick}>
            <div className="section-header">
                <div className="section-icon">{icon}</div>
                <h2 className="section-title">{title}</h2>
            </div>

            <div className="section-content">
                <div className="stats-container">
                    {getStats(title).map((stat, index) => (
                        <div key={index} className="stat-item">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    ))}
                </div>

                <div className="features-container">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-item">
                            <div className="feature-icon">{feature.icon}</div>
                            <span className="feature-text">{feature.text}</span>
                        </div>
                    ))}
                </div>

                <button className="section-button">
                    Xem chi tiết <ArrowRight size={16} className="button-icon" /> {/* Giảm kích thước từ 18px xuống 16px */}
                </button>
            </div>
        </div>
    );
};

// Helper function for stats
const getStats = (title: string): Array<{label: string, value: string | number}> => {
    const stats: {[key: string]: Array<{label: string, value: string | number}>} = {
        'Quản Lý Dự Án': [
            { label: 'Dự án đang hoạt động', value: 24 },
            { label: 'Hoàn thành trong tháng', value: 12 }
        ],
        'Quản Lý Người Dùng': [
            { label: 'Tổng người dùng', value: 1250 },
            { label: 'Người dùng mới', value: 68 }
        ],
        'Quản Lý Diễn Đàn': [
            { label: 'Bài viết mới', value: 124 },
            { label: 'Chủ đề thảo luận', value: 86 }
        ],
        'Quản Lý Khóa Học': [
            { label: 'Tổng khóa học', value: 42 },
            { label: 'Đăng ký trong tuần', value: 128 }
        ]
    };

    return stats[title] || [];
};

export default AdminDashboard;
