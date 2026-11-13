
# TEST REPORT
## Dự án: Phân công kỹ thuật viên và lịch hẹn (Luồng 4)

- Môn học: Chuyên đề tốt nghiệp 1
- Track: SE
- Sinh viên: Nguyễn Minh Quân
- Repository: https://github.com/minhquanzzz/cdtn1-nguyenminhquan-4
- Môi trường: Node.js, Express, PostgreSQL
- Công cụ kiểm thử: Postman, VS Code, PostgreSQL

---

## 1. Mục tiêu kiểm thử

Kiểm tra tính chính xác và ổn định của các chức năng API trong hệ thống, bao gồm:
- Kiểm tra trạng thái hoạt động của backend.
- Kiểm tra chức năng quản lý phiếu bảo hành (Ticket).
- Kiểm tra dữ liệu đầu vào không hợp lệ.
- Kiểm tra tính toàn vẹn dữ liệu trong PostgreSQL.
- Kiểm tra khả năng tái lập môi trường hệ thống.

## 2. Danh sách Test Case

| ID | Use Case | Mục tiêu kiểm thử | Tiền điều kiện | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Ưu tiên / Trạng thái |
|---|---|---|---|---|---|---|---|
| TC-01 | UC-01 | Kiểm tra API Health | Backend đang chạy | 1. Mở Postman. 2. GET /health. 3. Gửi request. | HTTP 200, API phản hồi thành công. | Chưa chạy. | Cao / Chưa chạy |
| TC-02 | UC-Ticket | Lấy danh sách Ticket | Database có dữ liệu | 1. GET /api/v1/tickets. 2. Gửi request. 3. Kiểm tra JSON trả về. | HTTP 200, danh sách phiếu trả về đúng dữ liệu CSDL. | Chưa chạy. | Cao / Chưa chạy |
| TC-03 | UC-Ticket | Tạo Ticket hợp lệ | Backend và database hoạt động | 1. POST endpoint tạo Ticket. 2. Nhập đầy đủ dữ liệu hợp lệ. 3. Gửi request. | Tạo thành công, dữ liệu được lưu vào PostgreSQL. | Chưa chạy. | Cao / Chưa chạy |
| TC-04 | UC-Ticket | Cập nhật Ticket | Có Ticket tồn tại | 1. PUT endpoint cập nhật Ticket. 2. Thay đổi thông tin hợp lệ. 3. Gửi request. | Cập nhật thành công, dữ liệu mới được lưu. | Chưa chạy. | Cao / Chưa chạy |
| TC-05 | UC-Ticket | Xóa Ticket | Có Ticket phù hợp để xóa | 1. DELETE endpoint Ticket. 2. Nhập ID hợp lệ. 3. Gửi request. | Xóa thành công theo quy tắc nghiệp vụ; dữ liệu phản ánh đúng trong CSDL. | Chưa chạy. | Cao / Chưa chạy |
| TC-06 | UC-Ticket | Kiểm tra ID bằng 0 | Backend đang chạy | 1. GET Ticket theo ID. 2. Nhập ID = 0. 3. Gửi request. | API từ chối ID không hợp lệ hoặc trả về 404 theo đặc tả. | Chưa chạy. | Trung bình / Chưa chạy |
| TC-07 | UC-Ticket | Kiểm tra ID không tồn tại | Database không có ID được thử | 1. GET Ticket theo ID không tồn tại. 2. Gửi request. | Trả về HTTP 404, không phát sinh lỗi 500. | Chưa chạy. | Cao / Chưa chạy |
| TC-08 | UC-Ticket | Kiểm tra trường bắt buộc bị thiếu | Backend đang chạy | 1. POST tạo Ticket. 2. Bỏ trống một trường bắt buộc. 3. Gửi request. | Trả về lỗi 400 hoặc 422 theo đặc tả, thông báo rõ trường thiếu; không tạo bản ghi. | Chưa chạy. | Cao / Chưa chạy |
| TC-09 | UC-Ticket | Kiểm tra sai kiểu dữ liệu | Backend đang chạy | 1. POST tạo Ticket. 2. Nhập sai kiểu dữ liệu cho trường cần kiểm tra. 3. Gửi request. | API từ chối dữ liệu không hợp lệ; không làm hệ thống bị lỗi 500. | Chưa chạy. | Cao / Chưa chạy |
| TC-10 | UC-Ticket | Kiểm tra dữ liệu đầu vào bất thường | Backend đang chạy | 1. Nhập chuỗi thử nghiệm SQL như ' OR '1'='1 vào trường văn bản. 2. Gửi request. 3. Kiểm tra phản hồi và CSDL. | Dữ liệu không được thực thi như câu lệnh SQL; hệ thống xử lý an toàn. | Chưa chạy. | Cao / Chưa chạy |
| TC-11 | UC-Ticket | Kiểm tra tính toàn vẹn dữ liệu | Có thể kiểm tra dữ liệu trước và sau thao tác | 1. Ghi nhận số lượng Ticket. 2. Gửi request tạo Ticket với dữ liệu không hợp lệ. 3. Kiểm tra lại CSDL. | Request thất bại, số lượng bản ghi không tăng và không phát sinh dữ liệu sai. | Chưa chạy. | Cao / Chưa chạy |
| TC-12 | UC-System | Kiểm tra khả năng tái lập | Có migration và seed script | 1. Chạy migration. 2. Chạy seed. 3. Chạy lại theo quy trình. 4. Kiểm tra CSDL. | Quy trình chạy lại theo thiết kế, không gây lỗi hoặc nhân đôi dữ liệu ngoài dự kiến. | Chưa chạy. | Trung bình / Chưa chạy |

**Lưu ý:** Các endpoint chi tiết của Ticket (GET theo ID, POST, PUT, DELETE) cần đối chiếu với `src/routes/ticket.routes.js`. Chỉ chạy test khi endpoint tương ứng đã được triển khai.

## 3. Tổng hợp kết quả kiểm thử

| Nội dung | Kết quả |
|---|---|
| Tổng số Test Case thiết kế | 12 |
| Số Test Case đã chạy | 0 |
| Số Test Case PASS | 0 |
| Số Test Case FAIL | 0 |
| Số Test Case chưa chạy | 12 |
| Số Test Case có ảnh minh chứng | 0 |

## 4. Đánh giá

Các Test Case được xây dựng nhằm đánh giá hoạt động của API, khả năng xử lý dữ liệu đầu vào, tính toàn vẹn dữ liệu và khả năng tái lập hệ thống.

Kết quả PASS/FAIL sẽ được cập nhật sau khi thực hiện kiểm thử thực tế. Các lỗi phát hiện trong quá trình kiểm thử sẽ được ghi nhận trong Bug Log và tiến hành sửa chữa.

## 5. Ảnh minh chứng

Ảnh chụp kết quả kiểm thử được lưu tại:

docs/screenshots/

Danh sách ảnh:
- TC-01.png
- TC-02.png
- TC-03.png
- TC-04.png
- TC-05.png
- TC-06.png
- TC-07.png
- TC-08.png
- TC-09.png
- TC-10.png
- TC-11.png
- TC-12.png
