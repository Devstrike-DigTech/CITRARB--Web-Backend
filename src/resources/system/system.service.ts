import systemModel from "./system.model";
import System from "./system.interface";
import HttpException from "@/utils/exceptions/httpExceptions";


class SystemService {

    async createSystemDoc (status='inactive'): Promise<string> {
        try {
            const system = await systemModel.create({hookupStatus: status})

            return 'successfully create system DOC'
        } catch (error:any) {
            throw new HttpException(error.message, error.statusCode)
        }
    }

    async updateHookupStatus (): Promise<string> {
        try {
            const system = await systemModel.find()

            if(system.length > 0) {
                const updatedSys = await systemModel.findByIdAndUpdate(system[0]._id, {hookupStatus: this.statusSwitch(system[0].hookupStatus)})
            }else {
                await this.createSystemDoc()
            }

            return 'successfully updated'
        } catch (error:any) {
            throw new HttpException(error.message, error.statusCode)
        }
    }

    async statusSwitch (status: string) {
        if(status == 'active')
            return 'inactive'
        return 'active'
    }
}


export default SystemService