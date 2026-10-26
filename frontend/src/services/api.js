
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

export function getTickets() {
  return api.get("/tickets").then((response) => response.data);
}

export function getTicketById(id) {
  return api.get(`/tickets/${id}`).then((response) => response.data);
}

export function createTicket(payload) {
  return api.post("/tickets", payload).then((response) => response.data);
}

export default api;
