import { Clock, iconProps } from "@/lib/icons";

type RecentActivitySectionProps = {
  items: string[];
};

export default function RecentActivitySection({ items }: RecentActivitySectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock {...iconProps} aria-hidden="true" className="text-muted-foreground" />
          <h2 className="text-sm font-bold text-content">Recent Account Activity</h2>
        </div>

        <button type="button" className="text-xs font-medium text-muted-foreground transition-colors hover:text-content">
          View Full History
        </button>
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-surface">
        {items.length === 0 ? (
          <div className="px-4 py-5">
            <h3 className="text-sm font-semibold text-content">No recent account activity yet.</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Account updates will appear here once your bookings or strikes create activity.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li key={item} className="px-4 py-4 text-sm text-content">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
