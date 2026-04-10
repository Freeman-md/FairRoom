import type { Booking, BookingDetailResponse, CreateBookingRequest } from "@/api/contracts";
import { authHeaders } from "../auth-storage";
import { apiClient } from "../client";
import { readApiErrorMessage } from "../errors";

export async function createBooking(payload: CreateBookingRequest): Promise<Booking> {
  try {
    const { data } = await apiClient.post<Booking>("/bookings", payload, {
      headers: authHeaders(),
    });
    return data;
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "We could not create your booking."));
  }
}

export async function getBooking(bookingId: string): Promise<BookingDetailResponse> {
  try {
    const { data } = await apiClient.get<BookingDetailResponse>(`/bookings/${bookingId}`, {
      headers: authHeaders(),
    });
    return data;
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to load booking details."));
  }
}
