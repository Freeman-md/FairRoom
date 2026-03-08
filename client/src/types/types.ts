export interface TimeSlot {
  time: string;
  status: "available" | "reserved";
}

export interface Room {
  id: number;
  name: string;
  capacity: number;
  location: string;
  roomCode: string;
  amenities: string[];
  usageNotes: string;
  slots: TimeSlot[];
}

export interface Booking {
  id: number;
  roomId: number;
  userId: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface User {
  id: number;
  name: string;
  strikes: number;
  role: "student" | "admin";
}