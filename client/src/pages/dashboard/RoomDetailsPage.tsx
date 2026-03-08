import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { rooms } from "../../data/mockData";

function RoomDetailsPage() {
  const { roomId } = useParams();
  const numericRoomId = Number(roomId);
  const [selectedTime, setSelectedTime] = useState("10:00 AM");

  const room = useMemo(() => {
    if (Number.isNaN(numericRoomId)) return undefined;
    return rooms.find((r) => r.id === numericRoomId);
  }, [numericRoomId]);

  if (Number.isNaN(numericRoomId)) return <p>Invalid room id.</p>;
  if (!room) return <p>Room not found.</p>;

  return (
    <section className="room-details">
      <Link to="/app/search" className="back-link">
        ← Back to Search Results
      </Link>

      <div className="room-details-grid">
        <div>
          <div className="photo-placeholder">Room Photography Placeholder</div>
          <h1>{room.name}</h1>
          <p>{room.location}</p>
          <p>Capacity: {room.capacity} Persons • Room ID: {room.roomCode}</p>

          <h3>Amenities</h3>
          {room.amenities.map((item) => (
            <div key={item} className="amenity-item">
              {item}
            </div>
          ))}

          <div className="notes-box">
            <strong>Usage Notes</strong>
            <p>{room.usageNotes}</p>
          </div>
        </div>

        <div>
          <h2>Room Availability</h2>
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

          <button className="book-btn">Book This Room</button>
        </div>
      </div>
    </section>
  );
}

export default RoomDetailsPage;