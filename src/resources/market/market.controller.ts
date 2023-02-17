import { Request, Response, NextFunction, Router } from "express";
import multer from 'multer';
import Controller from "@/utils/interfaces/Controller.interface";
import HttpException from "@/utils/exceptions/httpExceptions";
import validationMiddleware from "@/middleware/validation.middleware";
import authenticate from "@/middleware/authenticate.middleware";
import MarketService from "./market.service";
import validate from './market.validation'
import GoogleDriveAPI from "../shared/uploads/uploads.service";


class MarketController implements Controller {
    private service = new MarketService()
    public path = '/products'
    public router = Router()

    private multerStorage = multer.memoryStorage();

    constructor(){
        this.initializeRouter()
    }

    private initializeRouter(){

        this.router.route(`${this.path}/`).post(authenticate, this.upload.array('images', 3), this.formatFile, validationMiddleware(validate.create), this.create)
        this.router.route(`${this.path}/`).get(authenticate, this.getAll)

        this.router.get(`${this.path}/:id`, authenticate, this.get)
        this.router.route(`${this.path}/:id`).put(authenticate, validationMiddleware(validate.update), this.update)
        this.router.route(`${this.path}/:id`).delete(authenticate,  this.delete)
    }

    private create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            req.body.userId = req.user.id
            const files = req.files as Express.Multer.File[]
            req.body.files = files
            const data = await this.service.create(req.body);


            // const status = await this.googleDriveAPI.uploadImages(files)
            // const data = await this.googleDriveAPI.getFile()

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

    private formatFile = async(req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            if(!req.files) {
                next(new HttpException("upload an image guy!!!", 400))
            }

            if(req.files && req.files?.length > 3) {
                next(new HttpException("cannot upload more than 3 images for a product!!!", 400))
            }
            next()
        } catch (error:any) {
            next(new HttpException(error.message, error.statusCode))
        }
    }

    private multerFilter = (req: any, file: any, cb: any) => {
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

}

export default MarketController