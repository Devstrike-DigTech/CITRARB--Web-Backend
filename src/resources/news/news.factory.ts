import fs from 'fs'
import axios from 'axios'
import * as cheerio from 'cheerio'
import TransformHtml from './news.service'
import APIFetch from './news.adapter'

class Factory {
  private cheerio = cheerio
  async getAll(pageNumber: number) {
    try {
      const html = await new APIFetch().getAll(pageNumber)
      const result = await new TransformHtml(this.cheerio, (html as string)).executeAll()
      return result 
    } catch (error:any) {
      throw new Error(error)
    }
  }

  async getOne(url: any) {
    try {
      const html = await new APIFetch().get(url)
      const result = await new TransformHtml(this.cheerio, (html as string)).executeOne()
      return result 
    } catch (error:any) {
      throw new Error(error)
    }
  }
  async totalPages(){
    try {
      const html = await new APIFetch().getHomePage()
      const result = await new TransformHtml(this.cheerio, (html as string)).totalNumberOfPages()
      return result
    } catch (error:any) {
      throw new Error(error)
    }
  }
}

export default Factory

// (async function() {
//   const factory = new Factory()
//   const pageFive = await factory.getOne("https://coalcity.ng/kill-any-hoodlum-found-with-gun-or-any-dangerous-weapon-governor-umahi-to-security-agencies/")
//   console.log(pageFive)
//   // console.log(totalPages)
// })()