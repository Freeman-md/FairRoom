import type { Room, Booking, User, TimeSlot } from "../types/types";

const defaultSlots: TimeSlot[] = [
  { time: "08:00 AM", status: "available" },
  { time: "09:00 AM", status: "reserved" },
  { time: "10:00 AM", status: "available" },
  { time: "11:00 AM", status: "available" },
  { time: "12:00 PM", status: "reserved" },
  { time: "01:00 PM", status: "reserved" },
  { time: "02:00 PM", status: "available" },
  { time: "03:00 PM", status: "available" },
  { time: "04:00 PM", status: "available" },
  { time: "05:00 PM", status: "available" },
  { time: "06:00 PM", status: "reserved" },
  { time: "07:00 PM", status: "available" },
];

export const rooms: Room[] = [
  {
    id: 1,
    name: "Collaboration Lab 204",
    capacity: 6,
    location: "Central Library, Wing B, Level 2",
    roomCode: "RM-204-CL",
    amenities: ["4K Smart TV", "Central AC", "Glass Whiteboard"],
    usageNotes:
      "This room is optimized for group discussions and digital presentations.",
    slots: defaultSlots,
  },
  {
    id: 2,
    name: "Seminar Room A",
    capacity: 20,
    location: "Level 1, Main Hall",
    roomCode: "RM-A-MH",
    amenities: ["Projector", "PA System", "Whiteboard"],
    usageNotes: "Best for seminars and presentations.",
    slots: defaultSlots,
  },
  {
    id: 3,
    name: "Quiet Pod 04",
    capacity: 1,
    location: "Library, North",
    roomCode: "QP-04",
    amenities: ["Desk Lamp", "Charging Port", "Noise Insulation"],
    usageNotes: "Single-person silent focus pod.",
    slots: defaultSlots,
  },
];

export const users: User[] = [
  { id: 1, name: "Alice", strikes: 1, role: "student" },
];

export const bookings: Booking[] = [];