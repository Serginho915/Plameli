import { apiClient } from "@/lib/apiClient";

export interface AvailableSlot {
  date: string;
  time: string;
  start: string;
  end: string;
}

export interface AvailableSlots {
  [date: string]: AvailableSlot[];
}

interface AvailabilityResponse {
  slots: AvailableSlot[];
}

export interface BookingPayload {
  slotStart: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  consultationFormat: "standard" | "priority";
  meetingType: "sofia" | "zoom";
  language: string;
}

export interface BookingResponse {
  url: string;
  sessionId: string;
}

export const fetchAvailableSlots = async (): Promise<AvailableSlots> => {
  const response = await apiClient<AvailabilityResponse>("/consultation/availability");
  return response.slots.reduce<AvailableSlots>((result, slot) => {
    (result[slot.date] ||= []).push(slot);
    return result;
  }, {});
};

export const bookConsultation = (payload: BookingPayload): Promise<BookingResponse> =>
  apiClient<BookingResponse>("/consultation/book", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const cancelConsultationCheckout = (sessionId: string): Promise<null> =>
  apiClient<null>("/stripe/consultation-cancel/", {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  });

export const confirmConsultationCheckout = (sessionId: string): Promise<{
  status: string;
  eventId: string;
  eventUrl: string;
}> =>
  apiClient("/stripe/consultation-confirm/", {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  });
