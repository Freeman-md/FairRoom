import { useMemo, useState } from "react";
import {
  adminOverviewRows,
  type AdminBookingStatus,
  adminQuickLinks,
  adminRecentActivities,
  adminProTip,
  adminOverviewHeader,
} from "../../../data/adminMockData";
import "../../../styles/admin.css";

function AdminOverviewPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | AdminBookingStatus>("All");

  const filteredRows = useMemo(() => {
    return adminOverviewRows.filter((row) => {
      const matchQuery =
        row.userName.toLowerCase().includes(query.toLowerCase()) ||
        row.roomName.toLowerCase().includes(query.toLowerCase());

      const matchStatus = statusFilter === "All" ? true : row.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [query, statusFilter]);

  return (
    <section className="admin-overview-page">
      <div className="admin-overview-head">
        <div>
          <h1>{adminOverviewHeader.title}</h1>
          <p>{adminOverviewHeader.subtitle}</p>
        </div>

        <div className="admin-head-actions">
          <button type="button" className="btn-secondary">
            {adminOverviewHeader.exportButtonLabel}
          </button>
          <button type="button" className="btn-primary">
            {adminOverviewHeader.newBookingButtonLabel}
          </button>
        </div>
      </div>

      <div className="admin-filters">
        <input
          placeholder="Search user or room..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input placeholder="Date" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "All" | AdminBookingStatus)}
        >
          <option value="All">Status: All</option>
          <option value="Active">Active</option>
          <option value="Cancelled">Cancelled</option>
          <option value="No-Show">No-Show</option>
        </select>
        <button
          type="button"
          className="admin-reset-btn"
          onClick={() => {
            setQuery("");
            setStatusFilter("All");
          }}
        >
          Reset Filters
        </button>
      </div>

      <div className="admin-main-grid">
        <div className="admin-table-card">
          <div className="admin-table-head">
            <span>User Details</span>
            <span>Room</span>
            <span>Date & Time</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {filteredRows.map((row) => (
            <div className="admin-table-row" key={row.id}>
              <div className="user-cell">
                <img src={row.avatarUrl} alt={row.userName} />
                <div>
                  <strong>{row.userName}</strong>
                  <small>{row.userCode}</small>
                </div>
              </div>

              <div className="room-cell">
                <strong>{row.roomName}</strong>
                <small>ID: {row.roomCode}</small>
              </div>

              <div className="time-cell">
                <strong>{row.dateLabel}</strong>
                <small>{row.timeLabel}</small>
              </div>

              <div>
                <span className={`admin-status-pill ${row.status.toLowerCase().replace("-", "")}`}>
                  {row.status}
                </span>
              </div>

              <div>
                <button className="mini-btn" type="button">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="admin-side">
          <div className="side-card">
            <h3>Quick Links</h3>
            {adminQuickLinks.map((item) => (
              <button key={item.id} type="button">
                {item.label}
                {item.badge ? <span className="quick-link-badge">{item.badge}</span> : null}
              </button>
            ))}
          </div>

          <div className="side-card">
            <h3>Recent Activity</h3>
            {adminRecentActivities.map((item) => (
              <div key={item.id}>
                <p>{item.title}</p>
                <small>
                  {item.actor} • {item.when}
                </small>
              </div>
            ))}
          </div>

          <div className="side-card tip">
            <h3>Pro Tip</h3>
            <p>{adminProTip}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default AdminOverviewPage;