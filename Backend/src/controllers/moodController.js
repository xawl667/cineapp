import pool from '../config/db.js'

// Mapping mood → genres TMDB
const moodToGenres = {
  chill:     ['Comedy', 'Animation', 'Family'],
  dark:      ['Thriller', 'Horror', 'Crime'],
  sad:       ['Drama', 'Romance'],
  motivated: ['Action', 'Adventure', 'Science Fiction'],
  romantic:  ['Romance', 'Comedy'],
  scared:    ['Horror', 'Thriller'],
}

export async function getMoods(req, res) {
  res.json(Object.keys(moodToGenres))
}

export async function getRecommendations(req, res) {
  const { mood } = req.params

  if (!moodToGenres[mood]) {
    return res.status(400).json({ error: 'Mood invalide' })
  }

  try {
    const genres = moodToGenres[mood]

    // Cherche les films qui matchent les genres du mood
    const result = await pool.query(
      `SELECT * FROM films
       WHERE genres && $1
       ORDER BY note DESC
       LIMIT 20`,
      [genres]
    )

    // Sauvegarde la session mood
    if (req.user) {
      await pool.query(
        `INSERT INTO mood_sessions (user_id, mood) VALUES ($1, $2)`,
        [req.user.id, mood]
      )
    }

    res.json(result.rows)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}