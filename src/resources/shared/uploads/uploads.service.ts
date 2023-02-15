import stream from "stream";
const { google } = require('googleapis');
import path from "path";



class GoogleDriveAPI {
    private KEYFILEPATH = path.join(__dirname,"..", "..", "..","..","coal-city-connect-368804-f3c9325a1e58.json");
    private SCOPES = ["https://www.googleapis.com/auth/drive"];
    private folderId = "11PqEvj1I29MTATF9P3iuH4jhQ1vz4rL-"
    
    private auth = new google.auth.GoogleAuth({
    keyFile: this.KEYFILEPATH,
    scopes: this.SCOPES,
    });

    public async uploadImages (files: any[]): Promise<any[]> {
        try {   
            const result = [];

            for(let file of files) {
                const id = await this.upload(file)
                const data = await this.getFile(id)
                result.push(data)
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
            const { data } = await google.drive({ version: 'v3', auth:this.auth }).files.create({
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
            const drive = google.drive({ version: 'v3', auth: this.auth });

            await drive.permissions.create({
                fileId: id,
                requestBody: {
                  role: 'reader',
                  type: 'anyone',
                },
              });

            const {data} =  await drive.files.get({ fileId: id, fields: 'webContentLink' });
            console.log(data.webContentLink, 'from')
            return data.webContentLink
        } catch (error:any) {
            console.log(error)
            throw new Error(error)
        }
    }
}

export default GoogleDriveAPI