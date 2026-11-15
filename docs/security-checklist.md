
# SECURITY CHECKLIST

## Project: Phân công kỹ thuật viên và lịch hẹn (Luồng 4)

- Course: Chuyên đề tốt nghiệp 1
- Track: SE
- Backend: Node.js + Express.js
- Database: PostgreSQL
- Frontend: React + Vite

## 1. Authentication and Authorization

| ID | Security Requirement | Status |
|---|---|---|
| SEC-01 | API yêu cầu đăng nhập đối với các chức năng cần xác thực | Pending verification |
| SEC-02 | Token được kiểm tra trước khi truy cập API được bảo vệ | Pending verification |
| SEC-03 | Token hết hạn hoặc không hợp lệ bị từ chối | Pending verification |
| SEC-04 | Tài khoản có mật khẩu được lưu bằng phương pháp băm an toàn | Pending verification |

## 2. Input Validation

| ID | Security Requirement | Status |
|---|---|---|
| SEC-05 | Kiểm tra các trường bắt buộc | Pending verification |
| SEC-06 | Kiểm tra kiểu dữ liệu đầu vào | Pending verification |
| SEC-07 | Kiểm tra ID hợp lệ | Pending verification |
| SEC-08 | Kiểm tra thời gian bắt đầu và kết thúc lịch hẹn | Pending verification |
| SEC-09 | Giới hạn độ dài dữ liệu đầu vào phù hợp | Pending verification |

## 3. Database Security

| ID | Security Requirement | Status |
|---|---|---|
| SEC-10 | Sử dụng truy vấn có tham số để hạn chế SQL Injection | Pending verification |
| SEC-11 | Sử dụng khóa ngoại và ràng buộc dữ liệu phù hợp | Pending verification |
| SEC-12 | Thông tin kết nối database không được đưa lên GitHub | Pending verification |
| SEC-13 | Không sử dụng tài khoản database có quyền vượt quá nhu cầu | Pending verification |

## 4. API and Error Handling

| ID | Security Requirement | Status |
|---|---|---|
| SEC-14 | API xử lý dữ liệu không hợp lệ | Pending verification |
| SEC-15 | API trả về mã HTTP phù hợp | Pending verification |
| SEC-16 | Không trả về mật khẩu, token hoặc thông tin bí mật trong response | Pending verification |
| SEC-17 | Xử lý lỗi không làm lộ thông tin nội bộ của hệ thống | Pending verification |

## 5. Configuration and Deployment

| ID | Security Requirement | Status |
|---|---|---|
| SEC-18 | File .env được đưa vào .gitignore | Pending verification |
| SEC-19 | Không commit API key hoặc mật khẩu lên GitHub | Pending verification |
| SEC-20 | CORS chỉ cho phép các origin cần thiết | Pending verification |

## 6. Conclusion

Security checks are documented for the project.
Each requirement must be verified against the actual source code and configuration before being marked as PASS.

Unverified requirements must not be reported as successfully implemented.
