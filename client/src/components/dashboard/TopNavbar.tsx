function TopNavbar() {
  return (
    <header className="topnav">
      <div className="topnav-left">
        <div className="logo">FairRoom</div>
        <span className="role-badge">STUDENT</span>
      </div>

      <div className="topnav-right">
        <button className="icon-btn" aria-label="Notifications">
          🔔
        </button>
        <div className="profile">
          <div>
            <p className="profile-name">Alex Student</p>
            <p className="profile-id">ID: 100293</p>
          </div>
          <img
            src="https://i.pravatar.cc/40?img=12"
            alt="Profile"
            className="avatar"
          />
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;