
# GHI NHẬN THAY ĐỔI THIẾT KẾ

## 1. Thông tin chung

- Học phần: Chuyên đề Tốt nghiệp 1, HK1 2026-2027
- Track: SE (Software Engineering)
- Luồng nghiệp vụ: L4 – Phân công kỹ thuật viên và lịch hẹn
- Họ và tên: Nguyễn Minh Quân
- MSSV: 2273401151135

## 2. Bảng ghi nhận thay đổi

| STT | Thành phần | Nội dung điều chỉnh | Lý do |
|---|---|---|---|
| 1 | ERD | Bổ sung bảng `ticket_status_log` | Lưu lại lịch sử thay đổi trạng thái phiếu bảo hành, hỗ trợ theo dõi quá trình xử lý. |
| 2 | ERD và SQL DDL | Bổ sung `scheduled_start`, `scheduled_end` vào bảng `appointment` | Quản lý thời gian bắt đầu, kết thúc lịch hẹn và hỗ trợ kiểm tra trùng lịch. |
| 3 | SQL DDL | Bổ sung `created_at` vào bảng `appointment` | Ghi nhận thời điểm tạo lịch hẹn. |
| 4 | SQL DDL | Bổ sung ràng buộc kiểm tra thời gian lịch hẹn | Đảm bảo thời gian kết thúc sau thời gian bắt đầu khi cả hai giá trị được cung cấp. |
| 5 | SRS | Bổ sung yêu cầu quản lý lịch sử trạng thái và thời gian lịch hẹn | Đồng bộ yêu cầu chức năng với thiết kế dữ liệu mới. |
| 6 | API Contract | Rà soát API cập nhật trạng thái phiếu và quản lý lịch hẹn | Đảm bảo API đáp ứng các yêu cầu mới trong SRS. |

## 3. Các điểm cần xác nhận

- Xác nhận quan hệ giữa `ticket` và `appointment` là một-một hay một-nhiều.
- Xác nhận `changed_by` trong `ticket_status_log` tham chiếu đến bảng `employee`.
- Xác nhận thời gian bắt đầu và kết thúc lịch hẹn có bắt buộc hay không.
- Xác nhận quy tắc kiểm tra trùng lịch của kỹ thuật viên.

## 4. Lý do giữ nguyên thiết kế

Các bảng `ticket`, `technician` và `technician_skill` được giữ lại theo phạm vi nghiệp vụ đã xác định. Các khóa chính, khóa ngoại và quan hệ hiện có tiếp tục được sử dụng; chỉ điều chỉnh khi có yêu cầu nghiệp vụ hoặc góp ý cụ thể.

## 5. Kết luận

Các điều chỉnh nhằm hoàn thiện việc quản lý lịch hẹn, theo dõi lịch sử trạng thái phiếu và tăng tính nhất quán giữa SRS, ERD, SQL DDL và API Contract.

Nội dung thiết kế cuối cùng sẽ được rà soát và cập nhật theo góp ý thực tế của giảng viên.

