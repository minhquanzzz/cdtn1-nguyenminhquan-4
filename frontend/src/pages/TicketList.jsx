
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataState from "../components/DataState";
import { getTickets } from "../services/api";

function extractList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.tickets)) return response.tickets;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.tickets)) {
    return response.data.tickets;
  }
  return [];
}

function ticketId(ticket) {
  return ticket.ticket_id ?? ticket.id;
}

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getTickets();
      setTickets(extractList(response));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Không thể kết nối đến máy chủ. Hãy kiểm tra backend và thử lại."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">QUẢN LÝ DỊCH VỤ</p>
          <h1>Danh sách yêu cầu</h1>
          <p className="muted">
            Theo dõi các yêu cầu dịch vụ trong hệ thống.
          </p>
        </div>

        <Link className="btn btn-primary" to="/tickets/new">
          + Tiếp nhận yêu cầu
        </Link>
      </div>

      <div className="panel">
        <DataState
          loading={loading}
          error={error}
          isEmpty={!loading && !error && tickets.length === 0}
          onRetry={loadTickets}
        >
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Mã yêu cầu</th>
                  <th>Khách hàng</th>
                  <th>Thiết bị</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, index) => {
                  const id = ticketId(ticket);

                  return (
                    <tr key={id ?? index}>
                      <td className="ticket-code">
                        {id == null ? "Chưa có mã" : `#${id}`}
                      </td>
                      <td>
                        {ticket.customer_name ??
                          ticket.customer_id ??
                          "Chưa cập nhật"}
                      </td>
                      <td>
                        {ticket.device_name ??
                          ticket.device_id ??
                          "Chưa cập nhật"}
                      </td>
                      <td>
                        <span className="status-badge">
                          {ticket.status ?? "Chưa cập nhật"}
                        </span>
                      </td>
                      <td>
                        {id != null ? (
                          <Link
                            className="text-link"
                            to={`/tickets/${id}`}
                          >
                            Xem chi tiết
                          </Link>
                        ) : (
                          <span className="muted">Không có mã</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </DataState>
      </div>
    </section>
  );
}
