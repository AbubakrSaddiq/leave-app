import { supabase } from "@/lib/supabase";

export const leaveService = {
  /**
   * Fetches public holidays for a specific year
   */
  async getHolidays(year: number): Promise<Set<string>> {
    const { data: holidays } = await supabase
      .from("public_holidays")
      .select("date")
      .eq("year", year)
      .eq("is_active", true);

    return new Set(holidays?.map((h) => h.date) || []);
  },

  /**
   * Calculates the end date based on working days, skipping weekends and holidays
   */
  async calculateEndDate(startDate: string, workingDays: number): Promise<string> {
    if (!startDate || workingDays <= 0) return "";
    
    const holidayDates = await this.getHolidays(new Date(startDate).getFullYear());
    let currentDate = new Date(startDate);
    let daysAdded = 0;

    while (daysAdded < workingDays) {
      const dayOfWeek = currentDate.getDay();
      const dateString = currentDate.toISOString().split("T")[0];

      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidayDates.has(dateString)) {
        daysAdded++;
      }

      if (daysAdded < workingDays) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    return currentDate.toISOString().split("T")[0];
  },

  /**
   * Calculates the resumption date (next business day)
   */
  async calculateResumptionDate(endDate: string): Promise<string> {
    if (!endDate) return "";
    const holidayDates = await this.getHolidays(new Date(endDate).getFullYear());
    let resumptionDate = new Date(endDate);
    resumptionDate.setDate(resumptionDate.getDate() + 1);

    while (true) {
      const dayOfWeek = resumptionDate.getDay();
      const dateString = resumptionDate.toISOString().split("T")[0];

      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidayDates.has(dateString)) {
        break;
      }
      resumptionDate.setDate(resumptionDate.getDate() + 1);
    }
    return resumptionDate.toISOString().split("T")[0];
  }
};