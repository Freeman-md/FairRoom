import { describe, expect, it } from "vitest";

import type { AdminRoomUsageResponse } from "@/api/contracts";

import { buildAdminAnalyticsViewModel } from "@/features/admin/analytics/adminAnalyticsMappers";

function buildUsageResponse(overrides: Partial<AdminRoomUsageResponse> = {}): AdminRoomUsageResponse {
  return {
    groupBy: "room",
    startsAt: null,
    endsAt: null,
    summary: {
      mostPopularRoom: {
        value: "RM-B201",
        text: "8 bookings",
      },
      averageBookingDuration: {
        value: "1.1h",
        text: "65 min avg per booking",
      },
      noShowRate: {
        value: "3.6%",
        text: "1 of 28 bookings were no-shows",
      },
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
        roomIdentifier: "New room",
        totalUsageHours: 5,
        occupancyPercentage: 1.4,
        efficiency: "Low",
      },
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
    ...overrides,
  };
}

describe("admin analytics mappers", () => {
  it("derives summary cards, chart, performance and insights from backend room usage data", () => {
    const viewModel = buildAdminAnalyticsViewModel(buildUsageResponse());

    expect(viewModel.hasData).toBe(true);
    expect(viewModel.kpis).toHaveLength(3);
    expect(viewModel.kpis[0]).toMatchObject({
      label: "Most Popular Room",
      value: "RM-B201",
      note: "8 bookings",
    });
    expect(viewModel.kpis[1]).toMatchObject({
      label: "Avg Booking Duration",
      value: "1.1h",
      note: "65 min avg per booking",
    });
    expect(viewModel.kpis[2]).toMatchObject({
      label: "No-Show Rate",
      value: "3.6%",
      note: "1 of 28 bookings were no-shows",
    });
    expect(viewModel.chart.groupLabel).toBe("Group by: room");
    expect(viewModel.chart.bars).toHaveLength(9);
    expect(viewModel.chart.bars[4]).toEqual({ room: "RM-B201", hours: 10 });
    expect(viewModel.performance.title).toBe("Room Performance");
    expect(viewModel.performance.rows[1]).toMatchObject({
      roomIdentifier: "RM-B201",
      totalUsageHours: 10,
      occupancyPercentage: 2.8,
      efficiency: "Low",
    });
    expect(viewModel.insights.title).toBe("System Insights");
    expect(viewModel.insights.recommendation.title).toBe("Consider promoting RM-A102");
    expect(viewModel.insights.anomalies).toHaveLength(1);
  });

  it("handles empty room usage data", () => {
    const viewModel = buildAdminAnalyticsViewModel(buildUsageResponse({ usageDistribution: [], performanceBreakdown: [] }));

    expect(viewModel.hasData).toBe(false);
    expect(viewModel.chart.bars).toEqual([]);
    expect(viewModel.performance.rows).toEqual([]);
  });
});
