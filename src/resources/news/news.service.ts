import { ITransformHtml } from './transformHtml.interface';
import NewsInterface from './news.interface';

export default class TransformHtml implements ITransformHtml {
    private $: any;
    constructor(cheerio: any,  html: string) {
        this.$ = cheerio.load(html)
    }

    
    executeAll(): NewsInterface[]{
            const data: NewsInterface[] = [];
            this.$("#mvp-tab-col1 li").each((i:number, newsList:any) => {
            const news: NewsInterface = {
              category: this.$(newsList).find("h3").text(),
              cover_photo_small_size: this.$(newsList).find(".mvp-main-blog-img img").last().attr("src") || 'nothing',
              cover_photo_big_size: this.$(newsList).find(".mvp-main-blog-img img").first().attr("src") || 'nothing',
              link: this.$(newsList).find("a").first().attr("href"),
              title: this.$(newsList).find("h2").text(),
              author: this.$(newsList).find(".mvp-blog-author").text(),
              date: this.$(newsList).find(".mvp-blog-date").text(),
              description: this.$(newsList).find("p").text(),
              id: i + 1,
            }
            data.push(news)
        })
        return data
    }

    executeOne(): any {
        const title = this.$('h1, .mvp-post-title').text()
        const news = this.$("section, .mvp-content-main").html()
        let article = ``;
        let images: any = []
        const coverPhoto = this.$("id, #mvp-post-feat-img").find("img").attr('src')

        this.$(news).each((el:any, list:any) => {
            if(this.$(list).find("div").attr("class") !== "saboxplugin-tab") {
                if(!this.$(list).text().includes('READ ALSO:')) {
                    article = article.trim() + this.$(list).text()
                }
            }
            if(typeof this.$(list).find("img").attr('src') == "string") {
                images.push(this.$(list).find("img").attr('src'))
            }

        })
        // console.log(article)
        // console.log(images)
        images.pop()

        return {
            article,
            title,
            images,
            coverPhoto
        }
    }

    totalNumberOfPages(): number {
        try {
        const numberOfPages = this.$(".mvp-nav-links").find('span').first().text().split(" ")[3]
        // console.log(numberOfPages.split(" ")[3])
        return (numberOfPages as number)
        } catch (error) {
            throw new Error('Oops!!! Something went wrong.')
        }
    }
}