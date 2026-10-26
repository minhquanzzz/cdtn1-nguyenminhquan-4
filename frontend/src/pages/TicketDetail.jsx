
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DataState from "../components/DataState";
import { getTicketById } from "../services/api";

export default function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTicket = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getTicketById(id);
      const result = response?.ticket ?? response?.data ?? response;

      if (!result || typeof result !== "object" || Array.isArray(result)) {
        setTicket(null);
        setError("Dữ liệu yêu cầu không hợp lệ.");
        return;
      }

      setTicket(result);
    } catch (err) {
      setTicket(null);
      setError(
        err.response?.status === 404
          ? "Không tìm thấy yêu cầu này."
          : err.response?.data?.message ||
              "Không thể tải chi tiết yêu cầu."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  const fields = [
    ["Mã yêu cầu", ticket?.ticket_id ?? ticket?.id ?? id],
    ["Mã khách hàng", ticket?.customer_id],
    ["Mã thiết bị", ticket?.device_id],
    ["Mã trung tâm", ticket?.center_id],
    ["Trạng thái", ticket?.status],
    [
      "Bảo hành",
      ticket?.is_warranty == null
        ? undefined
        : ticket.is_warranty
          ? "Có"
          : "Không",
    ],
    [
      "Ngày tiếp nhận",
      ticket?.received_at
        ? new Date(ticket.received_at).toLocaleString("vi-VN")
        : undefined,
    ],
    ["Ghi chú", ticket?.note],
  ];

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">CHI TIẾT YÊU CẦU</p>
          <h1>Yêu cầu #{id}</h1>
          <p className="muted">
            Thông tin chi tiết của yêu cầu dịch vụ.
          </p>
        </div>

        <Link className="btn btn-secondary" to="/">
          ← Quay lại danh sách
        </Link>
      </div>

      <div className="panel">
        <DataState
          loading={loading}
          error={error}
          isEmpty={!loading && !error && !ticket}
          onRetry={loadTicket}
        >
          <div className="detail-grid">
            {fields
              .filter(([, value]) => value !== undefined && value !== null)
              .map(([label, value]) => (
                <div className="detail-item" key={label}>
                  <span className="detail-label">{label}</span>
                  <strong>{String(value)}</strong>
                </div>
              ))}
          </div>
        </DataState>
      </div>
    </section>
  );
}
