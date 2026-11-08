
## 1. Thông tin chung

| Nội dung | Giá trị |
|---|---|
| Dự án | Smart CRM – Mekong Mobile |
| Trạng thái | Chưa có bug thực tế được xác nhận từ bằng chứng hiện có |

## 2. Danh sách bug

| Bug ID | Mức độ | Mô tả | Trạng thái | Test xác nhận | Commit sửa lỗi |
|---|---|---|---|---|---|
| Chưa ghi nhận | — | Chưa có lỗi tái hiện được và có bằng chứng | N/A | — | — |

## 3. Quy trình ghi nhận bug khi phát hiện

Khi một test case thất bại hoặc phát hiện lỗi khi chạy ứng dụng, tạo một mục bug với các thông tin:

- **Bug ID:** BUG-01, BUG-02, ...
- **Tiêu đề:** mô tả ngắn gọn, chỉ rõ chức năng và lỗi.
- **Mức độ:** Critical / High / Medium / Low, dựa trên ảnh hưởng thực tế.
- **Môi trường:** phiên bản ứng dụng, Python, hệ điều hành, database nếu liên quan.
- **Tiền điều kiện và dữ liệu:** các điều kiện cần có để tái hiện.
- **Các bước tái hiện:** từng bước cụ thể.
- **Kết quả mong đợi / thực tế:** ghi rõ sự khác biệt.
- **Bằng chứng:** ảnh chụp, log hoặc test case thất bại.
- **Cách khắc phục:** file và logic đã sửa.
- **Regression test:** test case chạy lại sau khi sửa.
- **Commit:** URL commit thực sự chứa thay đổi sửa lỗi.

## 4. Quy ước mức độ nghiêm trọng

| Mức độ | Tiêu chí |
|---|---|
| Critical | Làm hệ thống ngừng hoạt động, mất/hỏng dữ liệu nghiêm trọng hoặc lộ dữ liệu nhạy cảm |
| High | Chức năng nghiệp vụ chính không thể sử dụng và không có cách thay thế hợp lý |
| Medium | Một phần chức năng sai nhưng có cách khắc phục tạm thời |
| Low | Lỗi giao diện, nội dung hoặc ảnh hưởng nhỏ không chặn nghiệp vụ |

## 5. Ghi chú

Không xem một test case PASS là một bug đã được sửa. Chỉ chuyển bug sang trạng thái Fixed sau khi có lỗi tái hiện, thay đổi source khắc phục, commit tương ứng và regression test PASS.
