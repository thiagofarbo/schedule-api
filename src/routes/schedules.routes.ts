import { Router } from "express";
import { ScheduleController } from "../controllers/ScheduleController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

class ScheduleRoutes{

    private router: Router;
    private scheduleController: ScheduleController;
    private authMiddleware: AuthMiddleware;

    constructor(){
        this.router = Router();
        this.authMiddleware = new AuthMiddleware();
        this.scheduleController = new ScheduleController();
    }

    getRoutes(): Router{

        this.router.post('/', 
        this.authMiddleware.auth.bind(this.authMiddleware),
        this.scheduleController.create.bind(this.scheduleController),);

        this.router.get('/', 
        this.authMiddleware.auth.bind(this.authMiddleware),
        this.scheduleController.list.bind(this.scheduleController),);

        this.router.put('/:id', 
        this.authMiddleware.auth.bind(this.authMiddleware),
        this.scheduleController.update.bind(this.scheduleController),);

        return this.router;
        
    }
}

export { ScheduleRoutes }