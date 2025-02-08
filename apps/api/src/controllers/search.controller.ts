import { NextFunction, Request, Response } from 'express'
import searchService from '../services/search.service'

class searchController{
    async getSearchResults (req:Request,res:Response,next:NextFunction){
            try {
                const {query} = req.query
                const result = await searchService.searchEvents(query as string)
                
                res.status(200).send({
                    message:"Searching Query Successfully",
                    result
                })
            } catch (error) {
                next(error)
            }
    }
}

export default new searchController()