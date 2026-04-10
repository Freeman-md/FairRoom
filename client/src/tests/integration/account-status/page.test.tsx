import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AccountStatusPage from "@/pages/AccountStatusPage";
import { fairroomApi } from "@/api/fairroomApi";

vi.mock("@/api/fairroomApi", () => ({
  fairroomApi: {
    getAccountStatus: vi.fn(),
    getAccountActivities: vi.fn(),
  },
}));

describe("AccountStatusPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads the account status from the backend and shows an empty activity state", async () => {
    vi.mocked(fairroomApi.getAccountStatus).mockResolvedValue({
      activeStrikes: 1,
      bookingEligible: true,
      accountState: "good",
    });
    vi.mocked(fairroomApi.getAccountActivities).mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={["/account"]}>
        <Routes>
          <Route path="/account" element={<AccountStatusPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Account Health" })).toBeInTheDocument();
    });

    expect(screen.getByText("Strike Count: 1 / 3")).toBeInTheDocument();
    expect(screen.getByText("Your account is in great shape!")).toBeInTheDocument();
    expect(screen.getByText("No recent account activity yet.")).toBeInTheDocument();
  });

  it("shows an error state when the backend request fails", async () => {
    vi.mocked(fairroomApi.getAccountStatus).mockRejectedValue(new Error("Account status unavailable"));
    vi.mocked(fairroomApi.getAccountActivities).mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={["/account"]}>
        <Routes>
          <Route path="/account" element={<AccountStatusPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Account status unavailable")).toBeInTheDocument();
    });
  });
});
