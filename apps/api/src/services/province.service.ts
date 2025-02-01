import { Request } from "express";
import provinceRepository from "../repositories/province.repository";

class ProvinceService{
    async getList(req:Request){
        const {province} = req.query
        return await provinceRepository.findProvinceByName(String(province))
    }
    

}

export default new ProvinceService()