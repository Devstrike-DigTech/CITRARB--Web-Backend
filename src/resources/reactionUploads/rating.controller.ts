import express, { Request, Response, NextFunction, Router } from "express";
import Controller from "@/utils/interfaces/Controller.interface";
import HttpException from "@/utils/exceptions/httpExceptions";
import validationMiddleware from "@/middleware/validation.middleware";
import authenticate from "@/middleware/authenticate.middleware";
import RatingService from "./rating.service";
import validate from './rating.validation'


export default class ReactionUploadController implements Controller {
    public path = '/reactions'
    public router = Router({mergeParams: true})
    private app = express()

    private ratingService = new RatingService();


    constructor(){
        this.initializeRouter()
    }

    private initializeRouter(){
        this.app.use(`${this.path}`, this.router)
        this.router.route("/").post(authenticate, validationMiddleware(validate.create), this.create)

    }

    private create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            req.body.requester = req.user.id
            const data = await this.ratingService.create(req.body.rating, req.user.id, req.params.uploadId)

            res.status(201).json({
                status: "success",
                data,
            })
        } catch (error:any) {
           next(new HttpException(error.message, error.statusCode)) 
        }
    }
}