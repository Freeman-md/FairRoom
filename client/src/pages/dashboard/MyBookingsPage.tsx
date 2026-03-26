import { Link } from "react-router-dom";
import { bookings, rooms } from "../../data/mockData";

const CURRENT_USER_ID = "9b3f5d2e-4b8e-4a16-9e1f-2baf3a9e9d01";

const hourLabel = (hour: number) => `${String(hour).padStart(2, "0")}:00`;

function MyBookingsPage() {
  const now = new Date();

  const userBookings = bookings
    .filter((b) => b.userId === CURRENT_USER_ID)
    .sort((a, b) => {
      const aDate = new Date(`${a.date}T${String(a.startHour).padStart(2, "0")}:00:00`).getTime();
      const bDate = new Date(`${b.date}T${String(b.startHour).padStart(2, "0")}:00:00`).getTime();
      return aDate - bDate;
    });

  const upcoming = userBookings.find((b) => {
    const bookingStart = new Date(
      `${b.date}T${String(b.startHour).padStart(2, "0")}:00:00`
    ).getTime();
    return bookingStart > now.getTime();
  });

  if (!upcoming) {
    return (
      <section className="booking-reminder-page">
        <article className="booking-card">
          <header className="booking-card-header">
            <div className="booking-bell" aria-hidden>
              🔔
            </div>
            <h1>My Bookings</h1>
            <p>No upcoming bookings found.</p>
          </header>
        </article>
      </section>
    );
  }

  const room = rooms.find((r) => r.id === upcoming.roomId);
  const bookingStart = new Date(
    `${upcoming.date}T${String(upcoming.startHour).padStart(2, "0")}:00:00`
  );
  const minutesLeft = Math.max(0, Math.floor((bookingStart.getTime() - now.getTime()) / 60000));

  return (
    <section className="booking-reminder-page">
      <article className="booking-card">
        <header className="booking-card-header">
          <div className="booking-bell" aria-hidden>
            🔔
          </div>
          <h1>Booking Reminder</h1>
          <p>
            Your session at {room?.name ?? "your room"} begins in <u>{minutesLeft} minutes</u>.
          </p>
        </header>

        <div className="booking-meta-row">
          <div className="booking-meta-item">
            <span className="meta-icon" aria-hidden>
              📍
            </span>
            <div>
              <small>LOCATION</small>
              <p>{room?.location ?? "Unknown location"}</p>
            </div>
          </div>

          <div className="booking-meta-item">
            <span className="meta-icon" aria-hidden>
              🕒
            </span>
            <div>
              <small>SCHEDULED TIME</small>
              <p>
                {hourLabel(upcoming.startHour)} - {hourLabel(upcoming.endHour)} (Today)
              </p>
            </div>
          </div>
        </div>

        <div className="checkin-box">
          <h3>ⓘ Check-in Instructions</h3>
          <p>
            Please arrive on time. You must scan the QR code located on the room door within 15
            minutes of your start time. Failure to check in will result in automatic cancellation
            and a strike on your account.
          </p>
        </div>

        <div className="notification-history">
          <h4>NOTIFICATION HISTORY</h4>

          <div className="history-chips">
            {upcoming.notifications.map((n, idx) => (
              <div key={`${n.channel}-${idx}`} className="history-chip">
                <span>{n.channel.toUpperCase()}</span>
                <small>{n.time}</small>
                <strong>{n.status === "delivered" ? "Delivered" : "Pending"}</strong>
              </div>
            ))}
          </div>

          <p className="history-note">
            Note: SMS reminders may take up to 5 minutes to deliver depending on your carrier.
          </p>
        </div>

        <footer className="booking-card-footer">
          <p>ⓘ Need to cancel? You have 5 minutes left to avoid penalties.</p>

          <div className="footer-actions">
            <button className="btn-secondary" type="button">
              Get Directions
            </button>
            <Link to={`/app/rooms/${upcoming.roomId}`} className="btn-primary">
              View Details →
            </Link>
          </div>
        </footer>
      </article>

      <nav className="booking-links">
        <a href="#">Help Center</a>
        <a href="#">Booking Policies</a>
        <a href="#">Report an Issue</a>
      </nav>
    </section>
  );
}

export default MyBookingsPage;