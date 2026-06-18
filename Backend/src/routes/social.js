import express from 'express'
import {
  followUser, unfollowUser, getFollowers, getFollowing,
  getPublicProfile, getFeed, searchUsers , updateProfile
} from '../controllers/socialController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/feed', authMiddleware, getFeed)
router.get('/search', authMiddleware, searchUsers)
router.get('/:user_id/profile', getPublicProfile)
router.get('/:user_id/followers', getFollowers)
router.get('/:user_id/following', getFollowing)
router.post('/:user_id/follow', authMiddleware, followUser)
router.delete('/:user_id/follow', authMiddleware, unfollowUser)
router.put('/profile', authMiddleware, updateProfile)


export default router 