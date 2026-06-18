import express from 'express'
import { getWatched, addWatched, removeWatched } from '../controllers/watchedController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, getWatched)
router.post('/', authMiddleware, addWatched)
router.delete('/:film_id', authMiddleware, removeWatched)

export default router