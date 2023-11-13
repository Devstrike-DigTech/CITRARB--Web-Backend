import { Request, Response, NextFunction, Router } from "express";
import multer from 'multer';
import Controller from "@/utils/interfaces/Controller.interface";
import HttpException from "@/utils/exceptions/httpExceptions";
import validationMiddleware from "@/middleware/validation.middleware";
import authenticate from "@/middleware/authenticate.middleware";
import MarketService from "./market.service";
import validate from './market.validation'
import sharp from "sharp";

class MarketController implements Controller {
    private service = new MarketService()

    public path = '/products'
    public router = Router()


    private multerStorage = multer.memoryStorage();

    private multerFilter = (req:any, file:any, cb:any) => {
        console.log('reach')
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new HttpException('Not an image! Please upload only images.', 400), false);
    }
    };

    private upload = multer({
    storage: this.multerStorage,
    fileFilter: this.multerFilter
    });

    private uploadImages = this.upload.fields([
    { name: 'images', maxCount: 3 }
    ]);

    constructor(){
        this.initializeRouter()
    }

    private initializeRouter(){

        this.router.route(`${this.path}/`).post(authenticate, this.uploadImages, this.resizeImages, validationMiddleware(validate.create), this.create)
        this.router.route(`${this.path}/`).get(authenticate, this.getAll)

        this.router.get(`${this.path}/:id`, authenticate, this.get)
        this.router.route(`${this.path}/:id`).put(authenticate, validationMiddleware(validate.update), this.update)
        this.router.route(`${this.path}/:id`).delete(authenticate,  this.delete)
    }

    private create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            console.log(req.body)
            req.body.userId = req.user.id
            const data = await this.service.create(req.body);

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

    private resizeImages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.files || !('images' in req.files)) {
                // If there are no uploaded images, move to the next middleware
                return next();
            }
    
            const images = (req.files as { images: Express.Multer.File[] }).images;
    
            // Initialize req.body as an object with an 'images' property
            (req.body as { images: string[] }).images = [];
    
            await Promise.all(
                images.map(async (image: Express.Multer.File, i: number) => {
                    const filename = `product--${Date.now()}-${i + 1}.jpeg`;
    
                    await sharp(image.buffer)
                        .resize(2000, 1333)
                        .toFormat('jpeg')
                        .jpeg({ quality: 90 })
                        .toFile(`public/products/${filename}`);
    
                    // Push the filenames to req.body.images
                    (req.body as { images: string[] }).images.push(filename);
                })
            );
    
            next();
        } catch (error: any) {
            next(new HttpException(error.message, error.statusCode));
        }
    };
    
    
    
}

export default MarketController