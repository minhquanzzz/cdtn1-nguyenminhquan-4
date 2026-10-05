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
Python 3.11
PostgreSQL 16
Biến môi trường: xem .env.example
## 3. Hướng dẫn chạy
(BT2 yêu cầu ≤ 4 bước)
Tạo file .env từ .env.example và điền các giá trị cần thiết.
Cài đặt các thư viện:
pip install -r requirements.txt
Khởi động PostgreSQL và chạy ứng dụng.
Mở hệ thống tại địa chỉ được cấu hình.
## 4. Cấu trúc thư mục
src/ : Mã nguồn chính của hệ thống
## 5. Kiểm thử
npm test → hiển thị số test PASS
## 6. Trạng thái hiện tại
 Khởi tạo project, smoke test chạy được (buổi 2)
□ Module tiếp nhận yêu cầu (buổi 8–10)
□ Module phân công kỹ thuật viên (buổi 10–12)
