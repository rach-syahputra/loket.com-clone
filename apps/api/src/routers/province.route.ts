import { Router } from "express";
import provinceController from "../controllers/province.controller";

export const provinceRouter = ()=>{
    const router = Router()

    router.get("/provinces",provinceController.getProvinces)
    return router
}