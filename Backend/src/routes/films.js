import express from 'express'
import { getFilms, getFilmById, searchFilms,getSimilarFilms, getFilmDetails } from '../controllers/filmController.js'


const router = express.Router()

router.get('/', getFilms)
router.get('/search', searchFilms)
router.get('/:id', getFilmById)
router.get('/:id/similar', getSimilarFilms)
router.get('/:id/details', getFilmDetails)



export default router

