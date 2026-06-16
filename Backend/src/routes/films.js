import express from 'express'
import { getFilms, getFilmById, searchFilms } from '../controllers/filmController.js'

const router = express.Router()

router.get('/', getFilms)
router.get('/search', searchFilms)
router.get('/:id', getFilmById)

export default router

