import { Prisma } from "@prisma/client";
import { prisma } from "../helpers/prisma"
import { Request } from "express";

class ProvinceService{
    async getList(req:Request){
        const {province} = req.query
        return await prisma.province.findMany({
            where:{
                name:{
                    contains:String(province || "")
                },

            }
        })
    }
    

}

export default new ProvinceService()