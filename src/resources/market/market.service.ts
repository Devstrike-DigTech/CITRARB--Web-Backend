import marketModel from "./market.model";
import Market from "./market.interface";
import Query from "@/utils/apiFeatures/Query";
import GoogleDriveAPI from "../shared/uploads/uploads.service";


class MarketService {
    private googleDriveAPI = new GoogleDriveAPI();

    public async create (data: any): Promise<Market | undefined> {
        try {
            // check the number of products user have uploaded so far
            const noOfProducts = await this.getAll({userId: data.userId});
            if(noOfProducts.length == 3) {
                throw new Error("You cannot upload more than 3 products")
            } 
            const images = await this.googleDriveAPI.uploadImages(data.files)
            console.log(images, 'market ')
            const marketPayload = {
                name: data.name,
                description: data.description,
                price: data.price,
                category: data.category,
                images,
                userId: data.userId
            }
            const market = await marketModel.create(marketPayload)

            return market
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async get(id: string) : Promise<Market> {
        try {
            const market = await marketModel.findById(id);

            if(!market) throw new Error("not found")

            return market
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async getAll(query: any) : Promise<any[]> {
        try {
            const market = marketModel.find({active: true});
            const features = new Query(market, query).filter().sort().limitFields().paginate();

            const result = await features.query;

            return result
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async update(userId: string, id: string, data: Partial<Market>) : Promise<Market> {
        try {
            const result = await marketModel.findOneAndUpdate({id, userId}, data, {runValidators: true, new: true})

            if(!result) throw new Error("Not found")

            return result
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async delete(userId: string, id: string) : Promise<void> {
        try {
            const result = await marketModel.findOneAndDelete({id: userId});
            if(!result) throw new Error("Not found")

        } catch (error:any) {
            throw new Error(error)
        }
    }
}

export default MarketService