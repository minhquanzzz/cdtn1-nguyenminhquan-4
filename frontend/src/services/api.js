import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:3000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tự động gửi token khi gọi API
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Lấy danh sách phiếu
export function getTickets() {
  return api.get("/tickets").then((response) => response.data);
}

// Lấy chi tiết phiếu
export function getTicketById(id) {
  return api.get(`/tickets/${id}`).then((response) => response.data);
}

// Tạo phiếu
export function createTicket(payload) {
  return api.post("/tickets", payload).then((response) => response.data);
}

// Đăng nhập Admin
export function loginAdmin(payload) {
  return api.post("/auth/login", payload).then((response) => response.data);
}

export default api;