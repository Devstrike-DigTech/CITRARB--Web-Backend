import userModel from "./user.model";
import User from "./user.interface";
import AuthCredentials from "@/utils/interfaces/authCredential.interface";
import {createToken} from '@/utils/token'
import HttpException from "@/utils/exceptions/httpExceptions";
import FriendService from "../friend/friend.service";
import MusicService from "../music/music.service";
import EventAttendanceService from "../eventAttendance/eventAttendance.service";
import EyeWitnessService from "../eyeWitness/eyeWitness.service";
import MarketService from "../market/market.service";

class UserService {
    private UserModel = userModel
    private friendService = new FriendService()


    /**
     * 
     * @param user - user data
     * @returns - newly created user
     */
    public async create (user: User): Promise<AuthCredentials | Error> {
        try {
            const isUsername = await this.UserModel.findOne({username: user.username})
            if(isUsername) throw new HttpException("Username already exist", 404)
            const newUser = await this.UserModel.create(user)

            const token = createToken(newUser)

            return {token, user: newUser}
        } catch (error:any) {
            throw new HttpException(error.message, error.statusCode)
        }
    }

    /**
     * 
     * @param email - Users email address
     * @param password - users password
     * @returns access token and user details
     */
    public async login (email:string, password:string): Promise<AuthCredentials | Error> {
        try {
            const user = await this.UserModel.findOne({email: email})
            
            if(!user || !(await user.comparePassword(password))) {
                throw new Error('email or password is not valid')
            }

            const token = createToken(user)

            return {token, user}
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async logout(user: User): Promise<AuthCredentials | Error> {
        try {
            const token = createToken(user, '1s')

            return {token, user}
        } catch (error:any) {
            throw new HttpException(error.message, error.statusCode)
        }
    }

    /**
     * 
     * @param id - user id to fetch
     * @returns 
     */
    public async get(id: string): Promise<User | Error> {
        try {
            const user = await this.UserModel.findById(id)
            if(!user) throw new Error('User Not Found')

            return user
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async getAll(id: string): Promise<User[] | Error> {
        try {
            let friendsList:string[] = []
            //get list of friends
            const myFriends = await this.friendService.getAll(id);
            if(myFriends.length > 0) {
                myFriends.forEach((el:any) => {
                    friendsList.push(el.friend.id)
                })
            } 

            //get all users
            const members = await this.UserModel.find({"_id": {$nin: [...friendsList, id]}})

            return members

        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async userAggregates(userId: string): Promise<any | Error> {
        try {
            const music = await new MusicService().getUserMusic(userId);
            const eyeWitness = await new EyeWitnessService().getUserUpload(userId)
            const event = await new EventAttendanceService().getAll(userId)
            const friend = await new FriendService().getAll(userId)
            const market = await new MarketService().getUserMarket(userId)

            return {
                music: music.length,
                eyeWitness: eyeWitness.length,
                event: event.length,
                friend: friend.length,
                market: market.length
            }
        } catch (error:any) {
            throw new Error(error)
        }
    }
    
    /**
     * 
     * @param data - user details to update
     * @param id - user id to update
     * @returns - updated user details
     */
    public async update(data:User, id:string): Promise<User | Error> {
        try {
            const user = await this.UserModel.findByIdAndUpdate(id, data, {runValidators: true, new: true})

            if(!user) {
                throw new Error("No user found");
                
            }

            return user
        } catch (error:any) {
            throw new Error(error)
        }
    }

    /**
     * 
     * @param id - user id
     * @returns - null
     */
    public async delete(id:string): Promise<null | Error> {
        try {
            const user = await this.UserModel.findByIdAndUpdate(id, {active: false}, {runValidators: true, new: true})

            if(!user) {
                throw new Error("No user found");
                
            }

            return null
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async users(query: any): Promise<any | Error> {
        try {
            let result
            if(query) {
                const user = await userModel.aggregate([
                    {
                        $project: {
                            year: {$year: "$createdAt"},
                            month: { $month: "$createdAt" },
                        }
                    },
                    {
                        $match: {
                            year: Number(query)
                        }
                    },
                    {
                        $group: {
                            _id: {
                                month: '$month',
                            },
                            count: {$sum: 1},
                        }
                    }
    
                ])
    
                console.log(user)
                console.log(user.length)
                let data:any = {}
                let x = []
                let y = [] 
                for(let i = 0; i<11; i++) {
                    let getMonth = user.find((el: any) => el._id.month == (i+1))
                    if(getMonth) {
                        const month = this.getMonthName(getMonth._id.month) 
                        const count = getMonth.count
                        x.push(month)
                        y.push(count)
                        data.x = x
                        data.y = y
                    }

                }
                result = data
            }else{
                const user = await userModel.aggregate([
                    {
                        $project: {
                            year: {$year: "$createdAt"},
                        }
                    },
                    {
                        $group: {
                            _id: {
                                year: '$year',
                            },
                            count: {
                                $sum: 1
                            }
                        }
                    }, 
                    {
                        $sort: {
                            '_id.count': 1
                        }
                    }

                ])
                let x: any[] = []
                let y:any[] = []
                let data:any = {}
                user.sort((a:any, b:any) => a._id.year > b._id.year ? 1 : -1)
                user.forEach((el:any) => {
                    x.push(el._id.year)
                    y.push(el.count)

                })
                data.x = x
                data.y = y
                result = data
            }
            return result
        } catch (error:any) {
            console.log(error)
            throw new Error(error)
        }
    }

    private getMonthName = (monthNumber: number) => {
        const date = new Date();
        date.setMonth(monthNumber - 1);
      
        return date.toLocaleString('en-US', { month: 'long' });
      }

    
}

export default UserService