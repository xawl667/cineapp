import express from 'express'
import { getFavoris, addFavori, removeFavori } from '../controllers/favorisController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, getFavoris)
router.post('/', authMiddleware, addFavori)
router.delete('/:film_id', authMiddleware, removeFavori)

export default router