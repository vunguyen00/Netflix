# 🚀 Netflix Subscription Platform – Hệ thống Tự động hóa Quản lý & Kinh doanh Tài khoản Chia sẻ

[![GitHub language count](https://img.shields.io/github/languages/count/YOUR_USERNAME/YOUR_REPO_NAME)](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME)
[![GitHub last commit](https://img.shields.io/github/last-commit/YOUR_USERNAME/YOUR_REPO_NAME)](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/commits/main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Giới thiệu Dự án

Đây là một **ứng dụng web full-stack** được thiết kế nhằm **tự động hóa toàn bộ quy trình mua bán, phân phối tài khoản, và quản lý bảo hành** cho dịch vụ Netflix dùng chung.

Mục tiêu chính của dự án là **tối đa hóa hiệu suất vận hành** (Operational Efficiency) và **nâng cao trải nghiệm khách hàng** (Customer Experience) bằng cách loại bỏ sự can thiệp thủ công trong các tác vụ:

* **Xử lý đơn hàng:** Từ lúc mua đến lúc kích hoạt/gia hạn.
* **Phân phối mã bảo hành:** Cung cấp ngay lập tức các mã thay thế (tài khoản mới) nếu tài khoản cũ gặp sự cố.
* **Giám sát Real-time:** Cung cấp thông tin số dư và trạng thái đơn hàng tức thì cho khách hàng và quản trị viên.

Hệ thống được xây dựng với một bảng điều khiển quản trị mạnh mẽ, sử dụng các công nghệ hiện đại như Node.js, React, và MongoDB.

---

## ✨ Tính năng Nổi bật & Chức năng Chính

* **Tự động hóa Đơn hàng (Automated Order Processing):** Xử lý quy trình tạo mới, gia hạn, và hết hạn dịch vụ một cách tự động theo lịch trình (**Node-cron**).
* **Cập nhật Real-time (Thời gian thực):** Sử dụng **Server-Sent Events (SSE)** để cập nhật tức thì trạng thái đơn hàng và số dư của khách hàng mà không cần tải lại trang.
* **Bảo mật Truy cập:** Triển khai cơ chế xác thực an toàn (**Đăng nhập bằng SĐT** cho khách hàng và **Bảo mật JWT** cho trang quản trị).
* **Quản lý Vận hành:** Bảng điều khiển Admin tập trung để quản lý khách hàng, theo dõi lịch sử đơn hàng và hồ sơ tài khoản Netflix.
* **Tích hợp Thanh toán:** Hỗ trợ thanh toán trực tuyến liền mạch thông qua cổng **Stripe**.
* **Phân tích Dữ liệu:** Thống kê và biểu đồ (**Recharts**) giúp quản trị viên theo dõi hiệu suất kinh doanh.

---

## 🛠️ Công nghệ Sử dụng

| Khía cạnh | Công nghệ | Chi tiết |
| :--- | :--- | :--- |
| **Backend** | **Node.js, Express, MongoDB** | Nền tảng server, quản lý dữ liệu NoSQL hiệu suất cao. |
| **Giao diện** | **React + Vite, Tailwind CSS** | Xây dựng giao diện người dùng hiện đại, nhanh và responsive. |
| **Bảo mật** | **JSON Web Tokens (JWT)** | Cơ chế xác thực an toàn cho Admin. |
| **Định kỳ** | **Node-cron** | Quản lý các tác vụ định kỳ tự động. |
| **Real-time** | **Server-Sent Events (SSE)** | Cập nhật dữ liệu thời gian thực. |
| **Thanh toán** | **Stripe** | Tích hợp cổng thanh toán. |
| **Đồ họa** | **Recharts** | Thư viện biểu đồ và thống kê. |

---

## ⚙️ Yêu cầu Hệ thống

Để cài đặt và chạy dự án, bạn cần có:

* **Node.js** v18 trở lên
* **npm** (hoặc yarn/pnpm)
* **MongoDB** (có thể dùng local hoặc MongoDB Atlas)

---
