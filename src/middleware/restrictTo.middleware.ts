import { Request, Response, NextFunction } from "express";
import HttpException from '@/utils/exceptions/httpExceptions'


const restrictTo = (admin: string) => {
    return (req:Request, res:Response, next:NextFunction) => {
        if(req.user.role !== admin){
            return next(new HttpException("You do not have the permission to perform this action", 403))
        }
        next();
    }
}

export default restrictTo