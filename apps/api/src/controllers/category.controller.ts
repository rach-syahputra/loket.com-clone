import { NextFunction, Request, Response } from 'express'
import categoryService from '../services/category.service'

class CategoryController{
    async getCategories(req:Request,res:Response,next:NextFunction){
        try {
            const data  = await categoryService.getList(req)
            res.status(200).send({
                message:"fetching category successfully",
                data
            })            
        } catch (error) {
            next(error)
        }
    }
}

export default new CategoryController()