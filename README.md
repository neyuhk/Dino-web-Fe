# 🧩 Dino Management – Lập Trình Arduino Kéo Thả

Dino Management là một ứng dụng web cho phép người dùng lập trình Arduino bằng giao diện kéo thả (sử dụng Blockly), tự động sinh mã C/C++ tương ứng, và **nạp trực tiếp vào bo mạch Arduino** thông qua giao diện web.

---

## ⚙️ Công nghệ sử dụng

- 💻 **Frontend**: React + TypeScript + Vite + Blockly
- 🌐 **Backend**: Node.js + Express
- 🔌 **Giao tiếp Arduino**: Tự động tìm Arduino IDE, tự động đoán cổng COM, gọi `arduino --upload`

---

## 🚀 Tính năng chính

- Kéo thả khối lệnh để lập trình Arduino
- Sinh mã C/C++ tự động từ Blockly
- Gửi code về backend và nạp trực tiếp vào Arduino qua cổng USB
- Hỗ trợ đoán cổng COM và đường dẫn đến Arduino IDE tự động (Windows)

---

## 🛠 Cài đặt & chạy ứng dụng

### 📦 Yêu cầu hệ thống

- [Node.js](https://nodejs.org/) v16 trở lên
- [npm](https://www.npmjs.com/) (đi kèm với Node.js)
- [Arduino IDE](https://www.arduino.cc/en/software) đã cài trên máy phiên bản 1.8.x

---

### 1. Clone repository

```bash
git clone https://github.com/neyuhk/Dino-FE-Nhap.git
cd Dino-FE-Nhap
```

### 2. Cài đặt các gói phụ thuộc

```bash
npm install
```
### 3. Chạy ứng dụng

```bash
npm run dev
```

Mở trình duyệt và truy cập vào `http://localhost:8000` để sử dụng ứng dụng.

### 4. Chạy backend

```bash
https://github.com/NguyenBaHoangKim/Dino-management.git
cd Dino-management
npm install
npm run dev
```
Back end được lắng nghe ở `http://localhost:3000`

## 📁 Cấu trúc thư mục

| Thư mục/Tập tin                | Mô tả                                      |
|-------------------------------|--------------------------------------------|
| `public/`                     | Thư mục chứa tài nguyên tĩnh               |
| `src/`                        | Thư mục chính chứa mã nguồn                |
| ├── `assets/`                | Hình ảnh, fonts, v.v.                      |
| ├── `Blockly/`               | Cấu hình và khởi tạo khối Blockly          |
| ├── `components/`            | Các component dùng chung                   |
| ├── `config/`                | Cấu hình hệ thống                          |
| ├── `constants/`             | Hằng số dùng toàn hệ thống                 |
| ├── `enum/`                  | Các kiểu liệt kê                           |
| ├── `helpers/`               | Hàm tiện ích                               |
| ├── `hooks/`                 | Custom hooks                               |
| ├── `layouts/`               | Các layout chính                           |
| ├── `model/`                 | Kiểu dữ liệu (interface/model)             |
| ├── `page/`                  | Các trang riêng lẻ                         |
| ├── `pages/`                 | Các nhóm trang chính                       |
| │   └── `BlocklyPage/`       | Trang Blockly                          |
| ├── `router/`                | Định tuyến toàn ứng dụng                   |
| ├── `services/`              | Giao tiếp API và logic xử lý               |
| ├── `stores/`                | Quản lý trạng thái (Zustand, Redux...)     |
| ├── `styles/`                | Các file CSS toàn cục                      |
| ├── `App.tsx`                | Entry chính của ứng dụng                    |
| ├── `index.tsx`              | Điểm bắt đầu của React                     |
| ├── `main.tsx`               | Gốc khởi chạy chính                        |
| ├── `vite-env.d.ts`          | Định nghĩa môi trường cho Vite             |
| `.env`                       | Biến môi trường                            |
| `.env.development`           | Biến môi trường cho dev                    |
| `.gitignore`                 | Danh sách file không push lên Git          |
| `.prettierrc.yaml`           | Cấu hình Prettier                          |
| `index.html`                 | HTML gốc của ứng dụng                      |
| `package.json`               | Quản lý dependency                         |
| `vite.config.ts`             | Cấu hình Vite                              |

## 🧪 Luồng hoạt động chi tiết
1. Người dùng tạo chương trình bằng kéo thả trên trình duyệt

2. Frontend chuyển block Blockly thành code C++ và gửi về API backend:

3. Backend:

Tạo file .ino tạm ở thư mục server/temp/

Tự động đoán đường dẫn tới arduino.exe và COM port

Gọi lệnh:
```bash
arduino --upload --port COMx path/to/temp/sketch.ino
```
Gửi kết quả trở lại frontend

4. Frontend hiển thị thông báo: thành công / thất bại

## ⚠️ Lưu ý khi sử dụng
✅ Đảm bảo mạch Arduino đã kết nối và nhận cổng COM

✅ Arduino IDE phải là bản tải từ arduino.cc, không phải Microsoft Store

✅ Project hỗ trợ đoán COM port chỉ trên Windows (dùng Windows Registry)

## 🌐 Tham khảo thêm
- [Arduino IDE](https://www.arduino.cc/)

- [Blockly](https://developers.google.com/blockly)
- [React](https://reactjs.org/)
- [vite](https://vitejs.dev/)
- [Express](https://expressjs.com/)
