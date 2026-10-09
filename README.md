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
Cài đặt các thư viện cần thiết
Khởi động PostgreSQL và chạy ứng dụng.
Mở hệ thống tại địa chỉ được cấu hình.
## 4. Cấu trúc thư mục
docs/: Chứa tài liệu phân tích và đặc tả hệ thống.
docs/srs.md: Tài liệu đặc tả yêu cầu phần mềm, gồm User Story, Use Case, FR và NFR.
docs/ai-disclosure.md: Ghi nhận việc sử dụng công cụ AI trong quá trình thực hiện.
.env.example: Mẫu các biến môi trường cần thiết cho hệ thống.
.gitignore: Khai báo các file/thư mục không đưa lên Git.
README.md: Giới thiệu dự án, hướng dẫn chạy và trạng thái hiện tại.
- `docs/api-contract.md`: Đặc tả endpoint, Request/Response, mã HTTP và quy tắc validation.
## 5. Kiểm thử
npm test → hiển thị số test PASS
## 6. Trạng thái hiện tại
- [x] Khởi tạo repository.
- [x] Xây dựng User Story cho luồng L4.
- [x] Xây dựng Use Case và sơ đồ Use Case.
- [x] Xây dựng tài liệu SRS.
- [x] Xây dựng bản đặc tả API Contract.
- [ ] Hoàn thiện Data Spec.
- [ ] Triển khai backend và cơ sở dữ liệu.
- [ ] Kiểm thử các chức năng nghiệp vụ.
