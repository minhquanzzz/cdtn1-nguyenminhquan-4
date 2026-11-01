
# GHI NHẬN THAY ĐỔI THIẾT KẾ

## 1. Thông tin chung

- Học phần: Chuyên đề Tốt nghiệp 1, HK1 2026-2027
- Track: SE (Software Engineering)
- Luồng nghiệp vụ: L4 – Phân công kỹ thuật viên và lịch hẹn
- Họ và tên: Nguyễn Minh Quân
- MSSV: 2273401151135
- Repository: https://github.com/minhquanzzz/cdtn1-nguyenminhquan-4

## 2. Thiết kế ban đầu trong BT1

Trong Bài tập 1 (BT1), hệ thống được phân tích và thiết kế theo nghiệp vụ phân công kỹ thuật viên và quản lý lịch hẹn giao – nhận thiết bị.

Mô hình dữ liệu được xây dựng với 5 bảng chính:

| STT | Bảng | Vai trò |
|---|---|---|
| 1 | `ticket` | Lưu thông tin phiếu bảo hành, tình trạng xử lý và kỹ thuật viên được phân công. |
| 2 | `technician` | Lưu thông tin kỹ thuật viên, trung tâm làm việc và trạng thái hoạt động. |
| 3 | `technician_skill` | Lưu kỹ năng và mức độ thành thạo của kỹ thuật viên theo nhóm sự cố. |
| 4 | `appointment` | Lưu thông tin lịch hẹn giao – nhận thiết bị và kỹ thuật viên phụ trách. |
| 5 | `ticket_status_log` | Lưu lịch sử thay đổi trạng thái của phiếu bảo hành. |

Các thành phần thiết kế quan trọng đã có trong BT1:

- Bảng `ticket` có khóa chính, mã Ticket, thông tin khách hàng, thiết bị, trung tâm, mức độ ưu tiên, trạng thái và kỹ thuật viên phụ trách.
- Bảng `technician_skill` sử dụng khóa chính kết hợp `technician_id` và `category_id`.
- Bảng `technician_skill` có ràng buộc CHECK để giới hạn `proficiency` trong khoảng từ 1 đến 5.
- Bảng `appointment` có các trường `scheduled_start`, `scheduled_end` và `created_at`.
- Bảng `appointment` có ràng buộc CHECK nhằm bảo đảm thời gian kết thúc sau thời gian bắt đầu khi cả hai giá trị được cung cấp.
- Bảng `ticket_status_log` lưu trạng thái trước, trạng thái sau, thời điểm thay đổi, người thực hiện và ghi chú.

## 3. Bảng ghi nhận thay đổi từ BT1 sang BT2

| STT | Thành phần | Nội dung điều chỉnh | Lý do |
|---|---|---|---|
| 1 | Backend | Chuyển từ thiết kế nghiệp vụ sang xây dựng Backend bằng Node.js và Express.js. | Hiện thực hóa các chức năng của hệ thống thành API có thể sử dụng. |
| 2 | Kiến trúc Backend | Tổ chức mã nguồn theo ba tầng Routes, Services và Repositories. | Tách biệt định tuyến API, xử lý nghiệp vụ và truy xuất dữ liệu, giúp mã nguồn dễ bảo trì. |
| 3 | Module Ticket | Hiện thực hóa các chức năng thêm, xem danh sách, xem chi tiết, cập nhật và xóa Ticket. | Triển khai module cốt lõi để quản lý phiếu bảo hành. |
| 4 | Logic nghiệp vụ Ticket | Bổ sung kiểm tra trường bắt buộc, định dạng ID, mức độ ưu tiên và kiểu dữ liệu. | Hạn chế dữ liệu không hợp lệ trước khi lưu vào cơ sở dữ liệu. |
| 5 | Logic nghiệp vụ Ticket | Bổ sung cơ chế sinh mã Ticket tự động theo định dạng `TK-L4-` kèm 12 ký tự thập lục phân viết hoa. | Tạo mã định danh dễ nhận biết cho từng phiếu. |
| 6 | Logic nghiệp vụ Ticket | Bổ sung cách xác định `due_date` theo mức độ ưu tiên: HIGH là 3 ngày, MEDIUM là 5 ngày và LOW là 7 ngày. | Hỗ trợ xác định thời hạn xử lý dự kiến của phiếu. |
| 7 | Frontend | Xây dựng giao diện bằng React và Vite, gồm màn hình danh sách, tiếp nhận và chi tiết Ticket. | Cung cấp giao diện để người dùng thao tác với module Ticket. |
| 8 | Kết nối hệ thống | Kết nối Frontend với Backend thông qua API và tích hợp PostgreSQL. | Hoàn thiện luồng trao đổi dữ liệu giữa giao diện, máy chủ và cơ sở dữ liệu. |
| 9 | Kiểm thử | Bổ sung các trường hợp Unit Test cho `ticket.service.js`. | Kiểm tra logic tạo Ticket, dữ liệu không hợp lệ và trường hợp không tìm thấy Ticket. |
| 10 | Tài liệu | Cập nhật README, hướng dẫn cài đặt và ghi nhận tiến độ triển khai. | Giúp người khác có thể hiểu và dựng lại hệ thống theo hướng dẫn. |

## 4. Các thiết kế được giữ nguyên từ BT1

Các thành phần dữ liệu dưới đây tiếp tục được giữ trong định hướng thiết kế của hệ thống:

### 4.1. Bảng ticket

Bảng `ticket` tiếp tục giữ vai trò trung tâm, lưu thông tin phiếu bảo hành, mức độ ưu tiên, trạng thái xử lý, thời gian tiếp nhận, hạn cam kết và kỹ thuật viên được phân công.

Trong BT2, module Ticket đã được hiện thực hóa với các chức năng CRUD.

### 4.2. Bảng technician và technician_skill

Hai bảng tiếp tục được giữ theo thiết kế BT1 để phục vụ nghiệp vụ quản lý kỹ thuật viên và đánh giá kỹ năng chuyên môn.

Các chức năng quản lý kỹ thuật viên và phân công dựa trên kỹ năng chưa được triển khai trong phạm vi hiện tại.

### 4.3. Bảng appointment

Bảng `appointment` tiếp tục được giữ theo thiết kế BT1, bao gồm thông tin Ticket, kỹ thuật viên, trạng thái và thời gian lịch hẹn.

Các trường `scheduled_start`, `scheduled_end`, `created_at` và ràng buộc kiểm tra thời gian đã có trong DDL của BT1, không phải thay đổi mới của BT2.

Chức năng tạo lịch hẹn và kiểm tra trùng lịch chưa được hiện thực hóa.

### 4.4. Bảng ticket_status_log

Bảng `ticket_status_log` tiếp tục được giữ theo thiết kế BT1 nhằm lưu lịch sử thay đổi trạng thái phiếu bảo hành.

Chức năng tự động ghi nhận lịch sử trạng thái chưa được triển khai trong module Ticket hiện tại.

## 5. Các điểm cần xác nhận và hoàn thiện

| STT | Nội dung | Hiện trạng | Công việc cần thực hiện |
|---|---|---|---|
| 1 | Quan hệ `ticket` và `appointment` | DDL hiện tại cho phép một Ticket có nhiều bản ghi lịch hẹn vì `ticket_id` chưa có ràng buộc UNIQUE trong bảng `appointment`. | Xác nhận nghiệp vụ có cho phép một Ticket có nhiều lịch hẹn hay không. |
| 2 | Khóa ngoại `changed_by` | DDL BT1 có khai báo `changed_by`, nhưng khóa ngoại tham chiếu `employee` đang được ghi chú để bổ sung sau. | Xác nhận bảng `employee` và bổ sung khóa ngoại khi có bảng tương ứng. |
| 3 | Thời gian lịch hẹn | `scheduled_start` và `scheduled_end` hiện cho phép NULL. Ràng buộc CHECK chỉ kiểm tra thứ tự thời gian khi cả hai giá trị được cung cấp. | Xác nhận thời gian lịch hẹn có bắt buộc hay không. |
| 4 | Kiểm tra trùng lịch | BT1 xác định yêu cầu không cho phép hai lịch hẹn trùng khung thời gian của cùng một kỹ thuật viên. | Xây dựng và kiểm thử quy tắc kiểm tra trùng lịch khi triển khai module Appointment. |
| 5 | Lịch sử trạng thái | Đã có thiết kế bảng `ticket_status_log` trong BT1. | Bổ sung xử lý ghi log khi trạng thái Ticket thay đổi. |
| 6 | Thời hạn xử lý | BT2 đã bổ sung logic xác định `due_date` theo mức độ ưu tiên trong Ticket Service. | Đối chiếu các mốc 3, 5 và 7 ngày với quy tắc nghiệp vụ chính thức của case study. |

## 6. Phạm vi hiện thực hóa trong BT2

Trong BT2, hệ thống tập trung hiện thực hóa module quản lý Ticket.

Các chức năng đã triển khai:

- API tạo Ticket.
- API xem danh sách Ticket.
- API xem chi tiết Ticket.
- Kiểm tra dữ liệu đầu vào khi tạo Ticket.
- Sinh mã Ticket tự động.
- Xác định thời hạn xử lý dự kiến theo mức độ ưu tiên.
- Xây dựng giao diện danh sách, tiếp nhận và chi tiết Ticket.
- Xây dựng Unit Test cho tầng Service.

Các chức năng chưa triển khai:

- Quản lý thông tin kỹ thuật viên.
- Quản lý kỹ năng kỹ thuật viên.
- Gợi ý và phân công kỹ thuật viên.
- Tạo, cập nhật và quản lý lịch hẹn.
- Kiểm tra trùng lịch kỹ thuật viên.
- Ghi nhận lịch sử thay đổi trạng thái vào `ticket_status_log`.

## 7. Kết luận

Qua quá trình thực hiện BT1 và BT2, thiết kế hệ thống đã được chuyển từ giai đoạn phân tích, mô hình hóa dữ liệu sang giai đoạn hiện thực hóa một phần chức năng.

BT1 đã xác định mô hình dữ liệu gồm 5 bảng chính: `ticket`, `technician`, `technician_skill`, `appointment` và `ticket_status_log`. Các thành phần như thời gian lịch hẹn, thời điểm tạo lịch và ràng buộc kiểm tra thời gian đã được thể hiện trong SQL DDL của BT1.

Sang BT2, hệ thống tập trung xây dựng Backend, Frontend, kết nối PostgreSQL và hiện thực hóa module CRUD Ticket. Các bảng và nghiệp vụ liên quan đến kỹ thuật viên, lịch hẹn và lịch sử trạng thái tiếp tục được giữ trong định hướng thiết kế, nhưng chưa được triển khai thành chức năng hoàn chỉnh.

Các thay đổi tiếp theo sẽ được ghi nhận và cập nhật đồng bộ giữa SRS, ERD, SQL DDL, API Contract và mã nguồn nhằm bảo đảm tính nhất quán của hệ thống.
