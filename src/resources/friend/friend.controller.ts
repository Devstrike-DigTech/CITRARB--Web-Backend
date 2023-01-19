import { Request, Response, NextFunction, Router } from "express";
import Controller from "@/utils/interfaces/Controller.interface";
import HttpException from "@/utils/exceptions/httpExceptions";
import validationMiddleware from "@/middleware/validation.middleware";
import authenticate from "@/middleware/authenticate.middleware";
import FriendService from "./friend.service";
import validate from './friend.validation'

class FriendController implements Controller {
    private friendService = new FriendService()
    public path = '/friends'
    public router = Router()


    constructor(){
        this.initializeRouter()
    }

    private initializeRouter(){
        this.router.route(`${this.path}/`).post(authenticate, validationMiddleware(validate.create), this.create)
        this.router.route(`${this.path}/`).get(authenticate, this.getAll)

        this.router.route(`${this.path}/:id`).delete(authenticate, this.delete)
    }

    private create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            req.body.userId = req.user.id
            const data = await this.friendService.createFriend(req.body)

            res.status(201).json({
                status: 'success',
                data,
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }


    private getAll = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const data = await this.friendService.getAll(req.user.id)
            let length = 0
            if(data) {
                length = (data as any[]).length;
            }

            res.status(200).json({
                status: 'success',
                length,
                data,
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }

    private delete = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const data = await this.friendService.delete(req.params.id)


            res.status(204).json({
                status: 'success',
                data,
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }
}

export default FriendController