import { prisma } from "../helpers/prisma";

class searchRepository {
    async findEventsByQuery(query:string){
        return await prisma.event.findMany({
            where:{
                title:{
                    contains:query,
                    mode:"insensitive"
                }
            }
        })
    }
}

export default new searchRepository()