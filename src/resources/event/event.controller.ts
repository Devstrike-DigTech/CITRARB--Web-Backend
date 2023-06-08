import express, { Request, Response, NextFunction, Router } from "express";
import Controller from "@/utils/interfaces/Controller.interface";
import HttpException from "@/utils/exceptions/httpExceptions";
import validationMiddleware from "@/middleware/validation.middleware";
import authenticate from "@/middleware/authenticate.middleware";
import EventService from "./event.service";
import validate from './event.validation'
import RatingController from "../rating/rating.controller";
import multer from "multer";
import sharp from "sharp";

class EventController implements Controller {
    private eventService = new EventService()
    public path = '/events'
    public router = Router()

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
        { name: 'image', maxCount: 1 }
    ]);


    constructor(){
        this.initializeRouter()
    }

    private initializeRouter(){
        this.router.use(`${this.path}/:eventId/ratings`, new RatingController().router)

        this.router.route(`${this.path}/`).post(authenticate, this.uploadImage, this.resizePhoto, validationMiddleware(validate.create), this.create)
        this.router.route(`${this.path}/`).get(authenticate, this.getAll)

        this.router.get(`${this.path}/me`, authenticate, this.get)
        this.router.route(`${this.path}/:id`).put(authenticate, validationMiddleware(validate.update), this.update)
        this.router.route(`${this.path}/:id`).delete(authenticate, this.delete)
    }

    private create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            console.log('entered')
            req.body.host = req.user.id
            const data = await this.eventService.create(req.body);

            res.status(201).json({
                status: 'success',
                data,
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }

    private get = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const data = await this.eventService.get(req.params.id);

            res.status(200).json({
                status: 'success',
                data,
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }

    private getAll = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const data = await this.eventService.getAll(req.query)
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

    private update = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const data = await this.eventService.update(req.params.id, req.user.id, req.body)

            res.status(200).json({
                status: 'success',
                data,
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }

    private delete = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const data = await this.eventService.delete(req.params.id, req.user.id)

            res.status(204).json({
                status: 'success',
                data,
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }

    private resizePhoto = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.files) return next();

        // 1) profile picture
        if ((req.files as any).image) {
          req.body.image = `eventPoster-${req.user.id}-${Date.now()}-.jpeg`;
          await sharp((req.files as any).image[0].buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/events/${req.body.image}`);
        }
      
        next();
      };
}

export default EventController