import Rating from "./rating.interface";
import ratingModel from "./rating.model";
import EyeWitnessService from "../eyeWitness/eyeWitness.service";
import EventAttendanceService from "../eventAttendance/eventAttendance.service";


export default class RatingService {

    private eyeWitnessService = new EyeWitnessService();

    /**
     * 
     * @param rating - rating value: 1 -5
     * @param userId - userId of the rater
     * @param uploadId - uploadId of the event being rated
     * @returns - newly created rating
     */
    public async create(rating: string, userId:string, uploadId: string): Promise<Rating> {
        try {

          //check if uploads exist
          const isUpload = await this.eyeWitnessService.get(uploadId)

          if(!isUpload) throw new Error("Upload does not exist")

          //check if user has already rated this event before.
          const hasRated = await ratingModel.findOne({userId, uploadId})

          if(hasRated) throw new Error("You cannot react to an upload more than once")

            const createdRating = await ratingModel.create({rating, userId, uploadId})
            await this.updateAvgRating(createdRating.uploadId, createdRating.userId)

            return createdRating
        } catch (error:any) {
            throw new Error(error)
        }
    }

    /**
     * 
     * @param uploadId - id of uploadId
     * @param userId - users id 
     * @returns 
     */
     private async updateAvgRating(uploadId: string, userId: string): Promise<void | Error> {
        try {
            const stats = await ratingModel.aggregate([
                {
                  $match: { uploadId }
                },
                {
                  $group: {
                    _id: '$uploadId',
                    nRating: { $sum: 1 },
                    avgRating: { $avg: '$rating' }
                  }
                }
              ]);
              const data = {
                avgRating: stats[0].avgRating, 
                ratingsQuantity: stats[0].nRating
            }
            console.log(data)
            await this.eyeWitnessService.updateV2(uploadId, data)
        } catch (error:any) {
            throw new Error(error)
        }
    }
}