import pool from '../config/db.js'

export async function getWatchlist(req, res) {
  try {
    const result = await pool.query(
      `SELECT f.* FROM films f
       INNER JOIN watchlist w ON w.film_id = f.id
       WHERE w.user_id = $1
       ORDER BY w.created_at DESC`,
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export async function addToWatchlist(req, res) {
  const { film_id } = req.body
  try {
    await pool.query(
      `INSERT INTO watchlist (user_id, film_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [req.user.id, film_id]
    )
    res.status(201).json({ message: 'Ajouté à la watchlist' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export async function removeFromWatchlist(req, res) {
  const { film_id } = req.params
  try {
    await pool.query(
      `DELETE FROM watchlist WHERE user_id = $1 AND film_id = $2`,
      [req.user.id, film_id]
    )
    res.json({ message: 'Retiré de la watchlist' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}