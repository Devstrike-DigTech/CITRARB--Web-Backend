import axios from "axios"


class YoutubeAPI {
    constructor(private readonly API_KEY: string, private readonly CHANNEL_ID: string) {}

    async getVideos() {
        try {
            //1)  Fetch Playlist IDs
            const playlistIds = await this.getPlayListIds()

            //2)  Fetch each playlist videos
            const vids = await this.getPlaylistItem(playlistIds)

            //3)  Return the list of videos
            


        return vids.flat(1)
        // return res.data
        } catch (error) {
            return error
        }

    }

    private async fetchPlayList() {
        try {
        const url = `https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${this.CHANNEL_ID}&key=${this.API_KEY}`
        const {data} = await axios.get(url);
        return data
        } catch (error) {
            return error
        }
    }

    private async getPlayListIds() {
        const list:any = await this.fetchPlayList()
        let playlistIds:any = []
        list.items.forEach((el: any) => {
            playlistIds.push(el.id)
        });

        return playlistIds
    }

    private async getPlaylistItem (list: any[]): Promise<any> {
       try {
        let items:any[] =  []
        for await(const id of list) {
            const data = await this.fetchPlayListItems(id)
            items.push(data)
        }
        
        return items
       } catch (error) {
        return error
       }
    }

    private async fetchPlayListItems (id: string): Promise< any>  {
        try {
            const url = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${id}&key=${this.API_KEY}`

            const {data} = await axios.get(url)
            const result = this.videoDetails(data.items)

            return result
        } catch (error) {
            return error
        }
    }

    private async videoDetails (data: any[]) {
        let result: any = []
        data.forEach((el) => {
            result.push({
                thumbnails: el.snippet.thumbnails,
                title: el.snippet.title,
                Link: `https://www.youtube.com/watch?v=${el.snippet.resourceId.videoId}`,
                publishedAt: el.snippet.publishedAt,
                description: el.snippet.description
            })
        })
        return result;
    }
}
export default YoutubeAPI