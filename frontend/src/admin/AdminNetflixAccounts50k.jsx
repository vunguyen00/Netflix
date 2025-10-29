import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import "./Admin.css";

const PLAN_DAYS = 30;

export default function AdminDashboard() {
  const [view, setView] = useState("accounts"); // "accounts" hoặc "orders"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverData, setServerData] = useState([]); // tạm để render table
  const navigate = useNavigate();

  // ================== FETCH DATA ==================
  useEffect(() => {
    fetchData();
  }, [view]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = "";
      if (view === "accounts") url = "https://api.dailywithminh.com/api/account50k";
      if (view === "orders") url = "https://api.dailywithminh.com/api/account50k/orders";

      const res = await fetch(url, {
        headers: { "Content-Type": "application/json" }, // không dùng token
      });

      if (res.status === 401) {
        navigate("/admin/login");
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Lỗi server");
      setServerData(data.data || []);
    } catch (err) {
      console.error("Lỗi khi fetch data:", err);
      setError(err.message || "Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // ================== HÀNH ĐỘNG ==================
  const handleImport = e => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async evt => {
      try {
        const data = evt.target.result;
        let rows = [];

        if (file.name.toLowerCase().endsWith(".csv")) {
          const text = new TextDecoder().decode(
            data instanceof ArrayBuffer ? data : new TextEncoder().encode(String(data))
          ).trim();
          rows = text.split(/\r?\n/).map(line => line.split("|"));
        } else {
          const XLSX = await import("https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm");
          const wb = XLSX.read(new Uint8Array(data), { type: "array" });
          const sheet = wb.SheetNames[0];
          rows = XLSX.utils.sheet_to_json(wb.Sheets[sheet], { header: 1 });
        }

        const imported = rows
          .filter(r => r[0] && r[1])
          .map(r => ({
            username: String(r[0]).trim(),
            password: String(r[1]).trim(),
            cookies: r[2] ? String(r[2]).trim() : "",
          }))
          .filter(
            acc =>
              acc.username.toLowerCase() !== "username" &&
              acc.password.toLowerCase() !== "password"
          );

        const res = await fetch("https://api.dailywithminh.com/api/account50k/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accounts: imported }),
        });

        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.message || "Import thất bại");

        fetchData(); // fetch lại từ server
      } catch (err) {
        console.error("Lỗi khi import:", err);
        alert("Import thất bại!");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSell = async acc => {
    const phone = prompt("Nhập số điện thoại khách hàng:");
    if (!phone) return;

    try {
      const res = await fetch(`https://api.dailywithminh.com/api/account50k/${acc._id}/sell`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, planDays: PLAN_DAYS }),
      });

      if (res.status === 401) {
        navigate("/admin/login");
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Bán thất bại");
      fetchData();
      alert("Đã bán thành công!");
    } catch (err) {
      console.error("Lỗi khi bán account:", err);
      alert(err.message || "Bán thất bại!");
    }
  };

  const handleSwitchAccount = async order => {
    if (!window.confirm("Bạn có chắc muốn chuyển tài khoản mới cho khách hàng này?")) return;
    try {
      const res = await fetch(`https://api.dailywithminh.com/api/account50k/orders/${order._id}/switch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 401) {
        navigate("/admin/login");
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Chuyển thất bại");
      fetchData();
      alert("Đã chuyển tài khoản mới!");
    } catch (err) {
      console.error("Lỗi khi chuyển account:", err);
      alert(err.message || "Chuyển thất bại!");
    }
  };

  const handleEditExpiration = async order => {
    const current = order.expiresAt ? new Date(order.expiresAt).toISOString().slice(0, 10) : "";
    const input = prompt("Nhập ngày hết hạn mới (YYYY-MM-DD):", current);
    if (!input) return;

    const expirationDate = new Date(input);
    if (isNaN(expirationDate)) {
      alert("Ngày hết hạn không hợp lệ");
      return;
    }

    try {
      const res = await fetch(`https://api.dailywithminh.com/api/account50k/orders/${order._id}/expiration`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expirationDate }),
      });

      if (res.status === 401) {
        navigate("/admin/login");
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Sửa hạn thất bại");
      fetchData();
      alert("Cập nhật hạn thành công!");
    } catch (err) {
      console.error("Lỗi khi sửa hạn:", err);
      alert(err.message || "Sửa hạn thất bại!");
    }
  };

  const handleDelete = async order => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;
    try {
      const res = await fetch(`https://api.dailywithminh.com/api/account50k/${order._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 401) {
        navigate("/admin/login");
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Xóa thất bại");
      fetchData();
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      alert(err.message || "Xóa thất bại!");
    }
  };

  // ================== RENDER BẢNG ==================
  const renderAccountsTable = () => (
    <div>
      <h2 className="text-lg font-semibold mb-2">Kho Account50k (chưa bán)</h2>
      <input type="file" accept=".csv,.xlsx,.xls" onChange={handleImport} className="mb-2" />
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Password</th>
            <th>Cookies</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {serverData.length ? serverData.map((acc, idx) => (
            <tr key={acc._id || idx}>
              <td>{acc.username}</td>
              <td>{acc.password}</td>
              <td>{acc.cookies ? acc.cookies.substring(0, 10) + "..." : "-"} 
                  {acc.cookies && (
                    <button
                      className="btn btn-sm btn-outline-secondary ms-2"
                      onClick={() => {
                        navigator.clipboard.writeText(acc.cookies);
                        alert("✅ Đã copy cookie");
                      }}
                    >
                      Copy
                    </button>
                  )}
              </td>
              <td><button className="btn btn-primary" onClick={() => handleSell(acc)}>Bán</button></td>
            </tr>
          )) : (
            <tr><td colSpan="4" className="text-center">Kho trống</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderOrdersTable = () => (
    <div>
      <h2 className="text-lg font-semibold mb-2">Đơn hàng (đã bán)</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Mã đơn hàng</th>
            <th>Khách</th>
            <th>Email/Acc</th>
            <th>Ngày mua</th>
            <th>Ngày hết hạn</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {serverData.length ? serverData.map(o => (
            <tr key={o._id}>
              <td>{o.orderCode}</td>
              <td>{o.user?.phone}</td>
              <td>{o.accountEmail}</td>
              <td>{o.purchaseDate ? new Date(o.purchaseDate).toLocaleDateString("vi-VN") : ""}</td>
              <td>{o.expiresAt ? new Date(o.expiresAt).toLocaleDateString("vi-VN") : ""}</td>
              <td className="flex gap-2">
                <button className="btn btn-warning" onClick={() => handleSwitchAccount(o)}>Chuyển</button>
                <button className="btn btn-secondary" onClick={() => handleEditExpiration(o)}>Sửa hạn</button>
                <button className="btn btn-danger" onClick={() => handleDelete(o)}>Xóa</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan={view === "accounts" ? 4 : 6} className="text-center">Không có dữ liệu</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <AdminLayout>
      <div className="card">
        <h1 className="text-xl font-semibold mb-4">Quản lý Account50k</h1>

        <div className="mb-4 flex gap-2">
          <button
            className={`btn ${view === "accounts" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setView("accounts")}
          >
            Xem kho Account50k
          </button>
          <button
            className={`btn ${view === "orders" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setView("orders")}
          >
            Xem Orders (đã bán)
          </button>
        </div>

        {loading && <p>Đang tải dữ liệu...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {view === "accounts" ? renderAccountsTable() : renderOrdersTable()}
      </div>
    </AdminLayout>
  );
}
