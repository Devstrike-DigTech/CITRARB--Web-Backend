import { Request, Response, NextFunction } from "express";
import HttpException from '@/utils/exceptions/httpExceptions'
import App from '../app'

async function cacheMiddleware (req:Request, res:Response, next:NextFunction): Promise<Response | void> {
    let result;
    let key;
    try {
        key = req.url.split("/")[1]
        if(key.startsWith('tv')) key = 'youtube';
        if(key.startsWith('news')) {
            const pgNum = req.query.page || 1
            key = `news_${pgNum}`
        }
    
        
        const cachedResult = await App.redisClient.get(key)
        console.log(cachedResult, 'cached result')
        if(cachedResult) {

        result = JSON.parse(cachedResult)
        res.status(200).json({
            total: result.length,
            fromCache: true,
            data: result,
        })
        }else {
            next()
        }
    } catch (error:any) {
        next(new HttpException('Unauthorized access', 401))
    }
}

export default cacheMiddleware
