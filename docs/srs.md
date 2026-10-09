# BẢN ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS RÚT GỌN)
**Dự án:** Smart CRM – Mekong Mobile  
**Luồng nghiệp vụ:** L4 – Phân công kỹ thuật viên và lịch hẹn  
**Track chuyên ngành:** Kỹ thuật Phần mềm (SE)  
**Tác giả:** Nguyễn Minh Quân – **MSSV:** 2273401151135

---

## 1. Giới thiệu và Phạm vi

### 1.1 Bối cảnh
Mekong Mobile hiện gặp tình trạng phân công kỹ thuật viên (KTV) thủ công bằng sổ sách và trí nhớ, dẫn đến khối lượng công việc bị lệch giữa các KTV và khoảng 15% yêu cầu bảo hành bị quá hạn cam kết (SLA). Luồng L4 được xây dựng nhằm tự động hóa và hỗ trợ Quản lý phân công KTV phù hợp, đặt lịch hẹn với khách hàng và theo dõi tiến độ xử lý.

### 1.2 Phạm vi luồng nghiệp vụ (L4)
- **Trong phạm vi (IN SCOPE):**
  - Quản lý tạo, xem, cập nhật và điều chỉnh lịch hẹn giao – nhận thiết bị.
  - Hệ thống kiểm tra lịch rảnh, tay nghề và gợi ý KTV phù hợp cho từng phiếu bảo hành.
  - Quản lý thực hiện phân công hoặc điều chỉnh phân công KTV cho phiếu bảo hành.
  - KTV xem danh sách lịch hẹn, công việc được phân công và cập nhật trạng thái lịch hẹn.
- **Không nằm trong phạm vi (WON'T - MoSCoW):**
  - KHÔNG thực hiện tiếp nhận yêu cầu bảo hành ban đầu hay tạo phiếu mới (thuộc luồng L2).
  - KHÔNG quản lý chi tiết xuất/nhập tồn linh kiện trong kho (thuộc luồng L5).
  - KHÔNG gửi khảo sát CSAT/NPS tự động sau khi hoàn tất sửa chữa (thuộc luồng L8).

### 1.3 Bảng thuật ngữ (Glossary)

| Thuật ngữ tiếng Việt | Thuật ngữ kỹ thuật | Định nghĩa |
| :--- | :--- | :--- |
| Phiếu bảo hành | `ticket` | Yêu cầu bảo hành/sửa chữa đã tiếp nhận, có mã duy nhất và vòng đời trạng thái. |
| Kỹ thuật viên | `technician` | Nhân viên thực hiện sửa chữa, có bậc tay nghề và trung tâm làm việc. |
| Bậc tay nghề | `technician_skill` | Điểm đánh giá mức độ thành thạo (thang điểm 1–5) của KTV theo từng nhóm sự cố. |
| Lịch hẹn | `appointment` | Khung thời gian hẹn giao – nhận máy giữa khách hàng và kỹ thuật viên/trung tâm. |

---

## 2. Các bên liên quan và Vai trò

### 2.1 Khách hàng (`customer`)
- **Được làm:** Đặt lịch hẹn giao/nhận máy sửa chữa; xem lịch hẹn của chính mình.
- **Không được làm:** Tự phân công KTV; xem lịch hẹn của khách hàng khác.

### 2.2 Quản lý trung tâm (`center_manager`)
- **Được làm:** Kiểm tra lịch KTV trong trung tâm; phân công KTV cho phiếu bảo hành; tạo và xem lịch hẹn toàn trung tâm; điều chỉnh phân công KTV (có nhập lý do).
- **Không được làm:** Phân công KTV thuộc trung tâm khác; xóa dữ liệu lịch sử phân công.

### 2.3 Kỹ thuật viên (`technician`)
- **Được làm:** Xem danh sách lịch hẹn và công việc được gán cho mình; cập nhật trạng thái lịch hẹn (`SCHEDULED` $\rightarrow$ `COMPLETED` / `CANCELLED`).
- **Không được làm:** Tự gán phiếu của KTV khác cho mình; tự thay đổi KTV phân công mà không có sự đồng ý của Quản lý.

---

## 3. Yêu cầu chức năng (Functional Requirements & User Stories)

### 3.1 Yêu cầu chức năng có mã (FR)
- **FR1 (Quản lý Lịch hẹn):** Hệ thống cho phép tạo mới, tra cứu và cập nhật trạng thái lịch hẹn (`SCHEDULED`, `COMPLETED`, `CANCELLED`).
- **FR2 (Kiểm tra lịch & Tay nghề KTV):** Hệ thống hỗ trợ kiểm tra lịch rảnh và lọc KTV thuộc cùng trung tâm có điểm tay nghề `proficiency >= 3` cho nhóm sự cố tương ứng.
- **FR3 (Phân công KTV):** Hệ thống cho phép Quản lý gán KTV được chọn vào phiếu bảo hành và lưu thông tin phân công.
- **FR4 (Điều chỉnh phân công):** Hệ thống cho phép Quản lý đổi KTV cho phiếu bảo hành và bắt buộc ghi nhận lý do điều chỉnh.
- **FR5 (Xem danh sách phân công & Lịch hẹn):** Hệ thống cho phép KTV xem danh sách công việc và lịch hẹn cá nhân sắp xếp theo hạn SLA (`due_date`) tăng dần.

### 3.2 Danh sách User Story (US)

| Mã US | Phát biểu User Story | Mức MoSCoW |
| :--- | :--- | :--- |
| **US1** | *Là* Khách hàng / Quản lý, *tôi muốn* tạo lịch hẹn giao nhận thiết bị *để* chủ động thời gian làm việc. | **MUST** |
| **US2** | *Là* Quản lý trung tâm, *tôi muốn* kiểm tra lịch rảnh và tay nghề KTV *để* chọn người phù hợp nhất cho phiếu bảo hành. | **MUST** |
| **US3** | *Là* Quản lý trung tâm, *tôi muốn* phân công KTV cho phiếu bảo hành *để* phiếu được bắt đầu sửa chữa đúng hạn. | **MUST** |
| **US4** | *Là* Kỹ thuật viên, *tôi muốn* xem danh sách lịch hẹn và công việc được gán *để* ưu tiên xử lý các phiếu sắp đến hạn SLA trước. | **MUST** |
| **US5** | *Là* Kỹ thuật viên, *tôi muốn* cập nhật trạng thái lịch hẹn *để* ghi nhận tiến độ giao nhận máy thực tế. | **MUST** |
| **US6** | *Là* Quản lý trung tâm, *tôi muốn* điều chỉnh phân công KTV và ghi lại lý do *để* kịp thời xử lý khi KTV gặp sự cố đột xuất. | **SHOULD** |
| **US7** | *Là* Kỹ thuật viên, *tôi muốn* nhận cảnh báo khi lịch hẹn bị trùng hoặc sắp đến giờ hẹn *để* không bị sót lịch khách hàng. | **COULD** |

---

## 4. Yêu cầu phi chức năng (Non-Functional Requirements)

- **NFR1 (Hiệu năng):** Thời gian phản hồi API kiểm tra và gợi ý danh sách KTV khả thi phải **dưới 1.0 giây** với CSDL có **50 KTV và 5.000 phiếu đang chờ**.
- **NFR2 (Toàn vẹn dữ liệu):** Thao tác cập nhật phân công KTV và trạng thái lịch hẹn phải hoàn tất lưu vào CSDL trong **dưới 300ms**, tỉ lệ mất log phân công là **0%**.
- **NFR3 (Bảo mật & Phân quyền):** KTV chỉ xem được dữ liệu lịch hẹn và phiếu bảo hành thuộc về chính mình hoặc trung tâm nơi mình làm việc (tuân thủ quy tắc QT-14).

---

## 5. Ràng buộc và Quy tắc nghiệp vụ

- **QT-06 (Chuyển trạng thái):** Phiếu bảo hành và lịch hẹn phải chuyển trạng thái theo đúng thứ tự hợp lệ, không được chuyển ngược trạng thái đã kết thúc.
- **QT-07 (Duy nhất & Lý do đổi):** Tại một thời điểm, một phiếu chỉ gán cho tối đa 1 KTV. Khi điều chỉnh đổi KTV, hệ thống bắt buộc Quản lý phải nhập lý do.
- **QT-08 (Ràng buộc tay nghề):** KTV chỉ được phân công phiếu thuộc nhóm sự cố mà mình có điểm tay nghề `proficiency >= 3` và làm việc tại cùng trung tâm.
- **QT-14 (Phân quyền dữ liệu):** Nhân viên/KTV chỉ xem được dữ liệu thuộc trung tâm mình làm việc. Quản lý xem được toàn trung tâm phụ trách.

---

## 6. Bảng truy vết yêu cầu (Traceability Matrix)

| Mã FR | User Story | Use Case liên quan | Mức MoSCoW |
| :--- | :--- | :--- | :--- |
| **FR1** | US1, US5 | UC01 – Tạo lịch hẹn<br>UC05 – Cập nhật trạng thái lịch hẹn | MUST |
| **FR2** | US2 | UC02 – Kiểm tra lịch kỹ thuật viên | MUST |
| **FR3** | US3 | UC03 – Phân công kỹ thuật viên | MUST |
| **FR4** | US6 | UC06 – Điều chỉnh phân công | SHOULD |
| **FR5** | US4, US7 | UC04 – Xem lịch hẹn | MUST / COULD |
