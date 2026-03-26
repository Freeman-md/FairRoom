export type UserRole = "student" | "admin";

export interface Room {
  id: number;
  name: string;
  capacity: number;
  location: string;
  roomCode: string;
  slots: { hour: number; available: boolean }[];
}

export interface BookingNotification {
  channel: "email" | "push" | "sms";
  time: string; // "13:00"
  status: "delivered" | "pending";
}

export interface Booking {
  id: number;
  roomId: number;
  userId: string; // backend User.id is UUID
  date: string; // YYYY-MM-DD
  startHour: number; // 0..23
  endHour: number; // 1..24
  checkedIn: boolean;
  notifications: BookingNotification[];
}

export interface User {
  id: string; // UUID
  name: string;
  email: string;
  password: string;
  strikes: number; // backend u8
  role: UserRole;
  created_at: string; // ISO datetime (DateTime<Utc>)
}