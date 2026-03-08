import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import SearchRoomsPage from "./pages/dashboard/SearchRoomsPage";
import MyBookingsPage from "./pages/dashboard/MyBookingsPage";
import AccountStatusPage from "./pages/dashboard/AccountStatusPage";
import RoomDetailsPage from "./pages/dashboard/RoomDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app/search" replace />} />

      <Route path="/app" element={<DashboardLayout />}>
        <Route path="search" element={<SearchRoomsPage />} />
        <Route path="rooms/:roomId" element={<RoomDetailsPage />} />
        <Route path="bookings" element={<MyBookingsPage />} />
        <Route path="account" element={<AccountStatusPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;