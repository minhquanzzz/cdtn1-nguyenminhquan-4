
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createTicket } from "../services/api";

const initialForm = {
  customer_id: "",
  device_id: "",
  center_id: "",
  issue_desc: "",
  category_id: "",
  priority: "MEDIUM",
  is_warranty: false,
};

export default function TicketReceive() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const requiredFields = [
      ["customer_id", "mã khách hàng"],
      ["device_id", "mã thiết bị"],
      ["center_id", "mã trung tâm"],
      ["issue_desc", "mô tả sự cố"],
      ["category_id", "mã loại yêu cầu"],
    ];

    for (const [field, label] of requiredFields) {
      if (!String(form[field]).trim()) {
        setError(`Vui lòng nhập ${label}.`);
        return;
      }
    }

    const customerId = Number(form.customer_id);
    const deviceId = Number(form.device_id);
    const centerId = Number(form.center_id);
    const categoryId = Number(form.category_id);

    const ids = [
      [customerId, "Mã khách hàng"],
      [deviceId, "Mã thiết bị"],
      [centerId, "Mã trung tâm"],
      [categoryId, "Mã loại yêu cầu"],
    ];

    for (const [value, label] of ids) {
      if (!Number.isSafeInteger(value) || value <= 0) {
        setError(`${label} phải là số nguyên dương hợp lệ.`);
        return;
      }
    }

    if (!form.issue_desc.trim()) {
      setError("Mô tả sự cố không được để trống.");
      return;
    }

    const payload = {
      customer_id: customerId,
      device_id: deviceId,
      center_id: centerId,
      issue_desc: form.issue_desc.trim(),
      category_id: categoryId,
      priority: form.priority,
      is_warranty: form.is_warranty,
    };

    setSubmitting(true);

    try {
      const result = await createTicket(payload);
      const ticket = result?.ticket ?? result?.data ?? result;
      const id = ticket?.ticket_id ?? ticket?.id;

      setSuccess("Tiếp nhận yêu cầu thành công.");

      if (id != null) {
        navigate(`/tickets/${id}`);
      } else {
        setForm(initialForm);
      }
    } catch (err) {
      console.error("Lỗi tạo ticket:", {
        message: err.message,
        status: err.response?.status,
        response: err.response?.data,
        payload,
      });

      const detail = err.response?.data;
      const message =
        typeof detail === "string"
          ? detail
          : detail?.message || detail?.error;

      setError(
        message ||
          `Không thể tiếp nhận yêu cầu. ${
            err.response?.status
              ? `Mã lỗi HTTP ${err.response.status}.`
              : "Không kết nối được backend."
          }`
      );
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setForm(initialForm);
    setError("");
    setSuccess("");
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">NGHIỆP VỤ TIẾP NHẬN</p>
          <h1>Tiếp nhận yêu cầu</h1>
          <p className="muted">
            Nhập thông tin khách hàng, thiết bị và sự cố cần xử lý.
          </p>
        </div>

        <Link className="btn btn-secondary" to="/">
          ← Danh sách yêu cầu
        </Link>
      </div>

      <div className="panel form-panel">
        {error && (
          <div className="form-message error-message" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="form-message success-message" role="status">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="form-field">
              <span>Mã khách hàng *</span>
              <input
                name="customer_id"
                type="number"
                min="1"
                step="1"
                required
                value={form.customer_id}
                onChange={updateField}
                placeholder="Ví dụ: 2001"
              />
            </label>

            <label className="form-field">
              <span>Mã thiết bị *</span>
              <input
                name="device_id"
                type="number"
                min="1"
                step="1"
                required
                value={form.device_id}
                onChange={updateField}
                placeholder="Ví dụ: 3001"
              />
            </label>

            <label className="form-field">
              <span>Mã trung tâm *</span>
              <input
                name="center_id"
                type="number"
                min="1"
                step="1"
                required
                value={form.center_id}
                onChange={updateField}
                placeholder="Ví dụ: 1"
              />
            </label>

            <label className="form-field">
              <span>Mã loại yêu cầu *</span>
              <input
                name="category_id"
                type="number"
                min="1"
                step="1"
                required
                value={form.category_id}
                onChange={updateField}
                placeholder="Ví dụ: 1"
              />
            </label>

            <label className="form-field">
              <span>Mức độ ưu tiên *</span>
              <select
                name="priority"
                required
                value={form.priority}
                onChange={updateField}
              >
                <option value="LOW">Thấp</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="HIGH">Cao</option>
              </select>
            </label>

            <label className="form-field">
              <span>Mô tả sự cố *</span>
              <textarea
                name="issue_desc"
                required
                rows={3}
                value={form.issue_desc}
                onChange={updateField}
                placeholder="Ví dụ: Máy không sạc pin"
              />
            </label>

            <label className="checkbox-field">
              <input
                name="is_warranty"
                type="checkbox"
                checked={form.is_warranty}
                onChange={updateField}
              />
              <span>Yêu cầu thuộc diện bảo hành</span>
            </label>
          </div>

          <p className="muted form-hint">
            Các mã khách hàng, thiết bị, trung tâm và loại yêu cầu
            phải tồn tại trong cơ sở dữ liệu nếu có ràng buộc khóa ngoại.
          </p>

          <div className="form-actions">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Đang tiếp nhận..." : "Tạo yêu cầu"}
            </button>

            <button
              className="btn btn-secondary"
              type="button"
              disabled={submitting}
              onClick={resetForm}
            >
              Xóa nội dung
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
