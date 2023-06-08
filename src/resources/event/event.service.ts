import Event from "./event.interface";
import eventModel from "./event.model";
import Query from "@/utils/apiFeatures/Query";
import mongoose from "mongoose";

export default class EventService {

    /**
     * 
     * @param data - event payload
     * @returns - newly created event
     */
    public async create(data: Partial<Event>): Promise<Event | Error> {
        try {

            if(data.coHosts) {
                for(var i = 0; i<data.coHosts.length; i++) {
                    if(!mongoose.Types.ObjectId.isValid((data.coHosts[i] as string))) {
                        throw new Error('Not a valid id in coHosts')
                    }
                }
            }
            //1) Make sure its only friends a user can host an event with
            const event = await eventModel.create(data)

            return event
        } catch (error:any) {
            console.log(error)
            throw new Error((error as any))
        }
    }

    /**
     * 
     * @param id id of the event to find
     * @returns - event found
     */
    public async get(id: string): Promise<Event> {
        try {
            const event = await eventModel.findById(id).populate({path: 'coHosts'})

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
            const events = eventModel.find({}).populate([{path: 'host'},{path: 'coHosts'}])
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
            const event = await eventModel.findOneAndUpdate({id, host: userId}, data, {runValidators: true, new: true})

            if(!event) throw new Error("not found")

            return event
        } catch (error:any) {
            throw new Error(error)
        }
    }


        /**
         * 
         * @param id - event Id
         * @param data - data to update
         * @returns 
         */
        public async updateV2(id: string, data: any): Promise<Event | Error> {
            try {
                const event = await eventModel.findByIdAndUpdate(id, data, {runValidators: true, new: true})
    
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
    public async delete(id: string, userId: string): Promise<null | Error> {
        try {
            const event = await eventModel.findOneAndDelete({id, host: userId})

            if(!event) throw new Error("not found")

            return null
        } catch (error:any) {
            throw new Error(error)
        }
    }


}