import { Router } from 'express'
import searchController from '../controllers/search.controller'

export const searchRouter=()=>{
    const router = Router()

    router.get('/search',searchController.getSearchResults)
    return router
}

