
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import TicketList from "./pages/TicketList";
import TicketDetail from "./pages/TicketDetail";
import TicketReceive from "./pages/TicketReceive";
import "./App.css";

function Layout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          <span className="brand-mark">L4</span>
          <span>
            <strong>ServiceDesk</strong>
            <small>Phân công kỹ thuật viên và lịch hẹn</small>
          </span>
        </NavLink>

        <nav className="navigation">
          <NavLink to="/" end>
            Danh sách yêu cầu
          </NavLink>
          <NavLink to="/tickets/new">
            Tiếp nhận
          </NavLink>
        </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<TicketList />} />
          <Route path="/tickets/new" element={<TicketReceive />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="footer">
        <span>CDTN1 · Luồng 4</span>
        <span>Hệ thống quản lý yêu cầu dịch vụ</span>
      </footer>
    </div>
  );
}

export default function App() {
  return <Layout />;
}
