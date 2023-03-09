import Rating from "./rating.interface";
import ratingModel from "./rating.model";
import MusicService from "../music/music.service";


export default class RatingService {

    private musicService = new MusicService();

    /**
     * 
     * @param rating - rating value: 1 -5
     * @param userId - userId of the rater
     * @param uploadId - uploadId of the event being rated
     * @returns - newly created rating
     */
    public async create(rating: string, userId:string, musicId: string): Promise<Rating> {
        try {

          //check if uploads exist
          const isUpload = await this.musicService.get(musicId)

          if(!isUpload) throw new Error("Upload does not exist")

          //check if user has already rated this event before.
          const hasRated = await ratingModel.findOne({userId, musicId})

          if(hasRated) throw new Error("You cannot react to an upload more than once")

            const createdRating = await ratingModel.create({rating, userId, musicId})
            await this.updateAvgRating(createdRating.musicId, createdRating.userId)

            return createdRating
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async update(userId: string, musicId: string, rating: number): Promise<Rating | Error> {
      const updatedRating = await ratingModel.findOneAndUpdate({userId, musicId}, {rating}, {new: true, runValidators: true})
      if(!updatedRating) throw new Error('not found')
      await this.updateAvgRating(updatedRating.musicId, updatedRating.userId)

      return updatedRating

    }

    /**
     * 
     * @param uploadId - id of uploadId
     * @param userId - users id 
     * @returns 
     */
     private async updateAvgRating(musicId: string, userId: string): Promise<void | Error> {
        try {
            const stats = await ratingModel.aggregate([
                {
                  $match: { musicId }
                },
                {
                  $group: {
                    _id: '$musicId',
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
            await this.musicService.updateV2(musicId, data)
        } catch (error:any) {
            throw new Error(error)
        }
    }
}