import type { Booking, Room, User } from "../types/types";

export type AccountActivity = {
  id: number;
  userId: string; // UUID
  title: string;
  description: string;
  dateLabel: string;
  status: "incident" | "completed";
};

const createSlots = (reservedHours: number[]): { hour: number; available: boolean }[] =>
  Array.from({ length: 24 }, (_, hour) => ({
    hour,
    available: !reservedHours.includes(hour),
  }));

export const rooms: Room[] = [
  {
    id: 1,
    name: "Collaboration Lab 204",
    capacity: 6,
    location: "Central Library, Wing B, Level 2",
    roomCode: "RM-204-CL",
    slots: createSlots([9, 12, 13, 18]),
  },
  {
    id: 2,
    name: "Seminar Room A",
    capacity: 20,
    location: "Level 1, Main Hall",
    roomCode: "RM-A-MH",
    slots: createSlots([10, 11, 14, 15]),
  },
  {
    id: 3,
    name: "Quiet Pod 04",
    capacity: 1,
    location: "Floor 3, Central Library",
    roomCode: "QP-04",
    slots: createSlots([8, 16, 17]),
  },
];

export const users: User[] = [
  {
    id: "9b3f5d2e-4b8e-4a16-9e1f-2baf3a9e9d01",
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "hashed_password_placeholder",
    strikes: 1,
    role: "admin",
    created_at: "2026-01-10T09:30:00Z",
  },
];

const today = new Date().toISOString().split("T")[0];

export const bookings: Booking[] = [
  {
    id: 1001,
    roomId: 3,
    userId: "9b3f5d2e-4b8e-4a16-9e1f-2baf3a9e9d01",
    date: today,
    startHour: 14,
    endHour: 16,
    checkedIn: false,
    notifications: [
      { channel: "email", time: "13:00", status: "delivered" },
      { channel: "push", time: "13:30", status: "delivered" },
      { channel: "sms", time: "13:35", status: "pending" },
    ],
  },
];

export const accountActivities: AccountActivity[] = [
  {
    id: 1,
    userId: "9b3f5d2e-4b8e-4a16-9e1f-2baf3a9e9d01",
    title: "Strike Added",
    description: "No-show for Room 402 (14:00 - 15:30)",
    dateLabel: "Oct 24, 2023",
    status: "incident",
  },
];