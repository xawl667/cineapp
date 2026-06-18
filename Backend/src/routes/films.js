import express from 'express'
import {
  getFilms,
  getFilmById,
  searchFilms,
  getSimilarFilms,
  getFilmDetails,
  getTrending
} from '../controllers/filmController.js'

const router = express.Router()

router.get('/', getFilms)
router.get('/search', searchFilms)
router.get('/trending', getTrending)
router.get('/:id/similar', getSimilarFilms)
router.get('/:id/details', getFilmDetails)
router.get('/:id', getFilmById)

export default router