# TEST PLAN
## CDTN1 - L4: Phân công kỹ thuật viên và Lên lịch hẹn (Technician Assignment and Appointment Scheduling)

### 1. Phạm vi và Các phần loại trừ (Scope and Exclusions)

**Phạm vi trong kiểm thử (In Scope):**
- Tạo, xác thực và truy vấn phiếu yêu cầu (Ticket).
- Quản lý kỹ thuật viên và xác thực kỹ năng kỹ thuật viên.
- Tạo, cập nhật, hủy và xóa lịch hẹn.
- Gợi ý kỹ thuật viên dựa trên kỹ năng, trung tâm dịch vụ và khối lượng công việc.
- Phân công kỹ thuật viên và phòng ngừa xung đột lịch hẹn.
- Cập nhật trạng thái phiếu và ghi nhận lịch sử trạng thái.
- Xác thực dữ liệu đầu vào API và xử lý lỗi.

**Phạm vi ngoài kiểm thử (Out of Scope):**
- Kiểm thử giao diện và độ khả dụng của Frontend UI.
- Kiểm thử hiệu năng dưới lưu lượng truy cập đồng thời quy mô lớn.
- Kiểm thử tích hợp dịch vụ bên thứ ba.
- Kiểm thử triển khai trên môi trường Production.

### 2. Loại kiểm thử và Chiến lược (Test Types and Strategy)

| Loại kiểm thử | Mô tả |
|---|---|
| Kiểm thử đơn vị (Unit Testing) | Xác thực các quy tắc nghiệp vụ ở tầng service sử dụng công cụ chạy test của Node.js. |
| Kiểm thử API (API Testing) | Xác thực phương thức HTTP, mã phản hồi và dữ liệu phản hồi sử dụng Postman. |
| Kiểm thử biên (Boundary Testing) | Kiểm tra các ID không hợp lệ, thiếu trường dữ liệu và thời gian đặt lịch không hợp lệ. |
| Kiểm thử âm tính (Negative Testing) | Xác thực việc từ chối dữ liệu đầu vào không hợp lệ và tài nguyên không khả dụng. |
| Kiểm thử tích hợp (Integration Testing) | Xác thực sự tương tác giữa các service và PostgreSQL. |
| Kiểm thử hồi quy (Regression Testing) | Chạy lại các bài test hiện có sau khi thay đổi mã nguồn. |

Cơ sở kiểm thử tự động hiện tại:
- Phiếu (Ticket): 6 bài test service.
- Lịch hẹn (Appointment): 8 bài test service.
- Phân công (Assignment): 8 bài test service.
- Bài test cơ bản (Basic tests): 2 bài test.
- Tổng cộng: 24 bài test.

### 3. Tiêu chí thành công (Success Criteria)

- Tất cả các bài test tự động đều vượt qua (pass).
- Dữ liệu đầu vào không hợp lệ bị từ chối với mã trạng thái HTTP phù hợp.
- Các bản ghi bị thiếu trả về mã HTTP 404 thay vì HTTP 500.
- Kỹ thuật viên phải thuộc cùng trung tâm dịch vụ với phiếu yêu cầu.
- Kỹ thuật viên phải có đủ năng lực/trình độ chuyên môn cho danh mục phiếu yêu cầu.
- Kỹ thuật viên không hoạt động (inactive) không được phép phân công.
- Các lịch hẹn bị trùng lặp phải bị từ chối.
- Giao dịch phân công thất bại không được để lại các cập nhật cơ sở dữ liệu dở dang (partial updates).
- Kết quả kiểm thử phải có khả năng tái lập và được hỗ trợ bằng ảnh chụp màn hình.

### 4. Môi trường kiểm thử và Dữ liệu kiểm thử (Test Environment and Test Data)

**Môi trường (Environment):**
- Hệ điều hành: Windows.
- Môi trường thực thi: Node.js.
- Backend: Express.js.
- Cơ sở dữ liệu: PostgreSQL.
- Môi trường cơ sở dữ liệu: Docker Desktop.
- Công cụ kiểm thử API: Postman.
- Kiểm thử tự động: Công cụ chạy test tích hợp sẵn của Node.js.
- Môi trường phát triển (IDE): Visual Studio Code.

**Dữ liệu kiểm thử (Test Data):**
- Các phiếu yêu cầu có ID hợp lệ và không hợp lệ.
- Kỹ thuật viên với các cấp độ kỹ năng khác nhau.
- Kỹ thuật viên từ các trung tâm dịch vụ khác nhau.
- Kỹ thuật viên đang hoạt động và không hoạt động.
- Lịch hẹn với khoảng thời gian hợp lệ, không hợp lệ và trùng lặp.
- Yêu cầu phân công hợp lệ và không hợp lệ.

**Lệnh thực thi kiểm thử (Test Execution Command):**

```bash
npm test