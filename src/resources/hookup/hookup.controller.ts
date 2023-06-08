import { Request, Response, NextFunction, Router } from "express";
import multer from 'multer';
import Controller from "@/utils/interfaces/Controller.interface";
import HttpException from "@/utils/exceptions/httpExceptions";
import validationMiddleware from "@/middleware/validation.middleware";
import authenticate from "@/middleware/authenticate.middleware";
import HookupService from "./hookup.service";
import validate from './hookup.validation'
import RestrictTo from '@/middleware/restrictTo.middleware'

class HookupController implements Controller {
    private service = new HookupService()

    public path = '/hookup'
    public router = Router()

    private multerStorage = multer.diskStorage({
        filename(req, file, callback) {
            const filename = `hookup--${Date.now()}${Math.ceil(Math.random() * 10000)}.jpeg`;
            req.body.image = filename
            callback(null, filename)
        },
        destination(req, file, callback) {
            callback(null, `public/hookups`)
        },
    })

    private multerFilter = (req:any, file:any, cb:any) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new HttpException('Not an image! Please upload only image files.', 400), false);
        }
        };
    
        private upload = multer({
        storage: this.multerStorage,
        fileFilter: this.multerFilter
        });
    
        private uploadImage = this.upload.fields([
        { name: 'image', maxCount: 1 }
        ]);


    constructor(){
        this.initializeRouter()
    }

    private initializeRouter(){

        this.router.route(`${this.path}/`).post(authenticate, RestrictTo('admin'), validationMiddleware(validate.submit), this.create)
        this.router.route(`${this.path}/today`).get(authenticate, this.getToday)
        this.router.route(`${this.path}/:id/submit`).patch(authenticate, this.uploadImage ,this.submitPhoto)
        this.router.route(`${this.path}/:id`).patch(authenticate, RestrictTo('admin'), validationMiddleware(validate.update), this.updateWinner)
    }

    private create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const data = await this.service.create(req.body.gender);

            res.status(201).json({
                status: 'success',
                data,
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }

    private getToday = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const data = await this.service.getToday();

            res.status(201).json({
                status: 'success',
                data,
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }

    private submitPhoto = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const data = await this.service.add(req.params.id, req.user.id, req.body.image);

            res.status(201).json({
                status: 'success',
                data,
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }

    private updateWinner = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const data = await this.service.update(req.params.id, req.body.user);

            res.status(201).json({
                status: 'success',
                data,
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }
}

export default HookupController