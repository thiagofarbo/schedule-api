import { ScheduleData } from "./../interfaces/ScheduleInterfaces";
import { getHours, isBefore, startOfHour } from "date-fns";
import { ScheduleRepository } from "../repositories/ScheduleRepository";

class ScheduleService {
  private scheduleRepository: ScheduleRepository;

  constructor() {
    this.scheduleRepository = new ScheduleRepository();
  }

  async create({ name, phone, date, user_id }: ScheduleData) {
   
    const hourStart = this.formatDate(date);

    this.validateTimeForSchedule(hourStart);
    this.isCurrentDate(hourStart);
    this.isDateAvailableForSchedule(hourStart, user_id);

    const schedule = await this.scheduleRepository.create({
      name,
      phone,
      date: hourStart,
      user_id
    });

    return schedule;
  }

  async listScheduleByDate(date: Date) {
    const schedule = await this.scheduleRepository.listSchedulesByDate(date);

    return schedule;
  }

  async update(id: string, date: Date, user_id: string) {
    const dateFormatted = this.formatDate(date);
    this.isCurrentDate(dateFormatted);
    this.isDateAvailableForSchedule(dateFormatted,user_id);

    const schedule = await this.scheduleRepository.update(id, dateFormatted);

    return schedule;
  }

  private formatDate(date: Date) {
    const dateFormatted = new Date(date);
    const hourStart = startOfHour(dateFormatted);
    console.log(hourStart);
    return hourStart;
  }

  private isCurrentDate(date: Date) {
    if (isBefore(date, new Date())) {
      throw new Error("Is is not allowed to schedule old dates");
    }
  }

  private async isDateAvailableForSchedule(date: Date, user_id: string) {
    const isDateAvailable = await this.scheduleRepository.findByDate(date, user_id);
    if (isDateAvailable != null) {
      throw new Error("Date is not available for schedule.");
    }
  }

  private validateTimeForSchedule(date: Date) {
    const hour = getHours(date);
    if (hour < 9 || hour > 19) {
      throw new Error("Schedule must be beteween 9hs and 19hs.");
    }
  }
}

export { ScheduleService };
