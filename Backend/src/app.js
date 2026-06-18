import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'

import authRoutes from './routes/auth.js'
import filmRoutes from './routes/films.js'
import favorisRoutes from './routes/favoris.js'
import watchlistRoutes from './routes/watchlist.js'
import watchedRoutes from './routes/watched.js'
import moodRoutes from './routes/mood.js'
import socialRoutes from './routes/social.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173', credentials: true }
})

const userSockets = new Map()

io.on('connection', (socket) => {
  socket.on('register', (userId) => {
    userSockets.set(userId, socket.id)
  })

  socket.on('disconnect', () => {
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) userSockets.delete(userId)
    }
  })
})

app.set('io', io)
app.set('userSockets', userSockets)

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://FRONTEND.vercel.app' // ON remplace avec la vraie Url 
  ],
  credentials: true
}))

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/films', filmRoutes)
app.use('/api/favoris', favorisRoutes)
app.use('/api/watchlist', watchlistRoutes)
app.use('/api/watched', watchedRoutes)
app.use('/api/mood', moodRoutes)
app.use('/api/social', socialRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 3000

httpServer.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`)
})

export default app