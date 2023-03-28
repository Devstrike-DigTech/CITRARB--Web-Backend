import { Request, Response, NextFunction, Router } from "express";
import multer from 'multer';
import Controller from "@/utils/interfaces/Controller.interface";
import HttpException from "@/utils/exceptions/httpExceptions";
import validationMiddleware from "@/middleware/validation.middleware";
import authenticate from "@/middleware/authenticate.middleware";
import MusicService from "./music.service";
import validate from './music.validation';
import RatingController from "../reactionMusic/rating.controller";


class MusicController implements Controller {
    private service = new MusicService()
    public path = '/music'
    public router = Router()

    private multerStorage = multer.memoryStorage();

    constructor(){
        this.initializeRouter()
    }

    private initializeRouter(){
        this.router.use(`${this.path}/:musicId/reactions`, new RatingController().router)

        this.router.post(`${this.path}/`, authenticate, this.upload.single('file'), validationMiddleware(validate.create), this.create)
        this.router.route(`${this.path}/`).get(authenticate, this.getAll)

        this.router.get(`${this.path}/:id`, authenticate, this.get)
        this.router.route(`${this.path}/:id`).put(authenticate, this.update)
        this.router.route(`${this.path}/:id`).delete(authenticate,  this.delete)
    }

    private create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            req.body.userId = req.user.id
            req.body.file = [req.file as Express.Multer.File]

            console.log(req.body)
            const data = await this.service.create(req.body);

            res.status(201).json({
                status: 'success',
                data,
                // data: "lk",
            })
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
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

    private multerFilter = (req: any, file: any, cb: any) => {
        if (file.mimetype.startsWith('audio')) {
          cb(null, true);
        } else {
          cb(new HttpException('Not an audio! Please upload only audio file.', 400), false);
        }
      };

    private upload = multer({
        storage: this.multerStorage,
        fileFilter: this.multerFilter,
      });

}

export default MusicController