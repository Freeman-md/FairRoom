import { Clock, TrendingUp, Users } from "@/lib/icons";

import type { AdminRoomUsageResponse } from "@/api/contracts";

import type {
  AnalyticsBarItem,
  AnalyticsInsightsSection,
  AnalyticsKpi,
  AnalyticsPerformanceRow,
  AnalyticsPerformanceSection,
} from "./content";

export type AnalyticsUsageChart = {
  title: string;
  subtitle: string;
  groupLabel: string;
  bars: readonly AnalyticsBarItem[];
  yAxis: readonly number[];
};

export type AdminAnalyticsViewModel = {
  kpis: AnalyticsKpi[];
  chart: AnalyticsUsageChart;
  performance: AnalyticsPerformanceSection;
  insights: AnalyticsInsightsSection;
  hasData: boolean;
};


function buildYAxis(maxValue: number): number[] {
  const upperBound = Math.max(Math.ceil(maxValue / 10) * 10, 10);
  const step = upperBound / 4;

  return [upperBound, upperBound - step, upperBound - step * 2, upperBound - step * 3, 0].map((value) =>
    Math.max(Math.round(value), 0),
  );
}

function getTopItem(items: AdminRoomUsageResponse["usageDistribution"]) {
  return items.reduce<AdminRoomUsageResponse["usageDistribution"][number] | null>((best, current) => {
    if (!best) return current;
    if (current.hours > best.hours) return current;
    return best;
  }, null);
}

function getMaxUsageHours(items: AdminRoomUsageResponse["usageDistribution"]) {
  return items.reduce((max, item) => Math.max(max, item.hours), 0);
}

export function buildAdminAnalyticsViewModel(
  response: AdminRoomUsageResponse,
): AdminAnalyticsViewModel {
  const topRoom = getTopItem(response.usageDistribution);
  const maxHours = getMaxUsageHours(response.usageDistribution);

  const kpis: AnalyticsKpi[] = [
    {
      label: "Most Popular Room",
      value: response.summary.mostPopularRoom.value,
      note: response.summary.mostPopularRoom.text,
      icon: TrendingUp,
    },
    {
      label: "Avg Booking Duration",
      value: response.summary.averageBookingDuration.value,
      note: response.summary.averageBookingDuration.text,
      icon: Clock,
    },
    {
      label: "No-Show Rate",
      value: response.summary.noShowRate.value,
      note: response.summary.noShowRate.text,
      icon: Users,
    },
  ];

  const performanceRows: AnalyticsPerformanceRow[] = response.performanceBreakdown.map((item) => ({
    roomIdentifier: item.roomIdentifier,
    totalUsageHours: item.totalUsageHours,
    occupancyPercentage: item.occupancyPercentage,
    efficiency: item.efficiency,
  }));

  return {
    kpis,
    chart: {
      title: "Usage Distribution",
      subtitle: "Booking hours per room for the current period.",
      groupLabel: `Group by: ${response.groupBy}`,
      bars: response.usageDistribution.map((item) => ({
        room: item.room,
        hours: item.hours,
      })),
      yAxis: buildYAxis(maxHours),
    },
    performance: {
      title: "Room Performance",
      inlineNote: topRoom ? `${topRoom.room} leads the current period` : "No usage recorded yet",
      rows: performanceRows,
    },
    insights: {
      title: "System Insights",
      recommendation: response.insights.recommendation,
      anomalies: response.insights.anomalies,
    },
    hasData: response.usageDistribution.length > 0 || response.performanceBreakdown.length > 0,
  };
}
