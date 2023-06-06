import { NextFunction, Request ,Response } from 'express';
import { ScheduleService } from '../services/ScheduleService';
import { parseISO } from 'date-fns';
class ScheduleController{

    private scheduleService: ScheduleService;

    constructor(){
        this.scheduleService = new ScheduleService();
    }

    async create(request: Request, response: Response, next: NextFunction){
        try{
            const {name, phone, date} = request.body;
            const { user_id } = request;
            const result =  await this.scheduleService.create({name, phone, date, user_id})
            return response.status(201).json(result);
        }catch(error){
            next(error);
        }
    }

    async list(request: Request, response: Response, next: NextFunction){
        
        const { date } = request.query;
        const parseDate = date ? parseISO(date.toString()) : new Date();
        try{
         
            const schedules =  await this.scheduleService.listScheduleByDate(parseDate)
            return response.status(200).json(schedules);
        }catch(error){
            next(error);
        }
    }

    async update(request: Request, response: Response, next: NextFunction){
        try{
            const { id } = request.params;

            const { date } = request.body;

            const { user_id } = request;

            const result =  await this.scheduleService.update(id, date, user_id)
            return response.status(200).json(null);
        }catch(error){
            next(error);
        }
    }

    async datele (request: Request, response: Response, next: NextFunction){
        try{
            const {name, phone, date} = request.body;
            // const result =  await this.scheduleService.create({name, phone, date})
            return response.status(201).json();
        }catch(error){
            next(error);
        }
    }
}

export { ScheduleController}