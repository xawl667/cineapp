import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.js'
import filmRoutes from './routes/films.js'
import favorisRoutes from './routes/favoris.js'
import watchlistRoutes from './routes/watchlist.js'
import watchedRoutes from './routes/watched.js'
import moodRoutes from './routes/mood.js'

dotenv.config()

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(express.json());


app.use('/api/auth', authRoutes)
app.use('/api/films', filmRoutes)
app.use('/api/favoris', favorisRoutes)
app.use('/api/watchlist', watchlistRoutes)
app.use('/api/watched', watchedRoutes)
app.use('/api/mood', moodRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`)
})

export default app