import FriendRequest from "./friendRequest.interface";
import friendRequestModel from "./friendRequest.model";
import FriendService from "../friend/friend.service";
import { mongo } from "mongoose";

export default class FriendRequestService {
    private friendService = new FriendService();
    /**
     * 
     * @param data - should contain the userId, and requesterId
     * @returns newly created friend request
     */
    public async sendRequest(data: Partial<FriendRequest>): Promise<FriendRequest | Error> {
        try {
            //1) findOne where friend request matches this payload
            const isPayload = await friendRequestModel.findOne({userId: data.userId, requester: data.requester})

            //2) if isPayload status is declined, user cannot be the requester
            if(isPayload && isPayload.status == 'declined') {
                throw new Error("You cannot send a request to this user")
            }

            //3) check if user has already sent a request to requester
            const isExisting = await friendRequestModel.findOne({userId: data.requester, requester: data.userId})
            if(isExisting) {
                throw new Error("This user already sent you a friend request")
            }  

            const exists = await friendRequestModel.findOne({userId: data.userId, requester: data.requester})
            if(exists) {
                throw new Error("You have already sent a request")
            } 

            if(data.status) data.status = 'pending'
            const friendRequest: FriendRequest = await friendRequestModel.create(data)
            return friendRequest
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async getMyFriendRequests(id: string): Promise<FriendRequest[] | Error> {
        try {
            const friendRequests = await friendRequestModel.find({userId: id, status: 'pending'}).populate({path: "requester", select: ["id", "username", "photo"]})
            return friendRequests
        } catch (error:any) {
            throw new Error(error)
        }
    }

   /**
    * 
    * @param id request id
    * @param userId - id of user who wants to update request
     * @param status the new status of the request 
    * @returns updated friend request
    */
    public async updateRequest(id: string, userId: string, status: string): Promise<FriendRequest | Error> {
        try {
            const update = await friendRequestModel.findOneAndUpdate({id, userId}, {status}, {runValidators: true, new: true})

            if(!update) throw new Error("Not found")

            //1) if status is accepted add to friendlist
            if(update.status == 'accepted') {
                await this.friendService.createFriend({userId, friend: update.requester})
            }

            return update
        } catch (error:any) {
            throw new Error(error)
        }
    }

}