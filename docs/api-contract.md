# API Contract – Phân công kỹ thuật viên và lịch hẹn

## 1. Thông tin chung
- **Tên hệ thống:** Phân công kỹ thuật viên và lịch hẹn
- **Track:** SE 
- **Luồng nghiệp vụ:** L4 – Phân công kỹ thuật viên và lịch hẹn
- **Phiên bản tài liệu:** 1.0

### 1.1. Mục đích
Tài liệu quy định các API phục vụ việc tạo và quản lý lịch hẹn, kiểm tra lịch làm việc của kỹ thuật viên, phân công kỹ thuật viên, xem lịch được giao và cập nhật trạng thái lịch hẹn.
Tài liệu thống nhất phương thức HTTP, endpoint, dữ liệu Request/Response, mã trạng thái HTTP và quy tắc validation giữa frontend và backend.

## 2. Danh sách API Endpoints
| STT | Method | Endpoint | Chức năng |
|---|---|---|---|
| 1 | POST | `/api/v1/appointments` | Tạo lịch hẹn |
| 2 | GET | `/api/v1/appointments/{id}` | Xem chi tiết lịch hẹn |
| 3 | GET | `/api/v1/technicians/availability` | Kiểm tra lịch kỹ thuật viên |
| 4 | POST | `/api/v1/appointments/{id}/assignments` | Phân công kỹ thuật viên |
| 5 | GET | `/api/v1/technicians/me/appointments` | Xem lịch hẹn được giao |
| 6 | PATCH | `/api/v1/appointments/{id}/status` | Cập nhật trạng thái lịch hẹn |
| 7 | PATCH | `/api/v1/appointments/{id}/assignment` | Điều chỉnh phân công |

## 3. Chi tiết API

### 3.1. API tạo lịch hẹn

**Method:** `POST`

**Endpoint:** `/api/v1/appointments`

**Mô tả:** Tạo lịch hẹn mới cho khách hàng.

#### Request JSON

```json
{
  "customerName": "Nguyen Minh Quân",
  "customerPhone": "0901234567",
  "serviceDescription": "Kiem tra va sua chua thiet bi",
  "scheduledStart": "2026-10-15T09:00:00+07:00",
  "scheduledEnd": "2026-10-15T10:00:00+07:00",
  "note": "Khach hang hen buoi sang"
}
```

#### Response – 201 Created

```json
{
  "id": 101,
  "customerName": "Nguyen Minh Quân",
  "customerPhone": "0901234567",
  "serviceDescription": "Kiem tra va sua chua thiet bi",
  "scheduledStart": "2026-10-15T09:00:00+07:00",
  "scheduledEnd": "2026-10-15T10:00:00+07:00",
  "status": "PENDING",
  "technicianId": null,
  "note": "Khach hang hen buoi sang"
}
```

#### Validation

| Trường | Kiểu dữ liệu | Bắt buộc | Quy tắc |
|---|---|---|---|
| customerName | String | Có | Không được để trống |
| customerPhone | String | Có | Số điện thoại hợp lệ theo quy định hệ thống |
| serviceDescription | String | Có | Không được để trống |
| scheduledStart | DateTime | Có | Thời gian bắt đầu hợp lệ |
| scheduledEnd | DateTime | Có | Phải sau scheduledStart |
| note | String | Không | Tối đa 500 ký tự |

#### Mã HTTP

- `201 Created`: Tạo lịch hẹn thành công.
- `400 Bad Request`: Dữ liệu không hợp lệ.
- `401 Unauthorized`: Chưa xác thực.
- `422 Unprocessable Entity`: Dữ liệu không đáp ứng quy tắc nghiệp vụ.

---

### 3.2. API xem chi tiết lịch hẹn

**Method:** `GET`

**Endpoint:** `/api/v1/appointments/{id}`

**Mô tả:** Lấy thông tin chi tiết của một lịch hẹn.

#### Request

```http
GET /api/v1/appointments/101
```

#### Response – 200 OK

```json
{
  "id": 101,
  "customerName": "Nguyen Minh Quân",
  "customerPhone": "0901234567",
  "serviceDescription": "Kiem tra va sua chua thiet bi",
  "scheduledStart": "2026-10-15T09:00:00+07:00",
  "scheduledEnd": "2026-10-15T10:00:00+07:00",
  "status": "PENDING",
  "technicianId": null
}
```

#### Mã HTTP

- `200 OK`: Lấy dữ liệu thành công.
- `401 Unauthorized`: Chưa xác thực.
- `403 Forbidden`: Không có quyền xem lịch hẹn.
- `404 Not Found`: Không tìm thấy lịch hẹn.

---

### 3.3. API kiểm tra lịch kỹ thuật viên

**Method:** `GET`

**Endpoint:** `/api/v1/technicians/availability`

**Mô tả:** Kiểm tra kỹ thuật viên có thể nhận lịch trong khoảng thời gian yêu cầu hay không.

#### Query Parameters

| Tham số | Kiểu dữ liệu | Bắt buộc | Quy tắc |
|---|---|---|---|
| start | DateTime | Có | Thời điểm bắt đầu |
| end | DateTime | Có | Phải sau start |

#### Request

```http
GET /api/v1/technicians/availability?start=2026-10-15T09:00:00%2B07:00&end=2026-10-15T10:00:00%2B07:00
```

#### Response – 200 OK

```json
{
  "start": "2026-10-15T09:00:00+07:00",
  "end": "2026-10-15T10:00:00+07:00",
  "technicians": [
    {
      "id": 5,
      "name": "Tran Van B",
      "available": true
    },
    {
      "id": 8,
      "name": "Le Van C",
      "available": false
    }
  ]
}
```

#### Mã HTTP

- `200 OK`: Kiểm tra lịch thành công.
- `400 Bad Request`: Khoảng thời gian không hợp lệ.
- `401 Unauthorized`: Chưa xác thực.
- `403 Forbidden`: Không có quyền kiểm tra lịch.

---

### 3.4. API phân công kỹ thuật viên

**Method:** `POST`

**Endpoint:** `/api/v1/appointments/{id}/assignments`

**Mô tả:** Phân công một kỹ thuật viên cho lịch hẹn chưa được phân công.

#### Request JSON

```json
{
  "technicianId": 5
}
```

#### Response – 201 Created

```json
{
  "appointmentId": 101,
  "technicianId": 5,
  "status": "ASSIGNED",
  "message": "Phan cong ky thuat vien thanh cong"
}
```

#### Validation

| Trường | Kiểu dữ liệu | Bắt buộc | Quy tắc |
|---|---|---|---|
| id | Integer | Có | ID lịch hẹn phải là số nguyên dương |
| technicianId | Integer | Có | ID kỹ thuật viên phải là số nguyên dương |

Quy tắc nghiệp vụ:

- Lịch hẹn phải tồn tại và chưa được phân công.
- Kỹ thuật viên phải tồn tại và đang hoạt động.
- Kỹ thuật viên phải có thời gian phù hợp.
- Hệ thống phải kiểm tra trùng lịch ngay trước khi lưu phân công.
- Việc kiểm tra và lưu phân công phải tránh trường hợp hai yêu cầu đồng thời gây trùng lịch.

#### Mã HTTP

- `201 Created`: Phân công thành công.
- `400 Bad Request`: Dữ liệu không hợp lệ.
- `401 Unauthorized`: Chưa xác thực.
- `403 Forbidden`: Không có quyền phân công.
- `404 Not Found`: Không tìm thấy lịch hẹn hoặc kỹ thuật viên.
- `409 Conflict`: Lịch hẹn đã được phân công hoặc kỹ thuật viên bị trùng lịch.

---

### 3.5. API xem lịch hẹn được phân công

**Method:** `GET`

**Endpoint:** `/api/v1/technicians/me/appointments`

**Mô tả:** Cho phép kỹ thuật viên xem các lịch hẹn được phân công cho tài khoản của mình.

#### Query Parameters

| Tham số | Kiểu dữ liệu | Bắt buộc | Mô tả |
|---|---|---|---|
| from | DateTime | Không | Thời điểm bắt đầu lọc |
| to | DateTime | Không | Thời điểm kết thúc lọc |
| status | String | Không | Lọc theo trạng thái |

#### Response – 200 OK

```json
{
  "items": [
    {
      "appointmentId": 101,
      "customerName": "Nguyen Minh Quân",
      "serviceDescription": "Kiem tra va sua chua thiet bi",
      "scheduledStart": "2026-10-15T09:00:00+07:00",
      "scheduledEnd": "2026-10-15T10:00:00+07:00",
      "status": "ASSIGNED"
    }
  ],
  "total": 1
}
```

#### Mã HTTP

- `200 OK`: Lấy danh sách thành công, kể cả khi danh sách rỗng.
- `400 Bad Request`: Tham số lọc không hợp lệ.
- `401 Unauthorized`: Chưa xác thực.
- `403 Forbidden`: Người dùng không có quyền truy cập.

**Quy tắc truy cập:** Kỹ thuật viên chỉ được xem lịch được phân công cho chính mình.

---

### 3.6. API cập nhật trạng thái lịch hẹn

**Method:** `PATCH`

**Endpoint:** `/api/v1/appointments/{id}/status`

**Mô tả:** Cập nhật trạng thái thực hiện lịch hẹn.

#### Request JSON

```json
{
  "status": "IN_PROGRESS"
}
```

#### Các trạng thái dự kiến

| Trạng thái | Ý nghĩa |
|---|---|
| PENDING | Chờ phân công |
| ASSIGNED | Đã phân công |
| IN_PROGRESS | Đang thực hiện |
| COMPLETED | Hoàn thành |
| CANCELLED | Đã hủy |

#### Response – 200 OK

```json
{
  "appointmentId": 101,
  "status": "IN_PROGRESS",
  "message": "Cap nhat trang thai thanh cong"
}
```

#### Validation và quy tắc nghiệp vụ

- Trường status là bắt buộc.
- Chỉ chấp nhận trạng thái được định nghĩa.
- Chỉ người có quyền mới được cập nhật.
- Kỹ thuật viên chỉ được cập nhật lịch được phân công cho mình.
- Không cho phép chuyển trạng thái trái quy trình nghiệp vụ.
- Chuyển sang COMPLETED chỉ khi công việc đã hoàn thành.
- Các trạng thái và quy tắc chuyển trạng thái phải được thống nhất trước khi triển khai.

#### Mã HTTP

- `200 OK`: Cập nhật thành công.
- `400 Bad Request`: Trạng thái không hợp lệ.
- `401 Unauthorized`: Chưa xác thực.
- `403 Forbidden`: Không có quyền cập nhật.
- `404 Not Found`: Không tìm thấy lịch hẹn.
- `409 Conflict`: Không thể chuyển sang trạng thái được yêu cầu.

---

### 3.7. API điều chỉnh phân công

**Method:** `PATCH`

**Endpoint:** `/api/v1/appointments/{id}/assignment`

**Mô tả:** Thay đổi kỹ thuật viên đã được phân công cho lịch hẹn.

#### Request JSON

```json
{
  "technicianId": 8,
  "reason": "Ky thuat vien ban dau khong the thuc hien"
}
```

#### Response – 200 OK

```json
{
  "appointmentId": 101,
  "technicianId": 8,
  "status": "ASSIGNED",
  "message": "Dieu chinh phan cong thanh cong"
}
```

#### Validation

| Trường | Kiểu dữ liệu | Bắt buộc | Quy tắc |
|---|---|---|---|
| id | Integer | Có | ID lịch hẹn hợp lệ |
| technicianId | Integer | Có | Kỹ thuật viên tồn tại và đang hoạt động |
| reason | String | Có | Không được để trống |

Quy tắc nghiệp vụ:

- Lịch hẹn phải tồn tại và đã được phân công.
- Kỹ thuật viên mới không được trùng lịch.
- Chỉ người có quyền điều phối mới được thay đổi phân công.
- Nếu thay đổi thất bại, hệ thống phải giữ nguyên phân công cũ.
- Việc thay đổi phân công phải được ghi nhận để phục vụ kiểm tra khi cần.

#### Mã HTTP

- `200 OK`: Điều chỉnh thành công.
- `400 Bad Request`: Dữ liệu không hợp lệ.
- `401 Unauthorized`: Chưa xác thực.
- `403 Forbidden`: Không có quyền điều chỉnh.
- `404 Not Found`: Không tìm thấy lịch hẹn hoặc kỹ thuật viên.
- `409 Conflict`: Kỹ thuật viên mới bị trùng lịch hoặc lịch hẹn không ở trạng thái cho phép điều chỉnh.

---

## 4. Quy ước xử lý lỗi

Tất cả API trả lỗi sử dụng định dạng JSON thống nhất.

### Ví dụ: Lỗi validation

**HTTP Status:** `400 Bad Request`

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Du lieu gui len khong hop le",
    "details": [
      {
        "field": "scheduledEnd",
        "message": "Thoi gian ket thuc phai sau thoi gian bat dau"
      }
    ]
  }
}
```

### Ví dụ: Trùng lịch kỹ thuật viên

**HTTP Status:** `409 Conflict`

```json
{
  "error": {
    "code": "TECHNICIAN_SCHEDULE_CONFLICT",
    "message": "Ky thuat vien da co lich trong khoang thoi gian nay"
  }
}
```

### Các mã lỗi chuẩn

| HTTP Status | Ý nghĩa |
|---|---|
| 200 | Yêu cầu thành công |
| 201 | Tạo tài nguyên thành công |
| 400 | Request không hợp lệ |
| 401 | Chưa xác thực |
| 403 | Không đủ quyền |
| 404 | Không tìm thấy tài nguyên |
| 409 | Xung đột dữ liệu hoặc trạng thái |
| 422 | Dữ liệu không đáp ứng quy tắc nghiệp vụ |
| 500 | Lỗi hệ thống ngoài dự kiến |

---

## 5. Yêu cầu bảo mật và toàn vẹn dữ liệu
1. Các API quản lý lịch hẹn và phân công phải kiểm tra quyền truy cập.
2. Không trả về thông tin khách hàng cho người không có quyền.
3. Kỹ thuật viên chỉ được xem và cập nhật lịch thuộc phạm vi được phân công.
4. Kiểm tra trùng lịch phải được thực hiện tại backend, không chỉ ở giao diện.
5. Khi phân công hoặc điều chỉnh thất bại, dữ liệu phân công hiện tại phải được giữ nguyên.
6. Dữ liệu đầu vào phải được validation trước khi xử lý và lưu trữ.
7. Không đưa mật khẩu, token thật hoặc thông tin bí mật vào tài liệu và repository.

---

## 6. Truy vết API với User Story
| User Story | Chức năng | API liên quan |
|---|---|---|
| US01 | Tạo lịch hẹn | POST `/api/v1/appointments` |
| US02 | Kiểm tra lịch kỹ thuật viên | GET `/api/v1/technicians/availability` |
| US03 | Phân công kỹ thuật viên | POST `/api/v1/appointments/{id}/assignments` |
| US04 | Xem lịch được phân công | GET `/api/v1/technicians/me/appointments` |
| US05 | Cập nhật trạng thái lịch hẹn | PATCH `/api/v1/appointments/{id}/status` |
| US06 | Điều chỉnh phân công | PATCH `/api/v1/appointments/{id}/assignment` |

API GET `/api/v1/appointments/{id}` hỗ trợ chức năng xem chi tiết lịch hẹn và được sử dụng khi cần lấy dữ liệu lịch cụ thể.

---

## 7. Giả định và nội dung cần xác nhận

- Cấu trúc dữ liệu trên là thiết kế đề xuất cho luồng L4.
- Các trường thông tin khách hàng có thể cần điều chỉnh theo mô hình dữ liệu chính thức.
- Cần thống nhất quy trình chuyển trạng thái lịch hẹn trước khi triển khai.
- Cần xác định cơ chế đăng nhập, phân quyền và quản lý tài khoản kỹ thuật viên.
- Cần thống nhất quy tắc xử lý lịch hẹn bị hủy hoặc thay đổi thời gian.
- Các endpoint, mã lỗi và JSON mẫu cần được cập nhật nếu thiết kế backend thực tế có thay đổi.
