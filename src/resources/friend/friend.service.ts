import Friend from "./friend.interface";
import friendModel from "./friend.model";
import friendValidation from "./friend.validation";


class FriendService {

    /**
     * 
     * @param data friend payload
     * @returns newly created friend
     */
    public async createFriend(data: Partial<Friend>): Promise<Friend | Error> {
        try {
            const friend = await friendModel.create(data)

            return friend
        } catch (error:any) {
            throw new Error(error)
        }
    }


    /**
     * 
     * @param userId - userId of user who want to fetch the list of friends
     * @returns - list of users friends or empty array if user has no friends
     */
    public async getAll(userId: string): Promise<Friend[] | Error> {
        try {
            const friends: any[] = await friendModel.find({$or:[{friend: userId},{userId}]}).populate({path: 'friend', select: ['username', 'id', 'photo']}).populate({path: 'userId', select: ['username', 'id', 'photo']})
            if(friends.length < 1) return []
            return this.hack(friends, userId)
        } catch (error:any) {
            throw new Error(error)
        }
    }

    /**
     * 
     * @param id - id of friend
     * @returns null
     */
    public async delete(id: string): Promise<null | Error> {
        try {
            const deletedFriend = await friendModel.findByIdAndDelete(id)
            // const deletedFriend = await friendModel.findOneAndDelete({$or:[{friend: userId},{userId}]})

            if(!deletedFriend) throw new Error("Not found")

            return null
        } catch (error:any) {
            throw new Error(error)
        }
    }

    private hack = (friends: any[], userId: string) => {
        return friends.map(e => {
            let el = e._doc
            let newFriend = el.friend
            let newUser = userId
            if(el.friend.id == userId) {
                newFriend = el.userId;
                newUser = el.friend.id;
            }
            return {
                ...el,
                friend: newFriend,
                userId: newUser
            }
        })
    }
}


export default FriendService;