import { Request, Response, NextFunction, Router } from "express";
import UserService from "./user.service";
import Controller from "@/utils/interfaces/Controller.interface";
import HttpException from "@/utils/exceptions/httpExceptions";
import validationMiddleware from "@/middleware/validation.middleware";
import validate from './user.validation'
import authenticate from "@/middleware/authenticate.middleware";
import restrictTo from "@/middleware/restrictTo.middleware";

class UserController implements Controller {
    public path = '/users'
    public router = Router()

    private userService = new UserService()

    constructor(){
        this.initializeRouter()
    }

    private initializeRouter(){
        this.router.post(`${this.path}/signup`, validationMiddleware(validate.create), this.signup)
        this.router.post(`${this.path}/login`, validationMiddleware(validate.login), this.login)
        this.router.get(`${this.path}/me`, authenticate, this.getMe)
        this.router.get(`${this.path}/admin`, this.admin)

        this.router.route(`${this.path}/:id`).get(authenticate, restrictTo('admin'), this.getUser)

        this.router.route(`${this.path}/`).get(authenticate, this.getMembers)

        this.router.route(`${this.path}/`).put(authenticate, this.updateMe)

        this.router.route(`${this.path}/`).delete(authenticate, this.deleteMe)
    }

    private signup = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const {user, token}:any = await this.userService.create(req.body)

            res.status(201).json({
                status: 'success',
                token,
                user,
            })
        } catch (error:any) {
           next(new HttpException(error.message, error.statusCode))
        }
    }
    
    private login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const {user, token}:any = await this.userService.login(req.body.email, req.body.password)

            res.status(200).json({
                status: 'success',
                token,
                user,
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }

    private getMe = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            res.status(200).json({
                status: 'success',
                user: req.user
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }

    private getUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const user = await this.userService.get(req.params.id)

            res.status(200).json({
                status: 'success',
                user: user
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }

    private getMembers = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const members = await this.userService.getAll(req.user.id)
            res.status(200).json({
                status: 'success',
                members
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }

    private updateMe = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const user = await this.userService.update(req.body, req.user.id)

            if(!user) return next(new HttpException('user not found', 404))

            res.status(200).json({
                status: 'success',
                user
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }

    private deleteMe = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const user = await this.userService.delete(req.user.id)

            res.status(204).json({
                status: 'success',
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }

    private admin = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {

            const user = await this.userService.users(req.query.year)
            res.status(200).json({
                aggregates: user,
                status: 'success',
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }
}

export default UserController