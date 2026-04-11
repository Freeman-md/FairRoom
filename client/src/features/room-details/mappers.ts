import type { Booking } from "@/api/contracts";
import type { TimeSlot } from "@/features/search-rooms/components/SlotButton";
import { formatHour } from "@/lib/utils";

export const SLOT_START = 8;
const SLOT_END = 22;

function toLocalIsoDate(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function deriveTimeSlots(bookings: Booking[], date: string, now = new Date()): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const today = toLocalIsoDate(now);

  for (let hour = SLOT_START; hour < SLOT_END; hour++) {
    const slotStart = new Date(`${date}T${String(hour).padStart(2, "0")}:00:00`);
    const slotEnd = new Date(`${date}T${String(hour + 1).padStart(2, "0")}:00:00`);

    const isReserved = bookings.some((booking) => {
      if (booking.status === "cancelled") return false;
      const bStart = new Date(booking.startsAt);
      const bEnd = new Date(booking.endsAt);
      return bStart < slotEnd && bEnd > slotStart;
    });

    const isPast = date < today || (date === today && slotStart < now);

    slots.push({
      time: formatHour(hour),
      status: isReserved ? "reserved" : isPast ? "past" : "available",
    });
  }

  return slots;
}
