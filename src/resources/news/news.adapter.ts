import axios from "axios";
import { APIFetchInterface } from './transformHtml.interface';
import NewsInterface from './news.interface';

export default class APIFetch implements APIFetchInterface {
    async getHomePage(): Promise<string | Error> {
        try {
            const {data} = await axios.get('https://coalcity.ng')
            return data
        } catch (error) {
            throw new Error('Oops!!! Something went wrong')
        }
    }

    async getAll(pageNumber: number): Promise<string | Error> {
        try {
            const {data} = await axios.get(`https://coalcity.ng/page/${pageNumber}`)
            return (data as string)
        } catch (error) {
            console.log(error)
            throw new Error('Oops!!! Something went wrong fetching data.')
        }
    }

    async get(url: string): Promise<string | Error>{
        try {
            //check if url is valid
            if(!this._checkUrl(url)) {
                 throw new Error('value is not a valid URL')
            }
            const {data} = await axios.get(url)
            return data
        } catch (error) {
            throw new Error('Oops!!! Something went wrong fetching data.')
        }
    }


    private _checkUrl(url: string): boolean {
        try {
            new URL(url)
            return true
          } catch (error) {
            return false
          }
    }
}