import { Request, Response, NextFunction, Router } from "express";
import UserService from "./user.service";
import Controller from "@/utils/interfaces/Controller.interface";
import HttpException from "@/utils/exceptions/httpExceptions";
import validationMiddleware from "@/middleware/validation.middleware";
import validate from './user.validation'
import authenticate from "@/middleware/authenticate.middleware";
import restrictTo from "@/middleware/restrictTo.middleware";
import multer from "multer";
import sharp from "sharp";
import OccupationService from "../occupation/occupation.service";

class UserController implements Controller {
    public path = '/users'
    public router = Router()

    private userService = new UserService()
    private occupationService = new OccupationService()

    private multerStorage = multer.memoryStorage();

    private multerFilter = (req:any, file:any, cb:any) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new HttpException('Not an image! Please upload only images.', 400), false);
        }
    };

    private upload = multer({
        storage: this.multerStorage,
        fileFilter: this.multerFilter,
    });

    private uploadImage = this.upload.fields([
        { name: 'photo', maxCount: 1 }
    ]);

    constructor(){
        this.initializeRouter()
    }

    private initializeRouter(){
        this.router.post(`${this.path}/signup`, validationMiddleware(validate.create), this.signup)
        this.router.post(`${this.path}/login`, validationMiddleware(validate.login), this.login)
        this.router.get(`${this.path}/logout`, authenticate, this.logout)
        this.router.get(`${this.path}/me`, authenticate, this.getMe)
        this.router.get(`${this.path}/admin`, this.admin)

        this.router.route(`${this.path}/:id`).get(authenticate, restrictTo('admin'), this.getUser)
        this.router.route(`${this.path}/aggregate/:id`).get(authenticate, restrictTo('admin'), this.userAgg)

        this.router.route(`${this.path}/`).get(authenticate, this.getMembers)

        this.router.route(`${this.path}/`).put(authenticate, this.uploadImage, this.resizeUserPhoto, this.updateMe)

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
            const occupation = await this.occupationService.get(user.id)

            res.status(200).json({
                status: 'success',
                token,
                user: user,
                occupation,
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }

    private logout = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            console.log(req.user)
            await this.userService.logout(req.user)

            res.status(200).json({
                status: 'success',
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }

    private getMe = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const occupation = await this.occupationService.get(req.user.id)
            res.status(200).json({
                status: 'success',
                user: req.user,
                occupation,
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

    private userAgg = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {

            const aggregates = await this.userService.userAggregates(req.params.id)
            res.status(200).json({
                aggregates,
                status: 'success',
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }

    private resizeUserPhoto = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.files) return next();

        // 1) profile picture
        if ((req.files as any).photo) {
          req.body.photo = `profile-${req.user.id}-${Date.now()}-.jpeg`;
          await sharp((req.files as any).photo[0].buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/profile/${req.body.photo}`);
        }
      
        next();
      };
}

export default UserController