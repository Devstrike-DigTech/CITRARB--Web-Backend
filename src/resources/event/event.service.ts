import Event from "./event.interface";
import eventModel from "./event.model";
import Query from "@/utils/apiFeatures/Query";

export default class EventService {

    /**
     * 
     * @param data - event payload
     * @returns - newly created event
     */
    public async create(data: Partial<Event>): Promise<Event | Error> {
        try {

            //1) Make sure its only friends a user can host an event with

            const event = await eventModel.create(data)

            return event
        } catch (error:any) {
            throw new Error(error)
        }
    }

    /**
     * 
     * @param id id of the event to find
     * @returns - event found
     */
    public async get(id: string): Promise<Event> {
        try {
            const event = await eventModel.findById(id).populate("attendees")

            if(!event) throw new Error("not found")

            return event
        } catch (error:any) {
            throw new Error(error)
        }
    }

    /**
     * 
     * @param query - query parameters - sort, filter, limitFields, paginate
     * @returns result of search
     */
    public async getAll(query: any): Promise<any[] | null | Error> {
        try {
            const events = eventModel.find({}).populate("attendees")
            let features = new Query(events, query).filter().sort().limitFields().paginate()
            const results = await features.query

            return results
        } catch (error:any) {
            throw new Error(error)
        }
    }

    /**
     * 
     * @param id - event id to update
     * @param userId - userId of the event host
     * @param data - data to update in the event
     * @returns - newly updated data of the event
     */
    // public async update(id: string, userId: string, data: Partial<Event>): Promise<Event | Error> {
        public async update(id: string, userId: string, data: any): Promise<Event | Error> {
        try {
            const event = await eventModel.findOneAndUpdate({id, userId}, data, {runValidators: true, new: true})

            if(!event) throw new Error("not found")

            return event
        } catch (error:any) {
            throw new Error(error)
        }
    }


    /**
     * 
     * @param id - event id to update
     * @param userId - userId of the event host
     * @returns - null
     */
    public async delete(id: string, userId: string, data: Partial<Event>): Promise<null | Error> {
        try {
            const event = await eventModel.findOneAndDelete({id, userId})

            if(!event) throw new Error("not found")

            return null
        } catch (error:any) {
            throw new Error(error)
        }
    }


}