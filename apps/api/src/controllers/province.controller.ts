import { NextFunction, Request, Response } from 'express'
import provinceService from '../services/province.service'

class ProvinceController{
    async getProvinces(req:Request,res:Response,next:NextFunction){
        try {
            const data = await provinceService.getList(req)
            res.status(200).send({
                message:"fetching products successfully",
                data
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new ProvinceController()