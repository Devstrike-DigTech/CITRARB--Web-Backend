import EventAttendance, {DTOEventAttendance} from "./eventAttendance.interface";
import eventAttendanceModel from "./eventAttendance.model";
import EventService from "../event/event.service";
import moment from "moment";

export default class EventAttendanceService {
    private eventService = new EventService()


    /**
     * 
     * @param data - payload 
     * @returns newly created attendance
     */
    public async create(data: any): Promise<EventAttendance> {
        try {

            //check if event has passed
            const event = await this.eventService.get(data.eventId);

            if(moment(new Date()).isAfter(moment(event.time))) {
                throw new Error("Event Has already passed")
            }

            //check if user has created attendance for this event
            const isAttended = await eventAttendanceModel.findOne({eventId: data.eventId, userId: data.userId})

            if(isAttended) throw new Error("user has already created attendance")

            const eventAttendance = await eventAttendanceModel.create(data)
            
            if(eventAttendance.status == 'going') {
                await this.updateAttendance(eventAttendance.status, data.eventId, data.userId)
            }

            return eventAttendance
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async get(eventId: string, userId: string) : Promise<EventAttendance | null> {
        try {
            const eventAttendance = await eventAttendanceModel.findOne({eventId, userId})

            return eventAttendance
        } catch (error:any) {
            throw new Error();
        }
    }

    public async update(data: any): Promise<DTOEventAttendance> {
        try {
            //check if event has passed
            const event = await this.eventService.get(data.eventId);

            if(moment(new Date()).isAfter(moment(event.time))) {
                throw new Error("Event Has already passed")
            }

            const eventAttendance = await eventAttendanceModel.findOneAndUpdate({userId: data.userId, eventId: data.eventId}, data)

            if(!eventAttendance) throw new Error("not found")

            eventAttendance.status != data.status ? await this.updateAttendance(data.status, data.eventId, data.userId) : ''

            const value: DTOEventAttendance = {
                id: eventAttendance.id,
                status: data.status,
                userId: eventAttendance.userId,
                eventId: eventAttendance.eventId
            }
            return value
        } catch (error:any) {
            throw new Error(error)
        }
    }

    private async updateAttendance (status: string, eventId:string, userId: string): Promise<void> {
        try {
            status == "going" ? await this.eventService.update(eventId, userId, {$inc: {numberOfAttendee: 1}}) : await this.eventService.update(eventId, userId, {$inc: {numberOfAttendee: -1}})
        } catch (error:any) {
            throw new Error("something went wrong")
        }
    }

}