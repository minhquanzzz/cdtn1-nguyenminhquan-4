# cdtn1-nguyenminhquan-4

# Phân công kỹ thuật viên và lịch hẹn

**Sinh viên:**  

Nguyễn Minh Quân - 2273401151135 - Track SE

**Học phần:**  

Chuyên đề Tốt nghiệp 1, HK1 2026-2027

**Luồng nghiệp vụ:**  

L4 – Phân công kỹ thuật viên và lịch hẹn

## 1. Mục tiêu

Hệ thống được xây dựng nhằm hỗ trợ nhân viên quản lý các yêu cầu dịch vụ, phân công kỹ thuật viên và điều phối lịch hẹn tại trung tâm bảo hành.

Theo mục tiêu nghiệp vụ, nhân viên có thể tiếp nhận yêu cầu, tạo lịch hẹn, kiểm tra lịch làm việc và phân công kỹ thuật viên phù hợp.

Kỹ thuật viên có thể xem các lịch hẹn được giao và cập nhật trạng thái thực hiện. Hệ thống hướng đến việc hạn chế tình trạng trùng lịch, phân bổ công việc hợp lý và hỗ trợ theo dõi tiến độ xử lý.

**Phạm vi đã hiện thực hóa trong phiên bản hiện tại:**

- Xây dựng module quản lý Ticket.

- Thực hiện các chức năng thêm, xem danh sách, xem chi tiết, cập nhật và xóa Ticket.

- Kiểm tra dữ liệu đầu vào theo các quy tắc nghiệp vụ.

- Xây dựng giao diện danh sách, tiếp nhận và chi tiết Ticket.

**Lưu ý:** Chức năng quản lý kỹ thuật viên, phân công kỹ thuật viên và quản lý lịch hẹn vẫn đang trong quá trình phát triển.

## 2. Yêu cầu môi trường

- Node.js 20 LTS.

- npm.

- Docker Desktop.

- PostgreSQL 16 (chạy bằng Docker).

- Visual Studio Code hoặc trình soạn thảo mã nguồn tương đương.

- Trình duyệt web.

- Biến môi trường: cấu hình theo file `.env.example`.

## 3. Hướng dẫn chạy

### 3.1. Yêu cầu môi trường

- Node.js và npm.

- PostgreSQL.

- Visual Studio Code hoặc trình soạn thảo mã nguồn tương đương.

- Trình duyệt web.

### 3.2. Khởi động Backend

**Bước 1:** Mở Terminal tại thư mục gốc của dự án.

```powershell

cd C:\Users\USER\cdtn1-nguyenminhquan-4

```

**Bước 2:** Cài đặt các thư viện Backend.

```powershell

npm install

```

**Bước 3:** Tạo file `.env` dựa trên `.env.example` và cấu hình thông tin kết nối PostgreSQL.

**Bước 4:** Khởi động Backend.

```powershell

npm run dev

```

**Bước 5:** Truy cập địa chỉ sau để kiểm tra Backend và kết nối cơ sở dữ liệu.

```text

http://localhost:3000/health

```

Nếu hệ thống trả về trạng thái thành công và kết nối cơ sở dữ liệu hoạt động bình thường, Backend đã được khởi động thành công.

### 3.3. Khởi động Frontend

**Bước 1:** Mở một Terminal mới tại thư mục gốc dự án.

**Bước 2:** Chuyển vào thư mục Frontend.

```powershell

cd frontend

```

**Bước 3:** Cài đặt các thư viện Frontend.

```powershell

npm install

```

**Bước 4:** Khởi động ứng dụng React.

```powershell

npm run dev

```

**Bước 5:** Mở địa chỉ localhost do Vite hiển thị trong Terminal, thông thường là:

```text

http://localhost:5173

```

### 3.4. Chạy Unit Test

**Bước 1:** Mở Terminal tại thư mục gốc dự án.

**Bước 2:** Chạy bộ kiểm thử tự động.

```powershell

npm test

```

Các trường hợp kiểm thử được xây dựng bằng `node:test` và `node:assert/strict`, tập trung vào module `ticket.service.js`.

Kết quả kiểm thử được hiển thị trực tiếp trong Terminal.

## 4. Cấu trúc thư mục

```text

cdtn1-nguyenminhquan-4/

│

├── src/

│   ├── routes/

│   │   └── ticket.routes.js

│   ├── services/

│   │   └── ticket.service.js

│   ├── repositories/

│   │   └── ticket.repository.js

│   ├── config/

│   │   └── database.js

│   └── app.js

│

├── frontend/

│   └── src/

│       ├── components/

│       ├── pages/

│       │   ├── TicketList.jsx

│       │   ├── TicketDetail.jsx

│       │   └── TicketReceive.jsx

│       ├── services/

│       ├── App.jsx

│       └── App.css

│

├── tests/

│   └── ticket.service.test.js

│

├── docs/

│   ├── srs.md

│   ├── ai-disclosure.md

│   └── api-contract.md

│

├── .env.example

├── .gitignore

├── package.json

├── package-lock.json

└── README.md

```

**Mô tả các thư mục và tập tin:**

- `src/routes/`: Chứa các tuyến API của hệ thống.

- `src/services/`: Chứa logic nghiệp vụ và xử lý dữ liệu.

- `src/repositories/`: Chứa các thao tác truy xuất cơ sở dữ liệu.

- `src/config/`: Chứa cấu hình kết nối cơ sở dữ liệu.

- `frontend/`: Chứa mã nguồn giao diện người dùng React.

- `frontend/src/pages/`: Chứa các màn hình danh sách, chi tiết và tiếp nhận Ticket.

- `frontend/src/components/`: Chứa các thành phần giao diện dùng chung.

- `frontend/src/services/`: Chứa các chức năng giao tiếp với Backend.

- `tests/`: Chứa các file kiểm thử tự động.

- `docs/`: Chứa tài liệu phân tích, thiết kế và đặc tả hệ thống.

- `docs/srs.md`: Tài liệu đặc tả yêu cầu phần mềm, gồm User Story, Use Case, FR và NFR.

- `docs/ai-disclosure.md`: Ghi nhận việc sử dụng công cụ AI trong quá trình thực hiện.

- `docs/api-contract.md`: Đặc tả endpoint, Request/Response, mã HTTP và quy tắc validation.

- `.env.example`: Mẫu các biến môi trường cần thiết cho hệ thống.

- `.gitignore`: Khai báo các file và thư mục không đưa lên Git.

- `README.md`: Giới thiệu dự án, hướng dẫn cài đặt, chạy hệ thống và trạng thái hiện tại.

## 5. Kiểm thử

- Công cụ kiểm thử: `node:test` và `node:assert/strict`.

- Số lượng: 6 test case được xây dựng trong `tests/ticket.service.test.js`.

- Kiểm tra luồng tạo Ticket thành công với dữ liệu hợp lệ.

- Kiểm tra trường hợp thiếu trường bắt buộc.

- Kiểm tra mức độ ưu tiên không hợp lệ.

- Kiểm tra trường hợp không tìm thấy Ticket.

- Kiểm tra trường hợp xóa Ticket không tồn tại.

- Kiểm tra giá trị biên với `customer_id = 0`.

- Repository được giả lập (Mock) nhằm kiểm tra riêng logic nghiệp vụ tại tầng Service.

**Chạy kiểm thử:**

```powershell

npm test

```

Kết quả PASS/FAIL được cập nhật sau khi thực hiện lệnh kiểm thử thực tế.

Kiểm thử End-to-End toàn bộ quy trình từ tạo Ticket đến xem danh sách và chi tiết vẫn cần tiếp tục hoàn thiện.

## 6. Trạng thái hiện tại

### 6.1. Các công việc đã hoàn thành

- [x] Khởi tạo repository.

- [x] Xây dựng User Story cho luồng L4.

- [x] Xây dựng Use Case và sơ đồ Use Case.

- [x] Xây dựng tài liệu SRS.

- [x] Xây dựng bản đặc tả API Contract.

- [x] Khởi tạo và cấu hình dự án Backend bằng Node.js và Express.

- [x] Thiết lập cấu hình môi trường bằng file `.env`.

- [x] Xây dựng endpoint `/` để giới thiệu trạng thái Backend.

- [x] Xây dựng endpoint `/health` để kiểm tra tình trạng hoạt động và kết nối cơ sở dữ liệu.

- [x] Xây dựng tuyến API `/api/v1/tickets` cho module quản lý Ticket.

- [x] Xây dựng các chức năng API CRUD cho Ticket.

- [x] Tích hợp PostgreSQL với Backend.

- [x] Tổ chức mã nguồn Backend theo cấu trúc Routes, Services và Repositories.

- [x] Xây dựng giao diện Frontend bằng React và Vite.

- [x] Xây dựng màn hình danh sách Ticket.

- [x] Xây dựng màn hình chi tiết Ticket.

- [x] Xây dựng màn hình tiếp nhận và tạo Ticket.

- [x] Kết nối Frontend với Backend thông qua API.

- [x] Kiểm tra chức năng tạo phiếu tiếp nhận bảo hành.

- [x] Xây dựng Unit Test cho lớp nghiệp vụ Ticket.

- [x] Xây dựng 6 trường hợp kiểm thử gồm luồng thành công, thiếu dữ liệu, mức ưu tiên không hợp lệ, Ticket không tồn tại và giá trị biên.

- [x] Cập nhật tài liệu README và ghi nhận tiến độ thực hiện.

