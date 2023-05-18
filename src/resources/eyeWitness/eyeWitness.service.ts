import EyeWitness from "./eyeWitness.interface";
import eyeWitnessModel from "./eyeWitness.model";
import Query from "@/utils/apiFeatures/Query";
import GoogleDriveAPI from "../shared/uploads/uploads.service";

class EyeWitnessService {
    private googleDriveAPI = new GoogleDriveAPI();

    public async create (data: any): Promise<EyeWitness | undefined> {
        try {
            const images = await this.googleDriveAPI.uploadImages(data.images)
            const videos = await this.googleDriveAPI.uploadImages(data.videos)
            const payload = {
                videos: videos,
                title: data.title,
                description: data.description,
                location: data.location,
                images,
                userId: data.userId
            }
            const eyeWitness = await eyeWitnessModel.create(payload)

            return eyeWitness
        } catch (error:any) {
            console.log(error)
            throw new Error(error)
        }
    }

    public async get(id: string) : Promise<EyeWitness> {
        try {
            const eyeWitness = await eyeWitnessModel.findById(id);

            if(!eyeWitness) throw new Error("not found")

            return eyeWitness
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async getAll(query: any) : Promise<any[]> {
        try {
            const eyeWitness = eyeWitnessModel.find({active: true}).populate('userId').populate('reactions');
            const features = new Query(eyeWitness, query).filter().sort().limitFields().paginate();

            const result = await features.query;

            return result
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async update(userId: string, id: string, data: Partial<EyeWitness>) : Promise<EyeWitness> {
        try {
            const result = await eyeWitnessModel.findOneAndUpdate({id, userId}, data, {runValidators: true, new: true})

            if(!result) throw new Error("Not found")

            return result
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async verifyContent(id: string): Promise<EyeWitness> {
        try {
            const data = await eyeWitnessModel.findById(id)
            let verificationStatus = data?.isVerified

            if(!data) throw new Error("Not found")
            
            await eyeWitnessModel.findByIdAndUpdate(id, {isVerified: !verificationStatus}, {new: true, runValidators: true})

            data.isVerified = !verificationStatus

            return data
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async AdminDelete(id: string) : Promise<void> {
        try {
            const result = await eyeWitnessModel.findByIdAndDelete(id);
            if(!result) throw new Error("Not found")
        } catch (error:any) {
            throw new Error(error)
        }
    }


    /**
     * 
     * @param id 
     * @param data 
     * @returns 
     */
    public async updateV2(id: string, data: any): Promise<EyeWitness | Error> {
        try {
            const result = await eyeWitnessModel.findByIdAndUpdate(id, data, {runValidators: true, new: true})

            if(!result) throw new Error("not found")

            return result
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async delete(userId: string, id: string) : Promise<void> {
        try {
            const result = await eyeWitnessModel.findOneAndDelete({id, userId});
            if(!result) throw new Error("Not found")

            const files = [...result.images, ...result.videos]
            await this.googleDriveAPI.deleteFile(files)

        } catch (error:any) {
            throw new Error(error)
        }
    }
}

export default EyeWitnessService