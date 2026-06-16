import express from 'express'
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../controllers/watchlistController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, getWatchlist)
router.post('/', authMiddleware, addToWatchlist)
router.delete('/:film_id', authMiddleware, removeFromWatchlist)

export default router   