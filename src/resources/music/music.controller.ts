import { Request, Response, NextFunction, Router } from "express";
import multer from 'multer';
import Controller from "@/utils/interfaces/Controller.interface";
import HttpException from "@/utils/exceptions/httpExceptions";
import validationMiddleware from "@/middleware/validation.middleware";
import authenticate from "@/middleware/authenticate.middleware";
import MusicService from "./music.service";
import validate from './music.validation';
import RatingController from "../reactionMusic/rating.controller";
import restrictTo from '@/middleware/restrictTo.middleware'

class MusicController implements Controller {
    private service = new MusicService()
    public path = '/music'
    public router = Router()


    private multerStorage = multer.diskStorage({
        filename(req, file, callback) {
            let filename;
            
            if(file.mimetype.startsWith('audio')) {
                filename = `music--${Date.now()}${Math.ceil(Math.random() * 10000)}.mp3`
            }else {
                filename = `music-cover--${Date.now()}${Math.ceil(Math.random() * 10000)}.jpeg`
            }

            callback(null, filename)
        },
        destination(req, file, callback) {
            const url = file.mimetype.startsWith('audio') ? 'public/music/audios' : 'public/music/images'
            callback(null, url)
        },
    })
    
    private multerFilter = (req:any, file:any, cb:any) => {
        if (file.mimetype.startsWith('image') || file.mimetype.startsWith('audio')) {
            cb(null, true);
        } else {
            cb(new HttpException('file has to be an image or video.', 400), false);
        }
    };

    private upload = multer({
        storage: this.multerStorage,
        fileFilter: this.multerFilter
    });
    
    private uploadMusic = this.upload.fields([
        { name: 'file', maxCount: 1 },
        { name: 'image', maxCount: 1 }
    ]);

    constructor(){
        this.initializeRouter()
    }

    private initializeRouter(){
        this.router.use(`${this.path}/:musicId/reactions`, new RatingController().router)

        this.router.post(`${this.path}/`, authenticate, this.uploadMusic, this.middle, validationMiddleware(validate.create), this.create)
        this.router.route(`${this.path}/`).get(authenticate, this.getAll)

        this.router.route(`${this.path}/verification`).get(authenticate, restrictTo('admin') ,this.verifyContent)
        this.router.route(`${this.path}/del`).get(authenticate, restrictTo('admin') ,this.adminDelete)

        this.router.get(`${this.path}/:id`, authenticate, this.get)
        this.router.route(`${this.path}/:id`).put(authenticate, this.update)
        this.router.route(`${this.path}/:id`).delete(authenticate,  this.delete)
    }

    private create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            req.body.userId = req.user.id

            console.log(req.body)
            const data = await this.service.create(req.body);

            res.status(201).json({
                status: 'success',
                data,
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }

    private middle = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        if(!req.files) next();
        const files = req.files
        if((files as any).image) req.body.image = (files as any).image[0].filename
        if((files as any).file) req.body.file = (files as any).file[0].filename

        next()
}

    private get = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const data = await this.service.get(req.params.id);

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
            const data = await this.service.getAll(req.query)
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
            const data = await this.service.update(req.params.id, req.user.id, req.body)

            res.status(200).json({
                status: 'success',
                data,
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }

    private verifyContent = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const data = await this.service.verifyContent(req.params.id)

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
            const data = await this.service.delete(req.user.id, req.params.id)

            res.status(204).json({
                status: 'success',
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }

    private adminDelete = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const data = await this.service.AdminDelete(req.params.id)

            res.status(204).json({
                status: 'success',
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }

}

export default MusicController