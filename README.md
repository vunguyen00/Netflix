# 🚀 Netflix Subscription Platform – Hệ thống quản lý tài khoản Netflix nâng cao

---

## 🌟 Giới thiệu Dự án

Đây là một **ứng dụng web full-stack** được thiết kế nhằm **tự động hóa toàn bộ quy trình mua bán, phân phối tài khoản, và quản lý bảo hành** cho dịch vụ Netflix dùng chung.

Mục tiêu chính của dự án là **tối đa hóa hiệu suất vận hành** (Operational Efficiency) và **nâng cao trải nghiệm khách hàng** (Customer Experience) bằng cách loại bỏ sự can thiệp thủ công trong các tác vụ:

- **Xử lý đơn hàng:** Từ lúc mua đến lúc kích hoạt/gia hạn.  
- **Phân phối mã bảo hành:** Cung cấp ngay lập tức các mã thay thế (tài khoản mới) nếu tài khoản cũ gặp sự cố.  
- **Giám sát Real-time:** Cung cấp thông tin số dư và trạng thái đơn hàng tức thì cho khách hàng và quản trị viên.  

Hệ thống được xây dựng với một bảng điều khiển quản trị mạnh mẽ, sử dụng các công nghệ hiện đại như **Node.js, React**, và **MongoDB**.

---

## ✨ Tính năng Nổi bật & Chức năng Chính

- **Tự động hóa Đơn hàng (Automated Order Processing):** Xử lý quy trình tạo mới, gia hạn, và hết hạn dịch vụ tự động theo lịch trình (**Node-cron**).  
- **Cập nhật Real-time:** Sử dụng **Server-Sent Events (SSE)** để cập nhật trạng thái đơn hàng và số dư khách hàng mà không cần tải lại trang.  
- **Bảo mật Truy cập:** Triển khai xác thực an toàn (**Đăng nhập bằng SĐT**, **JWT** cho trang quản trị).  
- **Bảng điều khiển Admin:** Quản lý khách hàng, lịch sử đơn hàng và hồ sơ tài khoản Netflix.  
- **Tích hợp Thanh toán:** Thanh toán trực tuyến liền mạch qua **Stripe**.  
- **Phân tích Dữ liệu:** Thống kê, biểu đồ (**Recharts**) giúp theo dõi hiệu suất kinh doanh.  

---

## 🛠️ Công nghệ Sử dụng

| Khía cạnh | Công nghệ | Chi tiết |
| :--- | :--- | :--- |
| **Backend** | **Node.js, Express, MongoDB** | Nền tảng server, quản lý dữ liệu NoSQL hiệu suất cao. |
| **Frontend** | **React + Vite, Tailwind CSS** | Xây dựng giao diện hiện đại, nhanh và responsive. |
| **Bảo mật** | **JWT (JSON Web Token)** | Cơ chế xác thực an toàn cho Admin. |
| **Định kỳ** | **Node-cron** | Quản lý tác vụ định kỳ tự động. |
| **Real-time** | **Server-Sent Events (SSE)** | Cập nhật dữ liệu thời gian thực. |
| **Thanh toán** | **Stripe** | Cổng thanh toán tích hợp. |
| **Đồ họa** | **Recharts** | Thư viện biểu đồ và thống kê. |

---

## ⚙️ Yêu cầu Hệ thống

- **Node.js** v18 trở lên  
- **npm** (hoặc yarn/pnpm)  
- **MongoDB** (local hoặc MongoDB Atlas)  

---

## 💻 Hướng dẫn Cài đặt

### 1. Clone Repository

```bash
git clone https://github.com/vunguyen00/Netflix
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

#### Chạy server backend

```bash
npm run dev
```

🌐 Backend mặc định chạy tại: [http://localhost:5000](http://localhost:5000)

---

### 3. Cài đặt Frontend

Mở cửa sổ terminal mới và chạy:

```bash
cd ../frontend
npm install
npm run dev
```

🖥️ Frontend chạy tại: [http://localhost:5173](http://localhost:5173)

---

## 📦 Scripts Dự án

| Lệnh | Vị trí | Mô tả |
| :--- | :--- | :--- |
| `npm run dev` | Backend & Frontend | Chạy server ở chế độ phát triển |
| `npm run build` | Frontend | Build ứng dụng cho production |
| `npm run lint` | Frontend | Kiểm tra lỗi code với ESLint |

---

## 📂 Cấu trúc Thư mục

```
.
├── backend
│   ├── src
│   │   ├── config/        # Cấu hình DB, JWT, ...
│   │   ├── controllers/   # Business Logic (API)
│   │   ├── models/        # Mongoose Schema
│   │   ├── routes/        # API Endpoints
│   │   ├── utils/         # Cron Jobs, SSE Helper, ...
│   │   └── server.js      # Entry Point Backend
├── frontend
│   ├── src
│   │   ├── components/    # Reusable UI Components
│   │   ├── pages/         # Main Pages
│   │   ├── services/      # API Calls
│   │   ├── store/         # State Management
│   │   └── main.jsx       # Entry Point Frontend
└── README.md
```

---

## 📈 Hướng phát triển Tương lai

- Mở rộng hệ thống phân quyền cho nhiều quản trị viên.  
- Ứng dụng AI/Machine Learning để phát hiện gian lận và tối ưu hành vi người dùng.  
- Hỗ trợ đa ngôn ngữ (i18n).  

---

## 👤 Tác giả

**[Nguyen Ngoc Vu]**  
🌐 Website : https://dailywithminh.com/
💻 GitHub: https://github.com/vunguyen00/Netflix  
✉️ Email: nguyenvu00304@gmail.com

---
