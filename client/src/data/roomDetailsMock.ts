export type TimeSlot = {
  time: string;
  status: "available" | "reserved";
};

export type RoomDetails = {
  id: number;
  name: string;
  location: string;
  capacity: number;
  roomCode: string;
  amenities: string[];
  usageNotes: string;
  slots: TimeSlot[];
};

export const roomDetailsMock: RoomDetails[] = [
  {
    id: 1,
    name: "Collaboration Lab 204",
    location: "Central Library, Wing B, Level 2",
    capacity: 6,
    roomCode: "RM-204-CL",
    amenities: ["4K Smart TV", "Central AC", "Glass Whiteboard"],
    usageNotes:
      "This room is optimized for group discussions and digital presentations.",
    slots: [
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
    ],
  },
];