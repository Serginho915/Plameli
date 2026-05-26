/**
 * Mock API service for Google Calendar integration.
 * Replace the implementation of these functions with real fetch calls later.
 */

export interface AvailableSlots {
  [date: string]: string[]; // ISO date string (YYYY-MM-DD) -> array of available times
}

/**
 * Simulates fetching available slots for a given month/year.
 * In a real scenario, this would call your backend or Google Calendar API directly.
 */
export const fetchAvailableSlots = async (year: number, month: number): Promise<AvailableSlots> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const slots: AvailableSlots = {};
  
  // Generate some mock data for the current and next month
  // We'll mark some days as having specific times, and some as fully booked (empty array)
  const lastDay = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= lastDay; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Randomly assign some times or leave empty
    // 0 = Sunday, 6 = Saturday (we'll keep weekends empty in mock)
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      if (day % 3 === 0) {
        slots[dateKey] = ["09:00", "11:00", "14:00", "16:00"];
      } else if (day % 2 === 0) {
        slots[dateKey] = ["10:00", "12:00", "15:00", "17:00"];
      } else {
        slots[dateKey] = ["09:00", "10:00", "13:00", "15:00", "18:00"];
      }
    } else {
      slots[dateKey] = []; // Weekends are busy
    }
  }

  return slots;
};
