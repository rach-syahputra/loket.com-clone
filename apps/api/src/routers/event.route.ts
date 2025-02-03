import { Router } from "express";
import eventController from "../controllers/event.controller";

export const eventRouter =  () =>
{
    const router = Router()
    router.post("/eventcreate",eventController.createEvent)
    return router
}