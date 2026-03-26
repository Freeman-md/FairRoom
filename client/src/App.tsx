import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import SearchRoomsPage from "./pages/dashboard/SearchRoomsPage";
import MyBookingsPage from "./pages/dashboard/MyBookingsPage";
import AccountStatusPage from "./pages/dashboard/AccountStatusPage";
import RoomDetailsPage from "./pages/dashboard/RoomDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { currentUser } from "./data/sessionMock";

import AdminOverviewPage from "./pages/dashboard/admin/AdminOverviewPage";
import AdminStrikesPage from "./pages/dashboard/admin/AdminStrikesPage";
import AdminAnalyticsPage from "./pages/dashboard/admin/AdminAnalyticsPage";

function App() {
  const isAdmin = currentUser?.role === "admin";

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAdmin ? "/app/admin/overview" : "/app/search"} replace />}
      />

      <Route path="/app" element={<DashboardLayout />}>
        {/* student */}
        <Route path="search" element={<SearchRoomsPage />} />
        <Route path="rooms/:roomId" element={<RoomDetailsPage />} />
        <Route path="bookings" element={<MyBookingsPage />} />
        <Route path="account" element={<AccountStatusPage />} />

        {/* admin */}
        <Route path="admin/overview" element={<AdminOverviewPage />} />
        <Route path="admin/strikes" element={<AdminStrikesPage />} />
        <Route path="admin/analytics" element={<AdminAnalyticsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;