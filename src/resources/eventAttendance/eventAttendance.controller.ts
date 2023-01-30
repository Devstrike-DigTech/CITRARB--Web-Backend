import { Request, Response, NextFunction, Router } from "express";
import Controller from "@/utils/interfaces/Controller.interface";
import HttpException from "@/utils/exceptions/httpExceptions";
import validationMiddleware from "@/middleware/validation.middleware";
import authenticate from "@/middleware/authenticate.middleware";
import EventAttendanceService from "./eventAttendance.service";
import validate from './eventAttendance.validation'


export default class EventAttendanceController implements Controller {
    private eventAttendanceService = new EventAttendanceService()
    public path = '/event-attendance'
    public router = Router()


    constructor(){
        this.initializeRouter()
    }

    private initializeRouter(){
        this.router.route(`${this.path}/`).post(authenticate, validationMiddleware(validate.create), this.create)

        this.router.route(`${this.path}/`).put(authenticate, validationMiddleware(validate.create), this.update)
    }

    private create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            req.body.userId = req.user.id
            const data = await this.eventAttendanceService.create(req.body);

            res.status(201).json({
                status: 'success',
                data,
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }

    private update = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            req.body.userId = req.user.id
            const data = await this.eventAttendanceService.update(req.body);

            res.status(201).json({
                status: 'success',
                data,
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }
}