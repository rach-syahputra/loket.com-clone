import { prisma } from "../helpers/prisma"
import { Request } from "express";

class CategoryService{
    async getList(req:Request){
        const {category} = req.query
        return await prisma.category.findMany({
            where:{
                name:{
                    contains:String(category || "")
                }
            }
        })
    }
}

export default new CategoryService()