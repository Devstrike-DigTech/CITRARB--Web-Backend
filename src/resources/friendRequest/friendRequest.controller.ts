import { Request, Response, NextFunction, Router } from "express";
import Controller from "@/utils/interfaces/Controller.interface";
import HttpException from "@/utils/exceptions/httpExceptions";
import validationMiddleware from "@/middleware/validation.middleware";
import authenticate from "@/middleware/authenticate.middleware";
import FriendRequestService from "./friendRequest.service";
import validate from './friendRequest.validation'

export default class FriendRequestController implements Controller {
    public path = '/friendrequests'
    public router = Router()
    private friendRequestService = new FriendRequestService();


    constructor(){
        this.initializeRouter()
    }

    private initializeRouter(){
        this.router.route(`${this.path}/`).post(authenticate, validationMiddleware(validate.create), this.create)
        this.router.route(`${this.path}/`).get(authenticate, this.getAll)
        this.router.route(`${this.path}/sent`).get(authenticate, this.getAllTheRequestsIHaveSent)

        this.router.route(`${this.path}/:id`).patch(authenticate, this.update)
    }

    private create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            req.body.requester = req.user.id
            const data = await this.friendRequestService.sendRequest(req.body)

            res.status(201).json({
                status: "success",
                data,
            })
        } catch (error:any) {
           next(new HttpException(error.message, error.statusCode)) 
        }
    }

    private getAll = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const data = await this.friendRequestService.getMyFriendRequests(req.user.id, req.query)

            res.status(200).json({
                status: 'success',
                data
            })
        } catch (error:any) {
           next(new HttpException(error.message, error.statusCode)) 
        }
    }

    private getAllTheRequestsIHaveSent = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const data = await this.friendRequestService.getSentFriendRequests(req.user.id, req.query)

            res.status(200).json({
                status: 'success',
                data
            })
        } catch (error:any) {
           next(new HttpException(error.message, error.statusCode)) 
        }
    }


    private update = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const data = await this.friendRequestService.updateRequest(req.params.id, req.user.id, req.body.status)

            res.status(200).json({
                status: 'success',
                data,
            })
        } catch (error:any) {
           next(new HttpException(error.message, error.statusCode)) 
        }
    }
}

