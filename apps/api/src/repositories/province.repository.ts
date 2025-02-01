import { prisma } from "../helpers/prisma";

class ProvinceRepository{
    async findProvinceByName(province:string){
        return await prisma.province.findMany({
            where:{
                name:{
                    contains:province || ""
                }
            }
        })
    }
}
export default new ProvinceRepository()