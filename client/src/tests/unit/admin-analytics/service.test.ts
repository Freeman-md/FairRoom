import { afterEach, describe, expect, it, vi } from "vitest";

import { fairroomApi } from "@/api/fairroomApi";

import { loadAdminRoomUsage } from "@/features/admin/analytics/adminAnalyticsService";

vi.mock("@/api/fairroomApi", () => ({
  fairroomApi: {
    getAdminRoomUsage: vi.fn(),
  },
}));

describe("admin analytics service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads room usage analytics from the backend", async () => {
    vi.mocked(fairroomApi.getAdminRoomUsage).mockResolvedValue({
      groupBy: "room",
      startsAt: null,
      endsAt: null,
      summary: {
        mostPopularRoom: { value: "RM-B201", text: "8 bookings" },
        averageBookingDuration: { value: "1.1h", text: "65 min avg per booking" },
        noShowRate: { value: "3.6%", text: "1 of 28 bookings were no-shows" },
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

    await expect(loadAdminRoomUsage()).resolves.toEqual({
      groupBy: "room",
      startsAt: null,
      endsAt: null,
      summary: {
        mostPopularRoom: { value: "RM-B201", text: "8 bookings" },
        averageBookingDuration: { value: "1.1h", text: "65 min avg per booking" },
        noShowRate: { value: "3.6%", text: "1 of 28 bookings were no-shows" },
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

    expect(fairroomApi.getAdminRoomUsage).toHaveBeenCalledWith({
      groupBy: "room",
    });
  });
});
