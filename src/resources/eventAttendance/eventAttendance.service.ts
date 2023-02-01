import EventAttendance, {DTOEventAttendance} from "./eventAttendance.interface";
import eventAttendanceModel from "./eventAttendance.model";
import EventService from "../event/event.service";
import moment from "moment";
import eventModel from "../event/event.model";

export default class EventAttendanceService {
    private eventService = new EventService()


    /**
     * 
     * @param data - payload 
     * @returns newly created attendance
     */
    public async create(data: any): Promise<any> {
        try {

            //check if event has passed
            const event = await this.eventService.get(data.eventId);

            if(moment(new Date()).isAfter(moment(event.time))) {
                throw new Error("Event Has already passed")
            }

            //check if user has created attendance for this event
            const eventAttendance = event.eventAttendance
            if(eventAttendance.includes(data.userId)) {
                throw new Error("You have already marked this event for attendance")
            }
            eventAttendance.push(data.userId)

            const updatedEvent = await eventModel.findByIdAndUpdate(data.eventId, {eventAttendance: eventAttendance, $inc: {numberOfAttendee: 1}}, {runValidators: true, new: true})

            return updatedEvent
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async get(eventId: string, userId: string) : Promise<any | null> {
        try {
            const eventAttendance = await eventModel.findOne({id: eventId, userId})

            return eventAttendance
        } catch (error:any) {
            throw new Error();
        }
    }

}