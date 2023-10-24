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
            const hookup = await hookupModel.findOne({status: "active", gender }).populate({ path: "images.userId", model: "User", select: "username email photo" })

            return hookup
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async getAll (query: any) {
        try {
            const hookups = await hookupModel.find(query).populate({ path: "images.userId", model: "User", select: "username email photo" })

            return hookups;
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async add (id: string, userId: string, image: string) {
        try {
            const hookup = await this.get(id)

            if(!hookup) throw new HttpException("not found", 404)

            if(hookup.status == "inactive") throw new HttpException("hookup inactive", 404)

            if(hookup.images.length >= 20) throw new Error("Maximum reached..Wait till the next one")

            const userAlreadySubmitted = hookup.images.filter((el:any) => el.userId == userId)

            console.log(userAlreadySubmitted)

            if(userAlreadySubmitted.length > 0) throw new HttpException("You have already submitted your photo for today", 400)

            const newHookup = await hookupModel.findByIdAndUpdate(id, {$push: {images: [{userId, image}]}}, {new: true, runValidators: true})
            
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
                return el.userId == winner ? {...el, isWinner: true} : {...el, isWinner: false}
                
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
            throw new HttpException(error.message, error.statusCode)
        }
       
    }

    public async getLastWinners() {
        try {

            let winnerMale = await hookupModel.find({gender: "male"}).sort({_id:-1}).limit(1).populate({ path: "images.userId", model: "User"});
            let male
            let female

            if (winnerMale.length > 0) {
                male = winnerMale[0].images.find((el: any) => el.isWinner == true)
                console.log(male)
            }

            let winnerFemale = await hookupModel.find({gender: "female"}).sort({_id:-1}).limit(1).populate({ path: "images.userId", model: "User"});
            if (winnerFemale.length > 0) {
                female = winnerFemale[0].images.find((el: any) => el.isWinner == true)
                console.log(female)
            }

            return {
                male: male || null,
                female: female || null,
            }
        } catch (error:any) {
            throw new HttpException(error.message, error.statusCode)
        }

    }
    public async getAllWinners(gender: string){
        try {
            const doc = await hookupModel.aggregate([
                {
                    $unwind: "$images"
                },
                {
                    $lookup: {
                        as: 'user',
                        from: 'users',
                        let: { userId: { $toObjectId: "$images.userId" } },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$_id", "$$userId"] }
                                }
                            }
                        ]
                    }
                },
                {
                    $unwind: "$user"
                },
                {
                    $match: {
                        "images.isWinner": true,
                        "gender": gender
                    }
                }
            ])
            return doc
        } catch (error:any) {
            throw new HttpException(error.message, error.statusCode)
        }
    }
}