import { useMemo, useState } from "react";
import { rooms } from "../../data/mockData";
import type { Room } from "../../types/types";
import { useNavigate } from "react-router-dom";

function SearchRoomsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [minCapacity, setMinCapacity] = useState(1);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchName = room.name.toLowerCase().includes(search.toLowerCase());
      const matchCapacity = room.capacity >= minCapacity;
      return matchName && matchCapacity;
    });
  }, [search, minCapacity]);

  const onBook = (room: Room) => {
    navigate(`/app/rooms/${room.id}`);
  };

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Search Rooms</h1>
          <p>Find the perfect space for your study group or project.</p>
        </div>

        <input
          className="search-input"
          type="text"
          placeholder="Search room name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="content-grid">
        <div className="filters-card">
          <h3>Filters</h3>

          <label className="field">
            <span>Minimum capacity</span>
            <input
              type="number"
              min={1}
              value={minCapacity}
              onChange={(e) => setMinCapacity(Number(e.target.value) || 1)}
            />
          </label>
        </div>

        <div>
          <h2 className="result-title">Showing {filteredRooms.length} Rooms</h2>

          {filteredRooms.length === 0 ? (
            <div className="empty-state">No rooms found.</div>
          ) : (
            <div className="rooms-grid">
              {filteredRooms.map((room) => (
                <article key={room.id} className="room-card">
                  <h3>{room.name}</h3>
                  <p>Capacity: {room.capacity}</p>
                  <p className="muted">Equipped with high-speed wifi</p>
                  <button onClick={() => onBook(room)}>Book Now</button>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default SearchRoomsPage;