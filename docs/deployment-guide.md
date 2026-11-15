
# DEPLOYMENT GUIDE

## 1. Thông tin dự án

- Tên dự án: Phân công kỹ thuật viên và lịch hẹn
- Môn học: Chuyên đề Tốt nghiệp 1
- Track: SE
- Luồng: L4
- Công nghệ: Node.js, Express, React, PostgreSQL, Docker

## 2. Yêu cầu môi trường

Máy triển khai cần cài đặt:

- Git
- Docker Desktop
- Docker Compose

Đảm bảo Docker Desktop đang hoạt động trước khi triển khai.

## 3. Lấy mã nguồn

Clone repository:

```bash
git clone https://github.com/minhquanzzz/cdtn1-nguyenminhquan-4.git
```

Di chuyển vào thư mục dự án:

```bash
cd cdtn1-nguyenminhquan-4
```

## 4. Cấu hình môi trường

Tạo file `.env` từ file mẫu:

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Linux/macOS:

```bash
cp .env.example .env
```

Mở file `.env` và cấu hình:

- DB_NAME: Tên database PostgreSQL.
- DB_USER: Tên tài khoản database.
- DB_PASSWORD: Mật khẩu database.
- JWT_SECRET: Chuỗi bí mật dùng để ký JWT.
- ADMIN_PASSWORD: Mật khẩu tài khoản quản trị.

Không chia sẻ hoặc commit file `.env` lên GitHub.

## 5. Khởi chạy hệ thống

Tại thư mục gốc dự án, chạy:

```bash
docker compose up -d --build
```

Docker Compose tự động:

1. Khởi chạy PostgreSQL.
2. Chờ PostgreSQL sẵn sàng.
3. Khởi tạo database và dữ liệu mẫu thông qua db-init.
4. Khởi chạy Backend API.
5. Chờ Backend healthy.
6. Khởi chạy Frontend.

## 6. Truy cập hệ thống

Sau khi các dịch vụ khởi động:

| Thành phần | Địa chỉ |
|---|---|
| Frontend | http://localhost:5173 |
| Backend Health | http://localhost:3000/health |
| API | http://localhost:3000/api/v1 |

## 7. Tài khoản đăng nhập

- Username: admin
- Password: Giá trị ADMIN_PASSWORD trong file `.env`.

## 8. Các lệnh quản lý Docker

Khởi động:

```bash
docker compose up -d
```

Dừng các dịch vụ:

```bash
docker compose down
```

Xem trạng thái:

```bash
docker compose ps
```

Xem log:

```bash
docker compose logs -f
```

Xem log Backend:

```bash
docker compose logs -f backend
```

Xem log Database Initialization:

```bash
docker compose logs db-init
```

## 9. Chạy kiểm thử tự động

Chạy kiểm thử Node.js:

```bash
npm test
```

Lệnh này cần môi trường Node.js và các dependency của dự án được cài đặt.

## 10. Lưu ý dữ liệu

PostgreSQL sử dụng Docker named volume để lưu trữ dữ liệu.

Lệnh:

```bash
docker compose down
```

không xóa named volume.

Không sử dụng:

```bash
docker compose down -v
```

nếu muốn giữ dữ liệu database.

## 11. Kết thúc triển khai

Hệ thống gồm ba thành phần chính:

- PostgreSQL: Lưu trữ dữ liệu.
- Backend: Xử lý nghiệp vụ, API và xác thực.
- Frontend: Giao diện người dùng.

Docker Compose quản lý quá trình khởi chạy các thành phần theo thứ tự phụ thuộc.
