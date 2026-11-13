# TEST PLAN
## Dự án: Phân công kỹ thuật viên và lịch hẹn
## CDTN1 - Luồng 4

### 1. Phạm vi kiểm thử

Các chức năng được kiểm thử:

- Quản lý kỹ thuật viên (Technician).
- Quản lý phiếu yêu cầu (Ticket).
- Quản lý lịch hẹn (Appointment).
- Kiểm tra phân công kỹ thuật viên.
- Kiểm tra dữ liệu đầu vào API.
- Kiểm tra tính toàn vẹn dữ liệu PostgreSQL.

Phần chủ ý không kiểm thử:
- Hiệu năng khi có hàng nghìn người dùng đồng thời.
- Kiểm thử giao diện trên tất cả trình duyệt.
- Kiểm thử bảo mật chuyên sâu.
- Các chức năng chưa triển khai trong phạm vi Luồng 4.

### 2. Loại kiểm thử và số lượng

Dự kiến thực hiện 12 test case:

- Luồng đúng: 3 test case.
- Giá trị biên: 2 test case.
- Dữ liệu sai: 3 test case.
- Bảo mật/chất lượng dữ liệu: 2 test case.
- Tái lập: 2 test case.

Kỹ thuật chọn dữ liệu:
- Phân vùng tương đương.
- Kiểm thử giá trị biên.
- Kiểm thử dữ liệu hợp lệ và không hợp lệ.
- Kiểm tra tính toàn vẹn dữ liệu.

### 3. Tiêu chí thành công

- API trả đúng HTTP Status Code.
- Dữ liệu được lưu chính xác trong PostgreSQL.
- Không tạo bản ghi khi dữ liệu không hợp lệ.
- Không cho phép phân công không phù hợp với quy tắc nghiệp vụ.
- Không phát sinh dữ liệu trùng lịch nếu nghiệp vụ không cho phép.
- Các test case có kết quả thực tế và ảnh minh chứng.
- Sau khi sửa bug, toàn bộ test tự động chạy thành công.

### 4. Môi trường và dữ liệu thử

Môi trường:
- Windows 11.
- Node.js 20 LTS.
- Express.js.
- PostgreSQL 16.
- React + Vite.
- Postman.
- Visual Studio Code.

Dữ liệu:
- Kỹ thuật viên có ID hợp lệ.
- Kỹ thuật viên không tồn tại.
- Phiếu yêu cầu hợp lệ.
- Lịch hẹn hợp lệ.
- Dữ liệu rỗng và dữ liệu sai định dạng.

Database: PostgreSQL.
