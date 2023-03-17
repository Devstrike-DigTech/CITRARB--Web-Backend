import Music from "./music.interface";
import musicModel from "./music.model";
import Query from "@/utils/apiFeatures/Query";
import GoogleDriveAPI from "../shared/uploads/uploads.service";

class MusicService {
    private googleDriveAPI = new GoogleDriveAPI();

    public async create (data: any): Promise<Music | undefined> {
        try {

            const isMusic = await musicModel.findOne({userId: data.userId});

            if(isMusic) {
                throw new Error("You cannot upload more than one music")
            } 

            const files = await this.googleDriveAPI.uploadImages(data.file)
            const payload = {
                title: data.title,
                description: data.description,
                file: files[0],
                userId: data.userId
            }
            const music = await musicModel.create(payload)

            return music
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async get(id: string) : Promise<Music> {
        try {
            const music = await musicModel.findById(id);

            if(!music) throw new Error("not found")

            return music
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async getAll(query: any) : Promise<any[]> {
        try {
            const music = musicModel.find({active: true}).populate('userId').populate('reactions');
            const features = new Query(music, query).filter().sort().limitFields().paginate();

            const result = await features.query;

            return result
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async update(userId: string, id: string, data: Partial<Music>) : Promise<Music> {
        try {
            const result = await musicModel.findOneAndUpdate({id, userId}, data, {runValidators: true, new: true})

            if(!result) throw new Error("Not found")

            return result
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
    public async updateV2(id: string, data: any): Promise<Music | Error> {
        try {
            const result = await musicModel.findByIdAndUpdate(id, data, {runValidators: true, new: true})

            if(!result) throw new Error("not found")

            return result
        } catch (error:any) {
            throw new Error(error)
        }
    }

    public async delete(userId: string, id: string) : Promise<void> {
        try {
            const result = await musicModel.findOneAndDelete({id, userId});
            if(!result) throw new Error("Not found")

            const files = [result.file]
            await this.googleDriveAPI.deleteFile(files)

        } catch (error:any) {
            throw new Error(error)
        }
    }
}

export default MusicService