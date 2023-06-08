import occupationModel from "./occupation.model";
import Occupation from "./occupation.interface";
import Query from "@/utils/apiFeatures/Query";

class OccupationService {
    private OccupationModel = occupationModel

    /**
     * 
     * @param data Occupation payload
     * @returns newly created occupation details
     */
    public async create(data: Occupation): Promise<Occupation | Error> {
        try {
            const occupation = await this.OccupationModel.create(data);

            return occupation
        } catch (error:any) {
            throw new Error(error)
        }
    }

    /**
     * 
     * @param id - user id  
     * @returns 
     */
    public async get(id: string): Promise<Occupation | any[] | Error> {
        try {
            const occupation = await this.OccupationModel.findOne({userId: id});

            return occupation || []

        } catch (error:any) {
            throw new Error(error)
        }
    }

    /**
     * 
     * @param query - query object
     * @returns - all occupations
     */
    public async getAll(query: any): Promise<any[] | null | Error> {
        try {
            const occupations = this.OccupationModel.find({active: true});
            const features = new Query(occupations, query).filter().sort().limitFields().paginate();

            const result = await features.query;

            return result
        } catch (error:any) {
            throw new Error(error)
        }
    }

    /**
     * 
     * @param id - occupation id
     * @param data - occupation payload
     * @returns 
     */
    public async update(id:string, userId: string, data: Occupation): Promise<Occupation | Error> {
        try {
            const occupation = await this.OccupationModel.findOneAndUpdate({id, userId}, data, {runValidators: true, new: true})

            if(!occupation) throw new Error("Not found")

            return occupation;
        } catch (error:any) {
            throw new Error(error)
        }
    }
}

export default OccupationService;