import express, {Router, Request, Response, NextFunction} from 'express'
import Controller from '@/utils/interfaces/Controller.interface'
import HttpException from '../../utils/exceptions/httpExceptions'
import Factory from './news.factory'
import cacheMiddleware from '@/middleware/cache.middleware'
import App from '../../app'

/**
 * import other schema controllers
 */


class NewsController implements Controller {
    public path = '/news'
    public router = Router()
    private factory = new Factory()



    constructor() {
        this.initializeRouter()
    }

    public initializeRouter = () => {
        

        this.router.get(`${this.path}/total_pages`, this.getTotalPages)
        
        this.router.get(`${this.path}/`, cacheMiddleware, this.getAll)
        this.router.post(`${this.path}/`, this.getOne)

    }

    private getAll = async (req: Request, res:Response, next:NextFunction): Promise<Response | void> => {
        try {
            let result;
            let isCached = false;
            let pgNum = Number(req.query.page) || 1
            console.log(pgNum)

            result = await this.factory.getAll(pgNum)

            await App.redisClient.set(`news_${pgNum}`, JSON.stringify(result), {
                EX: 600,
                NX: true,
            })

            res.status(201).json({
                length: result.length,
                fromCache: isCached,
                data: result,
            })
        } catch (error:any) {
         next(new HttpException(error.message, error.statusCode))
        }
    }

    private getOne = async (req: Request, res:Response, next:NextFunction): Promise<Response | void> => {
        try {

            console.log(req.query.find)
            const result = await this.factory.getOne(req.query.find)

            res.status(201).json({
                data: result,
            })
        } catch (error:any) {
         next(new HttpException(error.message, error.statusCode))
        }
    }

    private getTotalPages = async (req: Request, res:Response, next:NextFunction): Promise<Response | void> => {
        try {

            const result = await this.factory.totalPages()

            res.status(201).json({
                totalNumOfPages: result,
            })
        } catch (error:any) {
         next(new HttpException(error.message, error.statusCode))
        }
    }
}

export default NewsController