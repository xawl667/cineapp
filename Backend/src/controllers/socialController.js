import pool from '../config/db.js'

export async function followUser(req, res) {
  const { user_id } = req.params
  if (user_id === req.user.id) {
    return res.status(400).json({ error: "Vous ne pouvez pas vous suivre vous-même" })
  }
  try {
    await pool.query(
      `INSERT INTO follows (follower_id, following_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [req.user.id, user_id]
    )
    await pool.query(
      `INSERT INTO activities (user_id, type) VALUES ($1, 'follow')`,
      [req.user.id]
    )
    res.status(201).json({ message: 'Utilisateur suivi' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export async function unfollowUser(req, res) {
  const { user_id } = req.params
  try {
    await pool.query(
      `DELETE FROM follows WHERE follower_id = $1 AND following_id = $2`,
      [req.user.id, user_id]
    )
    res.json({ message: 'Utilisateur retiré' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export async function getFollowers(req, res) {
  const { user_id } = req.params
  try {
    const result = await pool.query(
      `SELECT u.id, u.username, u.avatar FROM users u
       INNER JOIN follows f ON f.follower_id = u.id
       WHERE f.following_id = $1`,
      [user_id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export async function getFollowing(req, res) {
  const { user_id } = req.params
  try {
    const result = await pool.query(
      `SELECT u.id, u.username, u.avatar FROM users u
       INNER JOIN follows f ON f.following_id = u.id
       WHERE f.follower_id = $1`,
      [user_id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export async function getPublicProfile(req, res) {
  const { user_id } = req.params
  try {
    const user = await pool.query(
      `SELECT id, username, avatar, created_at FROM users WHERE id = $1`,
      [user_id]
    )
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur introuvable' })
    }

    const favoris = await pool.query(
      `SELECT f.* FROM films f
       INNER JOIN favoris fav ON fav.film_id = f.id
       WHERE fav.user_id = $1
       ORDER BY fav.created_at DESC LIMIT 12`,
      [user_id]
    )

    const followersCount = await pool.query(
      `SELECT COUNT(*) FROM follows WHERE following_id = $1`,
      [user_id]
    )

    const followingCount = await pool.query(
      `SELECT COUNT(*) FROM follows WHERE follower_id = $1`,
      [user_id]
    )

    res.json({
      user: user.rows[0],
      favoris: favoris.rows,
      followersCount: parseInt(followersCount.rows[0].count),
      followingCount: parseInt(followingCount.rows[0].count)
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export async function getFeed(req, res) {
  try {
    const result = await pool.query(
      `SELECT a.id, a.type, a.created_at, u.username, u.avatar,
              f.titre, f.affiche, f.tmdb_id
       FROM activities a
       INNER JOIN users u ON u.id = a.user_id
       LEFT JOIN films f ON f.id = a.film_id
       WHERE a.user_id IN (
         SELECT following_id FROM follows WHERE follower_id = $1
       )
       ORDER BY a.created_at DESC
       LIMIT 30`,
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export async function searchUsers(req, res) {
  const { q } = req.query
  if (!q) return res.json([])
  try {
    const result = await pool.query(
      `SELECT id, username, avatar FROM users
       WHERE username ILIKE $1 AND id != $2
       LIMIT 10`,
      [`%${q}%`, req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}