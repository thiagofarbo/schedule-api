import express, { Application, NextFunction, Request, Response } from "express";
import { UserRoutes } from "./routes/users.routes";
import { ScheduleRoutes } from "./routes/schedules.routes";
import cors from 'cors';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = new UserRoutes().getRoutes();

const sheduleRoutes = new ScheduleRoutes().getRoutes();

app.use("/users", userRoutes);
app.use("/schedules", sheduleRoutes);

//Every error from our api we going to get here.
app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof Error) {
      return response.status(400).json({
        message: err.message,
      });
    }
    return response.status(500).json({
        message: 'Internal Server Error'
    })
  },
);

app.listen(3000, () => console.log("Server is running..."));
