import {
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import TicketList from "./pages/TicketList";
import TicketDetail from "./pages/TicketDetail";
import TicketReceive from "./pages/TicketReceive";
import Login from "./pages/Login";

import "./App.css";

// Kiểm tra đăng nhập
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Giao diện chính
function Layout() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

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

        <div className="account-info">
          <span>Admin: {user?.username || "admin"}</span>

          <button onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<TicketList />} />

          <Route
            path="/tickets/new"
            element={<TicketReceive />}
          />

          <Route
            path="/tickets/:id"
            element={<TicketDetail />}
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>

      <footer className="footer">
        <span>CDTN1 · Luồng 4</span>
        <span>Hệ thống quản lý yêu cầu dịch vụ</span>
      </footer>
    </div>
  );
}

// Ứng dụng chính
export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  return (
    <Routes>
      <Route
        path="/login"
        element={
          loggedIn ? (
            <Navigate to="/" replace />
          ) : (
            <LoginWithCallback
              onLogin={() => setLoggedIn(true)}
            />
          )
        }
      />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// Cập nhật trạng thái đăng nhập sau khi Login thành công
function LoginWithCallback({ onLogin }) {
  const navigate = useNavigate();

  return (
    <Login
      onLogin={() => {
        onLogin();
        navigate("/", { replace: true });
      }}
    />
  );
}