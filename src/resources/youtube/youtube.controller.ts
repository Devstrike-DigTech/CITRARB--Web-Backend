import express, {Router, Request, Response, NextFunction} from 'express'
import Controller from '@/utils/interfaces/Controller.interface'
import HttpException from '@/utils/exceptions/httpExceptions'
import YoutubeAPI from './youtube.service'
import App from '../../app'
import cacheMiddleware from '@/middleware/cache.middleware'

class YoutubeAPIController {
    public path = '/tv'
    public router = Router()
    private factory = new YoutubeAPI((process.env.YOUTUBE_API_KEY as string), (process.env.CHANNEL_ID as string))



    constructor() {
        this.initializeRouter()
    }

    public initializeRouter = () => {
        
        this.router.get(`${this.path}/`, cacheMiddleware, this.getAll)

    }

    private getAll = async (req: Request, res:Response, next:NextFunction): Promise<Response | void> => {
        try {
            let result;
            let isCached = false;
            result = await this.factory.getVideos()
                await App.redisClient.set('youtube', JSON.stringify(result), {
                    EX: 600,
                    NX: true,
                })

            res.status(200).json({
                total: result.length,
                fromCache: isCached,
                data: result,
            })
        } catch (error:any) {
         next(new HttpException(error.message, error.statusCode))
        }
    }
}

export default YoutubeAPIController