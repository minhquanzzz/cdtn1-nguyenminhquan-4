# cdtn1-nguyenminhquan-4
# <Phân công kỹ thuật viên và lịch hẹn>
Sinh viên:
Nguyễn Minh Quân - 2273401151135 - Track SE
Học phần:
Chuyên đề Tốt nghiệp 1, HK1 2026-2027
Luồng nghiệp vụ:
L4 – Phân công kỹ thuật viên và lịch hẹn
## 1. Mục tiêu
Hệ thống hỗ trợ nhân viên tiếp nhận và điều phối quản lý lịch hẹn dịch vụ và phân công kỹ thuật viên.
Nhân viên có thể tạo lịch hẹn, kiểm tra lịch làm việc và phân công kỹ thuật viên phù hợp.
Kỹ thuật viên có thể xem các lịch hẹn được giao và cập nhật trạng thái thực hiện.
Hệ thống giúp hạn chế tình trạng trùng lịch và hỗ trợ theo dõi tiến độ xử lý.
## 2. Yêu cầu môi trường
- Node.js 20 LTS
- npm
- Docker Desktop
- PostgreSQL 16 (chạy bằng Docker)
- Biến môi trường: cấu hình theo file `.env.example`
## 3. Hướng dẫn chạy

### 3.1. Yêu cầu môi trường

- Node.js và npm.
- PostgreSQL.
- Visual Studio Code hoặc trình soạn thảo mã nguồn tương đương.
- Trình duyệt web.

### 3.2. Khởi động Backend

**Bước 1:** Mở terminal tại thư mục gốc của dự án.

```powershell
cd C:\Users\USER\cdtn1-nguyenminhquan-4
```

**Bước 2:** Cài đặt các thư viện backend.

```powershell
npm install
```

**Bước 3:** Tạo file `.env` dựa trên `.env.example` và cấu hình thông tin kết nối PostgreSQL.

**Bước 4:** Khởi động backend.

```powershell
npm run dev
```

**Bước 5:** Truy cập địa chỉ sau để kiểm tra backend và kết nối cơ sở dữ liệu.

```text
http://localhost:3000/health
```

Nếu hệ thống trả về trạng thái thành công và database đã kết nối, backend đang hoạt động.

### 3.3. Khởi động Frontend

**Bước 1:** Mở một terminal mới tại thư mục gốc dự án.

**Bước 2:** Chuyển vào thư mục frontend.

```powershell
cd frontend
```

**Bước 3:** Cài đặt các thư viện frontend.

```powershell
npm install
```

**Bước 4:** Khởi động ứng dụng React.

```powershell
npm run dev
```

**Bước 5:** Mở địa chỉ localhost do Vite hiển thị trong terminal, thường là `http://localhost:5173`.

### 3.4. Chạy Unit Test

**Bước 1:** Mở terminal tại thư mục gốc dự án.

**Bước 2:** Chạy bộ kiểm thử tự động.

```powershell
npm test
```

Kết quả kiểm thử được hiển thị trực tiếp trong terminal.
## 4. Cấu trúc thư mục
docs/: Chứa tài liệu phân tích và đặc tả hệ thống.
docs/srs.md: Tài liệu đặc tả yêu cầu phần mềm, gồm User Story, Use Case, FR và NFR.
docs/ai-disclosure.md: Ghi nhận việc sử dụng công cụ AI trong quá trình thực hiện.
.env.example: Mẫu các biến môi trường cần thiết cho hệ thống.
.gitignore: Khai báo các file/thư mục không đưa lên Git.
README.md: Giới thiệu dự án, hướng dẫn chạy và trạng thái hiện tại.
- `docs/api-contract.md`: Đặc tả endpoint, Request/Response, mã HTTP và quy tắc validation.
## 5. Kiểm thử
- Unit Test: 8 test PASS, 0 test FAIL.
- Đã kiểm tra luồng tạo ticket thành công và các trường hợp dữ liệu không hợp lệ.
- Đã kiểm tra trường hợp không tìm thấy ticket.
- Kiểm thử End-to-End: tiếp tục hoàn thiện và lưu ảnh minh chứng trong docs/screenshots/.
## 6. Trạng thái hiện tại
- [x] Khởi tạo repository.
- [x] Xây dựng User Story cho luồng L4.
- [x] Xây dựng Use Case và sơ đồ Use Case.
- [x] Xây dựng tài liệu SRS.
- [x] Xây dựng bản đặc tả API Contract.
- [x] Khởi tạo và cấu hình dự án backend bằng Node.js và Express.
- [x] Thiết lập cấu hình môi trường bằng file `.env`.
- [x] Xây dựng endpoint `/` để giới thiệu trạng thái backend.
- [x] Xây dựng endpoint `/health` để kiểm tra tình trạng hoạt động và kết nối cơ sở dữ liệu.
- [x] Xây dựng tuyến API `/api/v1/tickets` cho module quản lý yêu cầu (ticket).
- [x] Xây dựng các chức năng API CRUD cho ticket.
- [x] Tích hợp PostgreSQL với backend.
- [x] Tổ chức mã nguồn backend theo cấu trúc routes, services và repositories.
- [x] Xây dựng giao diện frontend bằng React và Vite.
- [x] Xây dựng màn hình danh sách ticket.
- [x] Xây dựng màn hình chi tiết ticket.
- [x] Xây dựng màn hình tiếp nhận và tạo ticket.
- [x] Kết nối frontend với backend thông qua API.
- [x] Kiểm tra chức năng tạo phiếu tiếp nhận bảo hành.
- [x] Xây dựng Unit Test cho lớp nghiệp vụ ticket.
- [x] Kiểm thử các trường hợp tạo ticket thành công, thiếu dữ liệu, mức ưu tiên không hợp lệ, ticket không tồn tại và giá trị biên.
- [x] Chạy Unit Test thành công: 8 test PASS, 0 test FAIL.
- [x] Cập nhật tài liệu README và ghi nhận tiến độ thực hiện.
- [ ] Hoàn thiện kiểm thử toàn luồng End-to-End từ tạo ticket đến xem danh sách và chi tiết.
- [ ] Lưu ảnh minh chứng kết quả kiểm thử vào thư mục `docs/screenshots/`.
- [ ] Hoàn thiện hướng dẫn cài đặt và chạy lại hệ thống tại Mục 3 của README.
- [ ] Kiểm tra lịch sử commit, bảo đảm có ít nhất 8 commit theo quy ước Conventional Commits.
