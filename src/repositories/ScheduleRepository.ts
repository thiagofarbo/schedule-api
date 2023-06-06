import { endOfDay, startOfDay } from "date-fns";
import { prisma } from "../database/prisma"
import { ScheduleData } from "../interfaces/ScheduleInterfaces";

class ScheduleRepository{

    async create( {name, phone, date, user_id}: ScheduleData){
        console.log(user_id);
        const schedule =  await prisma.schedule.create({
            data: { name, phone, date, user_id },
        });
        return schedule;
    }

    async findByDate(date: Date, user_id: string){
        const schedule =  await prisma.schedule.findFirst({
            where: { date,  user_id},
        });
        return schedule;
    }

    async listSchedulesByDate(date: Date){
        const schedules =  await prisma.schedule.findMany({
            where: { 
                date: {
                    gte: startOfDay(date),
                    lt: endOfDay(date),
                },
             },
             orderBy:{
                date: 'asc'
             },
        });
        return schedules;
    }

    async update(id: string, date: Date){
        const schedules =  await prisma.schedule.update({
            where: { 
                id
            },
            data: {
                date
            }
        });
        return schedules;
    }
}

export {ScheduleRepository}
