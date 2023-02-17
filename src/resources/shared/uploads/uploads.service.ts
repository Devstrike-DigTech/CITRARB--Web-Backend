import stream from "stream";
const { google } = require('googleapis');
import path from "path";



class GoogleDriveAPI {
    private KEYFILEPATH = path.join(__dirname,"..", "..", "..","..","coal-city-connect-368804-f3c9325a1e58.json");
    private SCOPES = ["https://www.googleapis.com/auth/drive"];
    private folderId = process.env.GOOGLE_DRIVE_FOLDER_ID
    private auth = new google.auth.GoogleAuth({
    keyFile: this.KEYFILEPATH,
    scopes: this.SCOPES,
    });
    private drive = google.drive({ version: 'v3', auth:this.auth })
    

    public async uploadImages (files: any[]): Promise<any[]> {
        try {   
            const result = [];

            for(let file of files) {
                const id = await this.upload(file)
                const data = await this.getFile(id)
                result.push({fileId: id, webContentLink: data})
            }

            return result
        } catch (error:any) {
            throw new Error(error) 
        }
    }
    
    private async upload (file: any) :Promise<string> {
        try {
            const bufferStream = new stream.PassThrough();
            bufferStream.end(file.buffer);
            const { data } = await this.drive.files.create({
                media: {
                mimeType: file.mimeType,
                body: bufferStream,
                },
                requestBody: {
                name: `${Date.now()}_${Math.floor(Math.random() * 10000)}_${Date.now() + (Math.floor(Math.random() * 10000))}`,
                parents: [this.folderId],
                },
                fields: 'id,name',
            });
            return data.id
        } catch (error:any) {
            console.log(error)
            throw new Error(error)
        }
    }

    private async getFile(id: string): Promise<string> {
        try {

            await this.drive.permissions.create({
                fileId: id,
                requestBody: {
                  role: 'reader',
                  type: 'anyone',
                },
              });

            const {data} =  await this.drive.files.get({ fileId: id, fields: 'webContentLink' });
            return data.webContentLink
        } catch (error:any) {
            console.log(error)
            throw new Error(error)
        }
    }

    public async deleteFile(payload:any[]): Promise<void> {
        try {
            for(var file of payload) {
                const response = await this.drive.files.delete({
                    fileId: file.fileId
                })
            }
        } catch (error:any) {
            throw new Error(error)
        }
    }
}

export default GoogleDriveAPI