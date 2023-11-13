import { Request, Response, NextFunction, Router } from "express";
import Controller from "@/utils/interfaces/Controller.interface";
import HttpException from "@/utils/exceptions/httpExceptions";
import authenticate from "@/middleware/authenticate.middleware";
import restrictTo from "@/middleware/restrictTo.middleware";
import SystemService from "./system.service";


class SystemController implements Controller {
    public path = '/system'
    public router = Router()

    private sysService = new SystemService()

    constructor(){
        this.initializeRouter()
    }

    private initializeRouter(){
        this.router.route(`${this.path}`).get(authenticate, restrictTo('admin'), this.updateHookupStatus)
    }

    private updateHookupStatus = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const msg = await this.sysService.updateHookupStatus()

            res.status(201).json({
                status: 'success',
                message: msg
            })
        } catch (error:any) {
           next(new HttpException(error.message, error.statusCode))
        }
    }   
}

export default SystemController