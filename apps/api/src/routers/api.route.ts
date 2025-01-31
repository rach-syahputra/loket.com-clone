import { Router } from "express";
import { provinceRouter } from "./province.route";
import { categoryRouter } from "./category.route";

const apiRouter = Router()

apiRouter.use('/',provinceRouter())
apiRouter.use('/',categoryRouter())

export default apiRouter