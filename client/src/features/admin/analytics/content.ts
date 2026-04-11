import type { LucideIcon } from "lucide-react";

export type AnalyticsKpi = {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
};

export type AnalyticsBarItem = {
  room: string;
  hours: number;
};

export type AnalyticsPerformanceRow = {
  roomIdentifier: string;
  totalUsageHours: number;
  occupancyPercentage: number;
  efficiency: "High" | "Medium" | "Low";
};

export type AnalyticsInsight = {
  title: string;
  description: string;
  meta?: string;
};

export type AnalyticsPerformanceSection = {
  title: string;
  inlineNote: string;
  rows: AnalyticsPerformanceRow[];
};

export type AnalyticsInsightsSection = {
  title: string;
  recommendation: AnalyticsInsight;
  anomalies: AnalyticsInsight[];
};

export const analyticsHeader = {
  title: "Room Usage Review",
  subtitle: "Analyze peak times and room performance across all campuses.",
} as const;
