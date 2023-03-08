import Rating from "./rating.interface";
import ratingModel from "./rating.model";
import EventService from "../event/event.service";
import EventAttendanceService from "../eventAttendance/eventAttendance.service";
import moment from "moment";


export default class RatingService {

    private eventService = new EventService();
    private eventAttendanceService = new EventAttendanceService();

    /**
     * 
     * @param rating - rating value: 1 -5
     * @param userId - userId of the rater
     * @param eventId - eventId of the event being rated
     * @returns - newly created rating
     */
    public async create(rating: string, userId:string, eventId: string): Promise<Rating> {
        try {
          //check if user marked attendance as going
          const isAttendance = await this.eventAttendanceService.get(eventId, userId);

          if(!isAttendance || isAttendance.status == 'not going') {
            throw new Error("You cannot rate an event you did not attend")
          }


          //check if event has passed
          const event = await this.eventService.get(eventId);

            if(moment(new Date()).isBefore(moment(event.time))) {
                throw new Error("You cannot rate an event before it takes place.")
            }

          //check if user has already rated this event before.
          const hasRated = await ratingModel.findOne({userId, eventId})

          if(hasRated) throw new Error("You cannot rate an event more than once")

            const createdRating = await ratingModel.create({rating, userId, eventId})
            await this.updateAvgRating(createdRating.eventId, createdRating.userId)

            return createdRating
        } catch (error:any) {
            throw new Error(error)
        }
    }

    /**
     * 
     * @param eventId - id of event
     * @param userId - users id 
     * @returns 
     */
     private async updateAvgRating(eventId: string, userId: string): Promise<void | Error> {
        try {
            const stats = await ratingModel.aggregate([
                {
                  $match: { eventId }
                },
                {
                  $group: {
                    _id: '$eventId',
                    nRating: { $sum: 1 },
                    avgRating: { $avg: '$rating' }
                  }
                }
              ]);
              const data = {
                avgRating: stats[0].avgRating, 
                ratingsQuantity: stats[0].nRating
            }
            // await eventModel.findOneAndUpdate({id: eventId, userId}, data, {runValidators: true, new: true})
            await this.eventService.updateV2(eventId, data)
        } catch (error:any) {
            throw new Error(error)
        }
    }
}