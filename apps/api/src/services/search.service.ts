import { prisma } from "../helpers/prisma";
import searchRepository from "../repositories/search.repository";

class searchService{
    async searchEvents(query:string){
        return await searchRepository.findEventsByQuery(query)
    }
}

export default new searchService()