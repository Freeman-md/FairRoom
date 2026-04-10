import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyBookingsScope } from "../hooks/useMyBookingsScope";
import BookingList from "./BookingList";

type BookingTab = "upcoming" | "history";

const PAGE_SIZE_OPTIONS = [12, 24, 36];

export default function BookingsTabs() {
  const [activeTab, setActiveTab] = useState<BookingTab>("upcoming");
  const [pageSize, setPageSize] = useState(12);

  const upcoming = useMyBookingsScope("active", pageSize);
  const history = useMyBookingsScope("past", pageSize);

  const totalLabel = useMemo(() => {
    return activeTab === "upcoming" ? upcoming.total : history.total;
  }, [activeTab, history.total, upcoming.total]);

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as BookingTab)} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.total})</TabsTrigger>
          <TabsTrigger value="history">History ({history.total})</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground sm:block">Per page:</span>
          <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-[92px]">
              <SelectValue placeholder="12" />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <TabsContent value="upcoming" className="mt-0">
        <BookingList
          bookings={upcoming.bookings}
          error={upcoming.error}
          isLoading={upcoming.isLoading}
          page={upcoming.page}
          pageSize={upcoming.pageSize}
          totalPages={upcoming.totalPages}
          onPageChange={upcoming.setPage}
          onRetry={upcoming.retry}
          onRefresh={upcoming.retry}
          emptyTitle="No upcoming bookings"
          emptyDescription="Your future reservations will appear here once they are confirmed."
        />
      </TabsContent>

      <TabsContent value="history" className="mt-0">
        <BookingList
          bookings={history.bookings}
          error={history.error}
          isLoading={history.isLoading}
          page={history.page}
          pageSize={history.pageSize}
          totalPages={history.totalPages}
          onPageChange={history.setPage}
          onRetry={history.retry}
          onRefresh={history.retry}
          emptyTitle="No booking history"
          emptyDescription="Completed and cancelled bookings will appear here."
        />
      </TabsContent>

      <p className="sr-only">Total bookings in the selected tab: {totalLabel}</p>
    </Tabs>
  );
}
