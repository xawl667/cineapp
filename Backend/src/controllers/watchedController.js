import pool from '../config/db.js'

export async function getWatched(req, res) {
  try {
    const result = await pool.query(
      `SELECT f.*, w.rating, w.review, w.watched_at 
       FROM films f
       INNER JOIN watched w ON w.film_id = f.id
       WHERE w.user_id = $1
       ORDER BY w.watched_at DESC`,
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export async function addWatched(req, res) {
  const { film_id, rating, review } = req.body
  try {
    await pool.query(
      `INSERT INTO watched (user_id, film_id, rating, review)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, film_id)
       DO UPDATE SET rating = $3, review = $4, watched_at = NOW()`,
      [req.user.id, film_id, rating, review]
    )
    res.status(201).json({ message: 'Film marqué comme vu' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export async function removeWatched(req, res) {
  const { film_id } = req.params
  try {
    await pool.query(
      `DELETE FROM watched WHERE user_id = $1 AND film_id = $2`,
      [req.user.id, film_id]
    )
    res.json({ message: 'Retiré des films vus' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}