import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { iconProps } from "@/lib/icons";
import { cn, formatHour } from "@/lib/utils";
import { Filter } from "@/lib/icons";
import { useSearchRoomsContext } from "../context";
import { CAPACITY_OPTIONS } from "../content";
import { useDebouncedTimeRange } from "../hooks/useDebouncedTimeRange";

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </p>
  );
}

type FilterPanelBodyProps = {
  className?: string;
};

export default function FilterPanelBody({ className }: FilterPanelBodyProps) {
  const { filters, availableAmenities, patchFilters, resetFilters } = useSearchRoomsContext();
  const { draftRange, setDraftRange } = useDebouncedTimeRange(filters.timeRange, (nextRange) =>
    patchFilters({ timeRange: nextRange }),
  );
  const handleReset = () => {
    setDraftRange([0, 24]);
    resetFilters();
  };

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex items-center justify-between px-6 py-5">
        <span className="flex items-center gap-2 text-sm font-semibold text-content">
          <Filter {...iconProps} aria-hidden="true" />
          Filters
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto px-1.5 py-1 text-xs text-muted-foreground"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>

      <Separator />

      <div className="flex flex-1 flex-col gap-0 divide-y divide-border overflow-y-auto">
        <section className="space-y-2.5 px-6 py-4">
          <SectionLabel>Date</SectionLabel>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => patchFilters({ date: e.target.value })}
            className="h-10 w-full rounded-input border border-input bg-surface px-3 text-sm text-content focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </section>

        <section className="space-y-2.5 px-6 py-4">
          <SectionLabel>Capacity</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {CAPACITY_OPTIONS.map((capacity) => (
              <Button
                key={capacity}
                variant={filters.capacity === capacity ? "default" : "outline"}
                size="sm"
                className={cn("h-9 text-sm", filters.capacity !== capacity && "text-content")}
                onClick={() => patchFilters({ capacity: filters.capacity === capacity ? null : capacity })}
              >
                {capacity}+ People
              </Button>
            ))}
          </div>
        </section>

        <section className="space-y-2.5 px-6 py-4">
          <SectionLabel>Time Range</SectionLabel>
          <Slider
            className="px-0.5 py-3"
            value={draftRange}
            onValueChange={(val) => {
              const [start, end] = val as [number, number];
              setDraftRange([start, end]);
            }}
            max={24}
            min={0}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatHour(draftRange[0])}</span>
            <span>{formatHour(draftRange[1])}</span>
          </div>
        </section>

        <section className="space-y-3 px-6 py-4">
          <SectionLabel>Amenities</SectionLabel>
          {availableAmenities.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {availableAmenities.map(({ id, label }) => (
                <label
                  key={id}
                  htmlFor={id}
                  className="flex cursor-pointer items-center gap-2.5 text-sm text-content"
                >
                  <Checkbox
                    id={id}
                    checked={filters.amenityIds.includes(id)}
                    onCheckedChange={(checked) =>
                      patchFilters({
                        amenityIds: checked
                          ? [...filters.amenityIds, id]
                          : filters.amenityIds.filter((amenityId) => amenityId !== id),
                      })
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Amenities will appear from loaded rooms.</p>
          )}
        </section>
      </div>
    </div>
  );
}
