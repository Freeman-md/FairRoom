import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { roomDetailsMock } from "../../data/roomDetailsMock";

function RoomDetailsPage() {
  const { roomId } = useParams();
  const room = useMemo(
    () => roomDetailsMock.find((r) => r.id === Number(roomId)),
    [roomId]
  );

  const [selectedTime, setSelectedTime] = useState<string>("10:00 AM");

  if (!room) return <p>Room not found.</p>;

  return (
    <section className="room-details">
      <Link to="/app/search" className="back-link">← Back to Search Results</Link>

      <div className="room-details-grid">
        <div>
          <div className="photo-placeholder">Room Photography Placeholder</div>
          <h1>{room.name}</h1>
          <p>{room.location}</p>
          <p>Capacity: {room.capacity} Persons • Room ID: {room.roomCode}</p>

          <h3>Amenities</h3>
          {room.amenities.map((item) => (
            <div key={item} className="amenity-item">{item}</div>
          ))}

          <div className="notes-box">
            <strong>Usage Notes</strong>
            <p>{room.usageNotes}</p>
          </div>
        </div>

        <div>
          <h2>Room Availability</h2>
          <p>Select an available time slot below to start your booking process.</p>

          <div className="slots-grid">
            {room.slots.map((slot) => {
              const isReserved = slot.status === "reserved";
              const isSelected = selectedTime === slot.time;

              return (
                <button
                  key={slot.time}
                  disabled={isReserved}
                  onClick={() => setSelectedTime(slot.time)}
                  className={`slot-btn ${isReserved ? "reserved" : ""} ${isSelected ? "selected" : ""}`}
                >
                  <span>{slot.time}</span>
                  <small>{slot.status.toUpperCase()}</small>
                </button>
              );
            })}
          </div>

          <div className="selection-card">
            <strong>Your Selection</strong>
            <p>Single Hour Booking • {selectedTime}</p>
          </div>

          <div className="policy-card">
            <strong>Important Strike Policy</strong>
            <p>
              Failing to check in within 15 minutes of your booking start time
              will result in a strike. 3 strikes lead to a 14-day suspension.
            </p>
          </div>

          <button className="book-btn">Book This Room</button>
        </div>
      </div>
    </section>
  );
}

export default RoomDetailsPage;