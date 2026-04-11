import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { fairroomApi } from "@/api/fairroomApi";
import AdminAnalyticsPage from "@/pages/admin/AdminAnalyticsPage";

vi.mock("@/api/fairroomApi", () => ({
  fairroomApi: {
    getAdminRoomUsage: vi.fn(),
  },
}));

describe("AdminAnalyticsPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders analytics derived from backend room usage data", async () => {
    vi.mocked(fairroomApi.getAdminRoomUsage).mockResolvedValue({
      groupBy: "room",
      startsAt: null,
      endsAt: null,
      summary: {
        mostPopularRoom: { value: "RM-B201", text: "8 bookings" },
        averageBookingDuration: { value: "1.1h", text: "65 min avg per booking" },
        noShowRate: { value: "3.6%", text: "1 of 28 bookings were no-shows" },
      },
      usageDistribution: [
        { room: "New room", hours: 5 },
        { room: "RM 405", hours: 2 },
        { room: "RM-A101", hours: 2 },
        { room: "RM-A102", hours: 1 },
        { room: "RM-B201", hours: 10 },
        { room: "RM-B202", hours: 3 },
        { room: "RM-C301", hours: 1.5 },
        { room: "RM-Q101", hours: 5 },
        { room: "RM-TEST", hours: 1 },
      ],
      performanceBreakdown: [
        {
          roomIdentifier: "RM-B201",
          totalUsageHours: 10,
          occupancyPercentage: 2.8,
          efficiency: "Low",
        },
      ],
      insights: {
        recommendation: {
          title: "Consider promoting RM-A102",
          description: "RM-A102 has the lowest utilisation (1.0 h). Consider making it more visible or reviewing its availability.",
          meta: "1 bookings recorded",
        },
        anomalies: [
          {
            title: "High no-show rate in RM-A102",
            description: "RM-A102 has a 100% no-show rate (1 of 1 bookings).",
            meta: "100% no-show",
          },
        ],
      },
    });

    render(
      <MemoryRouter initialEntries={["/admin/analytics"]}>
        <Routes>
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Room Usage Review" })).toBeInTheDocument();
    });

    expect(screen.queryByRole("button", { name: /Filters/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Export PDF/i })).not.toBeInTheDocument();
    expect(screen.getByText("Most Popular Room")).toBeInTheDocument();
    expect(screen.getAllByText("RM-B201")[0]).toBeInTheDocument();
    expect(screen.getByText("Usage Distribution")).toBeInTheDocument();
    expect(screen.getByLabelText("RM-B201 10 hours")).toBeInTheDocument();
    expect(screen.getByText("Room Performance")).toBeInTheDocument();
    expect(screen.getByText("System Insights")).toBeInTheDocument();
    expect(screen.getByText("Consider promoting RM-A102")).toBeInTheDocument();
    expect(screen.getByText("High no-show rate in RM-A102")).toBeInTheDocument();
  });

  it("shows an empty state when analytics data is missing", async () => {
    vi.mocked(fairroomApi.getAdminRoomUsage).mockResolvedValue({
      groupBy: "room",
      startsAt: null,
      endsAt: null,
      summary: {
        mostPopularRoom: { value: "No data", text: "No room usage has been recorded yet." },
        averageBookingDuration: { value: "0 Hours", text: "No booking activity is available yet." },
        noShowRate: { value: "0%", text: "No show rate will appear once bookings exist." },
      },
      usageDistribution: [],
      performanceBreakdown: [],
      insights: {
        recommendation: {
          title: "No insight available",
          description: "No analytics data has been recorded yet.",
        },
        anomalies: [],
      },
    });

    render(
      <MemoryRouter initialEntries={["/admin/analytics"]}>
        <Routes>
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("No analytics data is available yet")).toBeInTheDocument();
    });
  });
});
