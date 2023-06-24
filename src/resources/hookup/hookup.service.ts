import HttpException from "@/utils/exceptions/httpExceptions";
import Hookup from "./hookup.interface";
import hookupModel from "./hookup.model";
import moment from "moment";

export default class HookupService {

    /**
     * 
     * @returns newly created hookup document
     */
    public async create (gender: string) {
        try {
            const isToday = await this.getActive(gender)
            if(isToday) throw new Error(`Already ongoing contest for ${gender}`)
            const hookup = await hookupModel.create({gender})

            return hookup
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async get(id: any) {
        try {
            const hookup = await hookupModel.findById(id)

            if(!hookup) throw new HttpException('not found', 404)

            return hookup
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async getActive(gender:string) {
        try {
            // const today = moment().startOf('day')
            // const hookup = await hookupModel.findOne({date: {$gte: today.toDate(), $lte: moment(today).endOf('day').toDate()} }).populate({ path: "images.id", model: "User", select: "username email photo" })
            const hookup = await hookupModel.findOne({status: "active", gender }).populate({ path: "images.id", model: "User", select: "username email photo" })

            // if(!hookup) throw new HttpException('not found', 404)
            return hookup
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async getAll () {
        try {
            const hookups = await hookupModel.find({})

            return hookups;
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async add (id: string, userId: string, image: string) {
        try {
            const hookup = await this.get(id)

            if(hookup.images.length >= 20) throw new Error("Maximum reached..Wait till the next one")

            const userAlreadySubmitted = hookup.images.filter((el:any) => el.id == userId)

            if(userAlreadySubmitted) throw new Error("You have already submitted your photo for today")

            const newHookup = await hookupModel.findByIdAndUpdate(id, {$push: {images: [{id: userId, image}]}}, {new: true, runValidators: true})
            
            return newHookup
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async setWinner (id: string, winner: string) {
        try {
            const hookup = await hookupModel.findById(id)

            if(!hookup) throw new HttpException('not found', 404)
            
            let newArr = hookup.images.map((el:any) => {
                return el.id == winner ? {...el, isWinner: true} : {...el, isWinner: false}
                
            })

            hookup.images = newArr;

            await hookup?.save()
            
            return hookup
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async updateStatusHookup (id: string, status: string) {
        try {
            const hookup = await hookupModel.findByIdAndUpdate(id, {status}, {runValidators: true, new: true})
            return hookup
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async delete (id: string) {
        try {
            const data = await hookupModel.findByIdAndDelete(id)

            if(!data) throw new HttpException('not found', 404)
        } catch (error:any) {
            throw new Error(error)
        }
       
    }
}