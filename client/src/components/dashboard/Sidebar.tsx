import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink
          to="/app/search"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Search Rooms
        </NavLink>

        <NavLink
          to="/app/bookings"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          My Bookings
        </NavLink>

        <NavLink
          to="/app/account"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Account Status
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;