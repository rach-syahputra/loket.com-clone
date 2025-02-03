import { Router } from "express";
import categoryController from "../controllers/category.controller";

export const categoryRouter = ()=>{
    const router = Router()
    router.get("/categories",categoryController.getCategories)
    return router
}