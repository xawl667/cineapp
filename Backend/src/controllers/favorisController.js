import pool from '../config/db.js'

export async function getFavoris(req, res) {
  try {
    const result = await pool.query(
      `SELECT f.* FROM films f
       INNER JOIN favoris fav ON fav.film_id = f.id
       WHERE fav.user_id = $1
       ORDER BY fav.created_at DESC`,
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export async function addFavori(req, res) {
  const { film_id } = req.body
  try {
    await pool.query(
      `INSERT INTO favoris (user_id, film_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [req.user.id, film_id]
    )
    await pool.query(
      `INSERT INTO activities (user_id, type, film_id) VALUES ($1, 'favori', $2)`,
      [req.user.id, film_id]
    )

    const followers = await pool.query(
      `SELECT follower_id FROM follows WHERE following_id = $1`,
      [req.user.id]
    )
    const io = req.app.get('io')
    const userSockets = req.app.get('userSockets')

    followers.rows.forEach(({ follower_id }) => {
      const socketId = userSockets.get(follower_id)
      if (socketId) {
        io.to(socketId).emit('new_activity', {
          type: 'favori',
          username: req.user.username,
          film_id
        })
      }
    })

    res.status(201).json({ message: 'Ajouté aux favoris' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export async function removeFavori(req, res) {
  const { film_id } = req.params
  try {
    await pool.query(
      `DELETE FROM favoris WHERE user_id = $1 AND film_id = $2`,
      [req.user.id, film_id]
    )
    res.json({ message: 'Retiré des favoris' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}