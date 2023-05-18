import NewsInterface from "./news.interface"

export interface ITransformHtml {
    executeAll(): NewsInterface[]
    // executeOne(): NewsInterface
    totalNumberOfPages(): number
}

export interface APIFetchInterface {
    getHomePage(): Promise<string | Error>
    get(url: string): Promise<string | Error>
    getAll(pageNumber: number): Promise< string | Error>
}