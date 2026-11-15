
# DEPLOYMENT GUIDE
## Dự án: Phân công kỹ thuật viên và lịch hẹn (Luồng 4)

### 1. Thông tin dự án

| Thông tin | Nội dung |
|---|---|
| Tên dự án | Phân công kỹ thuật viên và lịch hẹn |
| Môn học | Chuyên đề Tốt nghiệp 1 |
| Track | SE |
| Luồng | L4 |
| Backend | Node.js, Express.js |
| Frontend | React, Vite |
| Database | PostgreSQL 16 |
| Containerization | Docker, Docker Compose |
| Repository | https://github.com/minhquanzzz/cdtn1-nguyenminhquan-4 |
| Branch | main |
| Version | v1.0 |

### 2. Yêu cầu hệ thống

Máy triển khai cần cài đặt:

- Git
- Docker Desktop
- Docker Compose

Đối với Windows, cần khởi động Docker Desktop trước khi thực hiện triển khai.

### 3. Lấy mã nguồn dự án

Mở Terminal hoặc PowerShell và chạy:

```powershell
git clone https://github.com/minhquanzzz/cdtn1-nguyenminhquan-4.git
```

Di chuyển vào thư mục dự án:

```powershell
cd cdtn1-nguyenminhquan-4
```

Nếu muốn lấy đúng phiên bản bàn giao:

```powershell
git checkout v1.0
```

### 4. Cấu hình biến môi trường

Tạo file `.env` từ file mẫu:

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Linux/macOS:

```bash
cp .env.example .env
```

Mở file `.env` và cấu hình các biến:

| Biến | Ý nghĩa |
|---|---|
| PORT | Cổng chạy Backend |
| DB_HOST | Địa chỉ PostgreSQL khi chạy trực tiếp |
| DB_PORT | Cổng PostgreSQL |
| DB_NAME | Tên database |
| DB_USER | Tài khoản database |
| DB_PASSWORD | Mật khẩu database |
| JWT_SECRET | Khóa bí mật ký JWT |
| ADMIN_PASSWORD | Mật khẩu tài khoản Admin |

Lưu ý:

- Sử dụng mật khẩu riêng cho database.
- Sử dụng JWT_SECRET có độ dài và độ ngẫu nhiên phù hợp.
- Đặt ADMIN_PASSWORD thành mật khẩu riêng.
- Không chia sẻ file `.env`.
- Không commit file `.env` lên GitHub.

### 5. Triển khai bằng Docker Compose

Tại thư mục gốc dự án, chạy lệnh:

```powershell
docker compose up -d --build
```

Docker Compose sẽ triển khai các thành phần theo thứ tự phụ thuộc:

1. PostgreSQL Database.
2. Database Initialization.
3. Backend API.
4. Frontend Web Application.

Database Initialization thực hiện khởi tạo cấu trúc và dữ liệu mẫu theo cấu hình của dự án.

Backend chỉ khởi động sau khi bước khởi tạo database hoàn tất thành công. Frontend khởi động sau khi Backend đạt trạng thái healthy.

### 6. Truy cập hệ thống

| Thành phần | Địa chỉ |
|---|---|
| Frontend | http://localhost:5173 |
| Backend Health | http://localhost:3000/health |
| Backend API | http://localhost:3000/api/v1 |

Người dùng truy cập Frontend để sử dụng hệ thống.

### 7. Tài khoản quản trị

Tài khoản Admin được cấu hình trong quá trình Database Initialization.

| Thông tin | Giá trị |
|---|---|
| Username | admin |
| Password | Giá trị ADMIN_PASSWORD trong `.env` |

Không sử dụng mật khẩu mặc định trong môi trường triển khai thực tế.

### 8. Các lệnh quản lý Docker

Xem trạng thái các container:

```powershell
docker compose ps
```

Xem log toàn bộ hệ thống:

```powershell
docker compose logs -f
```

Xem log Backend:

```powershell
docker compose logs -f backend
```

Xem log PostgreSQL:

```powershell
docker compose logs -f postgres
```

Xem log Database Initialization:

```powershell
docker compose logs db-init
```

Dừng hệ thống:

```powershell
docker compose down
```

Khởi động lại hệ thống:

```powershell
docker compose up -d
```

### 9. Chạy kiểm thử tự động

Để chạy bộ kiểm thử Node.js, cần cài đặt Node.js và các dependencies tại thư mục gốc:

```powershell
npm ci
```

Sau đó chạy:

```powershell
npm test
```

### 10. Quản lý dữ liệu PostgreSQL

Dữ liệu PostgreSQL được lưu trong Docker named volume:

`cdtn1-nguyenminhquan-4_postgres_data`

Named volume giúp dữ liệu được giữ lại khi dừng hoặc xóa container bằng:

```powershell
docker compose down
```

Không sử dụng lệnh sau nếu muốn bảo toàn dữ liệu:

```powershell
docker compose down -v
```

Lệnh trên có thể xóa volume và dữ liệu PostgreSQL.

### 11. Kết thúc triển khai

Dự án được đóng gói bằng Docker Compose với các thành phần:

- PostgreSQL: Quản lý dữ liệu.
- Backend: Xử lý nghiệp vụ và cung cấp REST API.
- Frontend: Giao diện người dùng.
- Database Initialization: Khởi tạo database và dữ liệu mẫu.

Repository: https://github.com/minhquanzzz/cdtn1-nguyenminhquan-4

Version bàn giao: v1.0
