import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { rooms } from "../../data/mockData";

const toHourLabel = (hour: number) => {
  const h = hour % 24;
  const ampm = h >= 12 ? "PM" : "AM";
  const normalized = h % 12 === 0 ? 12 : h % 12;
  return `${String(normalized).padStart(2, "0")}:00 ${ampm}`;
};

function RoomDetailsPage() {
  const { roomId } = useParams();
  const numericRoomId = Number(roomId);

  const room = useMemo(() => {
    if (Number.isNaN(numericRoomId)) return undefined;
    return rooms.find((r) => r.id === numericRoomId);
  }, [numericRoomId]);

  const [selectedHour, setSelectedHour] = useState<number | null>(null);

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
          <p>
            Capacity: {room.capacity} Persons • Room ID: {room.roomCode}
          </p>
        </div>

        <div>
          <h2>Room Availability</h2>
          <div className="slots-grid">
            {room.slots.map((slot) => {
              const isReserved = !slot.available;
              const isSelected = selectedHour === slot.hour;

              return (
                <button
                  key={slot.hour}
                  disabled={isReserved}
                  onClick={() => setSelectedHour(slot.hour)}
                  className={`slot-btn ${isReserved ? "reserved" : ""} ${isSelected ? "selected" : ""}`}
                  type="button"
                >
                  <span>{toHourLabel(slot.hour)}</span>
                  <small>{isReserved ? "RESERVED" : "AVAILABLE"}</small>
                </button>
              );
            })}
          </div>

          <button className="book-btn" type="button" disabled={selectedHour === null}>
            {selectedHour === null ? "Select a time slot first" : `Book ${toHourLabel(selectedHour)}`}
          </button>
        </div>
      </div>
    </section>
  );
}

export default RoomDetailsPage;