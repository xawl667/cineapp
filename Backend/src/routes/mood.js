import express from 'express'
import { getMoods, getRecommendations } from '../controllers/moodController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getMoods)
router.get('/:mood', authMiddleware, getRecommendations)

export default router

