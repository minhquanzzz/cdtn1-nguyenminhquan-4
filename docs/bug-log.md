# BUG LOG – NHẬT KÝ PHÁT HIỆN VÀ SỬA LỖI

- Học phần: Chuyên đề tốt nghiệp 1
- Track: Software Engineering (SE)
- Luồng 4: Phân công kỹ thuật viên và lên lịch hẹn
- Phiên bản mục tiêu: v1.0

## 1. Bảng tổng quan lỗi

| Mã lỗi | Tên lỗi | Mức độ | Test Case | Trạng thái |
|---|---|---|---|---|
| BUG-001 | Thiếu kiểm soát truy cập tại các API nghiệp vụ | Critical | TC11 | Open |
| BUG-002 | Thông tin người thực hiện phân công không được xác thực | Major | TC03 | Open |
| BUG-003 | Không thể chạy bộ kiểm thử trong Docker Container | Major | TC12 | Open |

---

## 2. Chi tiết các lỗi

### BUG-001: Thiếu kiểm soát truy cập tại các API nghiệp vụ

**1. Mã lỗi và mức độ (Bug ID & Severity)**

- Bug ID: BUG-001
- Severity: Critical
- Module: Authentication & Authorization
- Status: Open

**2. Test case phát hiện (Detected by)**

- TC11 – Security Testing.
- Kiểm tra quyền truy cập vào các API nghiệp vụ
  khi người dùng chưa đăng nhập.

**3. Triệu chứng (Symptom)**

Qua quá trình rà soát mã nguồn, một số API quản lý
phiếu yêu cầu, kỹ thuật viên, tay nghề kỹ thuật viên
và lịch hẹn chưa được áp dụng middleware xác thực.

Điều này có thể cho phép người dùng chưa đăng nhập
truy cập hoặc thay đổi dữ liệu nghiệp vụ của hệ thống.

**4. Cách tái lập (Steps to Reproduce)**

1. Khởi động hệ thống bằng Docker Compose.
2. Mở Postman.
3. Gửi GET request đến endpoint /api/v1/tickets.
4. Không cung cấp Authorization Bearer Token.
5. Quan sát HTTP Status Code và Response Body.

Expected Result:
- Hệ thống trả về HTTP 401 Unauthorized.
- Không cung cấp dữ liệu nghiệp vụ.

Actual Result:
- Chưa xác nhận bằng kiểm thử thực tế.

**5. Nguyên nhân gốc rễ (Root Cause)**

Trong file src/app.js, middleware authMiddleware
chỉ được áp dụng cho assignmentRoutes.

Các route ticketRoutes, appointmentRoutes,
technicianRoutes và technicianSkillRoutes chưa
được áp dụng middleware xác thực tương ứng.

Việc thiếu middleware dẫn đến các request có thể
được chuyển trực tiếp đến route handler mà không
kiểm tra danh tính và quyền hạn của người dùng.

**6. Cách sửa lỗi (Resolution)**

- Bổ sung authMiddleware vào các API nghiệp vụ
  cần được bảo vệ trong file src/app.js.
- Kiểm tra JWT trước khi xử lý request.
- Kiểm tra quyền ADMIN của người dùng.
- Cập nhật frontend để gửi Authorization Bearer Token
  khi gọi các API được bảo vệ.
- Giữ nguyên endpoint đăng nhập và health check
  để có thể truy cập mà không cần xác thực.

Files affected:
- src/app.js
- Các file gọi API tương ứng trong frontend/src/

**7. Commit và xác nhận (Commit & Verification)**

- Commit message:
  fix(auth): protect business API routes

- Commit URL: Pending.
- Retest: TC11.
- Expected result: HTTP 401 đối với request không có JWT
  và HTTP 403 đối với tài khoản không đủ quyền.
- Verification status: Pending.

---

### BUG-002: Thông tin người thực hiện phân công không được xác thực

**1. Mã lỗi và mức độ (Bug ID & Severity)**

- Bug ID: BUG-002
- Severity: Major
- Module: Technician Assignment & Audit Log
- Status: Open

**2. Test case phát hiện (Detected by)**

- TC03 – Functional Testing.
- Kiểm tra chức năng phân công kỹ thuật viên và
  tính chính xác của lịch sử thay đổi trạng thái.

**3. Triệu chứng (Symptom)**

Thông tin người thực hiện phân công được lấy từ
trường changed_by trong request body do client gửi lên.

Điều này có thể khiến lịch sử thay đổi trạng thái
của phiếu yêu cầu ghi nhận sai người thực hiện,
ảnh hưởng đến tính chính xác và khả năng truy vết
của dữ liệu nghiệp vụ.

**4. Cách tái lập (Steps to Reproduce)**

1. Khởi động hệ thống.
2. Đăng nhập bằng tài khoản ADMIN trên môi trường test.
3. Thực hiện test phân công kỹ thuật viên TC03.
4. Kiểm tra thông tin người thực hiện trong request.
5. Đối chiếu danh tính tài khoản đang đăng nhập với
   trường changed_by trong bảng ticket_status_log.

Expected Result:
- changed_by phải tương ứng với ID của người dùng
  đã được xác thực thông qua JWT.

Actual Result:
- Chưa xác nhận bằng kiểm thử thực tế.

**5. Nguyên nhân gốc rễ (Root Cause)**

Trong file src/routes/assignment.routes.js,
route handler truyền trực tiếp req.body vào
hàm service.assign().

Hệ thống chưa sử dụng thông tin danh tính đã được
xác thực thông qua JWT để xác định người thực hiện
nghiệp vụ phân công.

Do đó, dữ liệu changed_by đang phụ thuộc vào
dữ liệu được cung cấp từ phía client.

**6. Cách sửa lỗi (Resolution)**

- Lấy ID của người dùng từ thông tin JWT đã xác thực.
- Sử dụng req.user thay cho dữ liệu danh tính
  được cung cấp từ request body.
- Truyền ID người dùng đã xác thực vào assignment service.
- Đảm bảo lịch sử trạng thái ghi nhận đúng người
  thực hiện nghiệp vụ phân công.
- Kiểm tra lại dữ liệu trong bảng ticket_status_log
  sau khi thực hiện phân công.

Files affected:
- src/routes/assignment.routes.js

**7. Commit và xác nhận (Commit & Verification)**

- Commit message:
  fix(assignment): derive audit actor from JWT

- Commit URL: Pending.
- Retest: TC03.
- Expected result: changed_by luôn tương ứng với
  ID của tài khoản đã được xác thực.
- Verification status: Pending.

---

### BUG-003: Không thể chạy bộ kiểm thử trong Docker Container

**1. Mã lỗi và mức độ (Bug ID & Severity)**

- Bug ID: BUG-003
- Severity: Major
- Module: Docker Packaging & Automated Testing
- Status: Open

**2. Test case phát hiện (Detected by)**

- TC12 – Reproducibility Testing (mở rộng).
- Kiểm tra khả năng chạy bộ kiểm thử tự động
  trong môi trường Docker Container.

**3. Triệu chứng (Symptom)**

Docker image của backend chưa bao gồm thư mục tests.

Điều này có thể khiến bộ kiểm thử tự động không
được tìm thấy khi thực hiện lệnh npm test bên trong
backend container.

Vấn đề ảnh hưởng đến khả năng tái lập môi trường
kiểm thử và quá trình bàn giao prototype cho
người tiếp nhận hệ thống.

**4. Cách tái lập (Steps to Reproduce)**

1. Mở terminal tại thư mục gốc của dự án.
2. Build và khởi động hệ thống bằng lệnh:

   docker compose up -d --build

3. Kiểm tra trạng thái các container:

   docker compose ps -a

4. Chạy bộ kiểm thử trong backend container:

   docker compose exec backend npm test

5. Quan sát kết quả kiểm thử.

Expected Result:
- Node.js Test Runner tìm thấy các file kiểm thử.
- Toàn bộ test case được thực thi.
- Kết quả kiểm thử được hiển thị trên terminal.

Actual Result:
- Chưa xác nhận bằng kiểm thử thực tế.

**5. Nguyên nhân gốc rễ (Root Cause)**

Trong Dockerfile của backend, quá trình build image
chỉ sao chép package.json, package-lock.json,
thư mục src và thư mục scripts.

Thư mục tests chưa được sao chép vào Docker image.

Do đó, môi trường bên trong container không chứa
đầy đủ mã nguồn kiểm thử tự động của dự án.

**6. Cách sửa lỗi (Resolution)**

- Bổ sung lệnh COPY tests ./tests vào Dockerfile.
- Kiểm tra cấu hình .dockerignore để đảm bảo
  thư mục tests không bị loại bỏ khỏi build context.
- Build lại Docker image.
- Khởi động lại backend container.
- Chạy lại bộ kiểm thử tự động.
- Kiểm tra số lượng test case và kết quả PASS/FAIL.

Files affected:
- Dockerfile

**7. Commit và xác nhận (Commit & Verification)**

- Commit message:
  fix(docker): include automated test files

- Commit URL: Pending.
- Retest: TC12 (mở rộng).
- Verification command:

  docker compose exec backend npm test

- Expected result: Toàn bộ file kiểm thử được tìm
  thấy và thực thi thành công trong container.
- Verification status: Pending.

---

## 3. Tổng kết

| Mức độ | Số lượng lỗi |
|---|---:|
| Critical | 1 |
| Major | 2 |
| Minor | 0 |
| Tổng cộng | 3 |

| Trạng thái | Số lượng |
|---|---:|
| Open | 3 |
| Fixed | 0 |
| Verified | 0 |

Các lỗi được ghi nhận thông qua quá trình rà soát
mã nguồn và cấu hình hệ thống.

Sau khi thực hiện sửa lỗi, các test case liên quan
cần được chạy lại nhằm xác nhận lỗi đã được xử lý
và không ảnh hưởng đến các chức năng hiện có.

Mỗi lỗi chỉ được chuyển sang trạng thái Closed
khi có commit sửa lỗi và kết quả retest thành công.
