import { Link } from "react-router-dom";
import { accountActivities, users } from "../../data/mockData";

function AccountStatusPage() {
  const currentUser = users[0];
  const strikeCount = currentUser?.strikes ?? 0;
  const maxStrikes = 3;

  const standingLabel =
    strikeCount === 0 ? "Excellent Standing" : strikeCount === 1 ? "Good Standing" : "At Risk";

  const standingMessage =
    strikeCount === 0
      ? "Perfect record. Keep it up!"
      : strikeCount === 1
        ? "Your account is in great shape!"
        : "Warning: You are close to booking restrictions.";

  const activity = accountActivities.filter((a) => a.userId === (currentUser?.id ?? ""));

  return (
    <section className="account-health-page">
      <header className="account-health-header">
        <h1>Account Health</h1>
        <p>Monitor your booking standing and strike history.</p>
      </header>

      <article className="standing-card">
        <div className="strike-meter" aria-hidden>
          <div className={`meter-bubble ${strikeCount === 0 ? "active" : ""}`}>🛡️</div>
          <div className={`meter-bubble ${strikeCount === 1 ? "active" : ""}`}>1</div>
          <div className={`meter-bubble ${strikeCount === 2 ? "active" : ""}`}>2</div>
          <div className={`meter-bubble ${strikeCount >= 3 ? "active" : ""}`}>3</div>
        </div>

        <div className="standing-content">
          <span className="standing-pill">{standingLabel}</span>
          <h2>{standingMessage}</h2>
          <p>
            Continue following the fair use policy to maintain access to all campus study rooms and
            facilities.
          </p>
          <strong>STRIKE COUNT: {strikeCount} / {maxStrikes}</strong>
        </div>
      </article>

      <div className="quick-actions-grid">
        <Link to="/app/search" className="quick-action-card">
          <div>
            <h3>Find a Room</h3>
            <p>Browse available spaces</p>
          </div>
          <span>›</span>
        </Link>

        <Link to="/app/bookings" className="quick-action-card">
          <div>
            <h3>My Bookings</h3>
            <p>Manage active reservations</p>
          </div>
          <span>›</span>
        </Link>
      </div>

      <section className="policy-section">
        <h2>ⓘ Fair Use Policy</h2>
      </section>

      <section className="activity-section">
        <div className="activity-head">
          <h2>↻ Recent Account Activity</h2>
          <button type="button" className="link-btn">
            View Full History
          </button>
        </div>

        <div className="activity-list">
          {activity.map((item) => (
            <article key={item.id} className="activity-row">
              <div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
              <div className="activity-meta">
                <small>{item.dateLabel}</small>
                <span className={`status-tag ${item.status}`}>
                  {item.status === "incident" ? "Incident" : "Completed"}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default AccountStatusPage;