import { Staff } from '../models/Staff';
import { Appointment } from '../models/Appointment';
import { SalonSettings } from '../models/SalonSettings';

// Helper to convert "HH:mm" to minutes from midnight
export const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper to convert minutes from midnight to "HH:mm"
export const minutesToTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export interface SlotAvailability {
  startTime: string;
  endTime: string;
  available: boolean;
  reason?: string;
}

export class AvailabilityService {
  /**
   * Calculate available time slots for a specific stylist (or any stylist) on a given date for a specific service duration
   */
  static async getAvailableSlots(params: {
    stylistId?: string;
    date: string; // YYYY-MM-DD
    durationMinutes: number;
  }): Promise<{ slots: SlotAvailability[]; stylistName?: string }> {
    const { stylistId, date, durationMinutes } = params;

    // 1. Get salon settings for opening/closing hours and buffer time
    let settings = await SalonSettings.findOne();
    if (!settings) {
      settings = await SalonSettings.create({});
    }

    const salonOpenMinutes = timeToMinutes(settings.openingHours || '10:00');
    const salonCloseMinutes = timeToMinutes(settings.closingHours || '20:00');
    const bufferMinutes = settings.bufferTimeMinutes || 15;

    // Check day of week
    const dateObj = new Date(date + 'T00:00:00Z');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[dateObj.getUTCDay()];

    if (!settings.workingDays.includes(dayName)) {
      return { slots: [], stylistName: undefined };
    }

    let targetStylist: any = null;
    if (stylistId && stylistId !== 'any') {
      targetStylist = await Staff.findById(stylistId);
      if (!targetStylist || !targetStylist.active || targetStylist.leaveStatus) {
        return { slots: [], stylistName: targetStylist?.name };
      }
      if (!targetStylist.workingDays.includes(dayName)) {
        return { slots: [], stylistName: targetStylist.name };
      }
    }

    // Determine working hours window
    let startMinutes = salonOpenMinutes;
    let endMinutes = salonCloseMinutes;

    if (targetStylist && targetStylist.workingHours) {
      const stylistStart = timeToMinutes(targetStylist.workingHours.start);
      const stylistEnd = timeToMinutes(targetStylist.workingHours.end);
      startMinutes = Math.max(salonOpenMinutes, stylistStart);
      endMinutes = Math.min(salonCloseMinutes, stylistEnd);
    }

    // Fetch existing appointments on that date that aren't cancelled
    const appointmentQuery: any = {
      appointmentDate: date,
      status: { $nin: ['CANCELLED'] },
    };

    if (targetStylist) {
      appointmentQuery.stylist = targetStylist._id;
    }

    const existingAppointments = await Appointment.find(appointmentQuery);

    // If searching for "any" stylist, we need all active stylists working that day
    let activeStylists: any[] = [];
    if (!targetStylist) {
      activeStylists = await Staff.find({
        role: 'STYLIST',
        active: true,
        leaveStatus: false,
        workingDays: dayName,
      });
    }

    // Generate intervals every 30 minutes
    const slots: SlotAvailability[] = [];
    const slotStep = 30; // 30-minute intervals

    for (let current = startMinutes; current + durationMinutes <= endMinutes; current += slotStep) {
      const slotStart = current;
      const slotEnd = current + durationMinutes;
      const slotStartTimeStr = minutesToTime(slotStart);
      const slotEndTimeStr = minutesToTime(slotEnd);

      let isAvailable = false;

      if (targetStylist) {
        // Check conflicts for this single stylist
        const hasConflict = existingAppointments.some((appt) => {
          const apptStart = timeToMinutes(appt.startTime);
          const apptEnd = timeToMinutes(appt.endTime);
          // Overlap check with buffer
          return slotStart < apptEnd && slotEnd > apptStart;
        });

        isAvailable = !hasConflict;
      } else {
        // "Any stylist": is there at least ONE active stylist free during this slot?
        if (activeStylists.length > 0) {
          const availableStylist = activeStylists.find((stylist) => {
            const stylistAppointments = existingAppointments.filter(
              (appt) => appt.stylist.toString() === stylist._id.toString()
            );
            const hasConflict = stylistAppointments.some((appt) => {
              const apptStart = timeToMinutes(appt.startTime);
              const apptEnd = timeToMinutes(appt.endTime);
              return slotStart < apptEnd && slotEnd > apptStart;
            });
            return !hasConflict;
          });

          isAvailable = !!availableStylist;
        }
      }

      slots.push({
        startTime: slotStartTimeStr,
        endTime: slotEndTimeStr,
        available: isAvailable,
      });
    }

    return {
      slots,
      stylistName: targetStylist ? targetStylist.name : 'Any Available Stylist',
    };
  }

  /**
   * Check if a specific stylist has conflict for requested time
   */
  static async hasConflict(
    stylistId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludeAppointmentId?: string
  ): Promise<boolean> {
    const query: any = {
      stylist: stylistId,
      appointmentDate: date,
      status: { $nin: ['CANCELLED'] },
    };

    if (excludeAppointmentId) {
      query._id = { $ne: excludeAppointmentId };
    }

    const appointments = await Appointment.find(query);
    const newStart = timeToMinutes(startTime);
    const newEnd = timeToMinutes(endTime);

    return appointments.some((appt) => {
      const apptStart = timeToMinutes(appt.startTime);
      const apptEnd = timeToMinutes(appt.endTime);
      return newStart < apptEnd && newEnd > apptStart;
    });
  }
}
