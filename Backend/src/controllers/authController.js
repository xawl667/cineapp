import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../config/db.js'

export async function register(req, res) {
  const { username, email, password } = req.body

  try {
    // Vérifie si l'email existe déjà
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' })
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Création de l'utilisateur
    const result = await pool.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, created_at`,
      [username, email, hashedPassword]
    )

    const user = result.rows[0]

    // Génération du token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({ user, token })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export async function login(req, res) {
  const { email, password } = req.body

  try {
    // Cherche l'utilisateur
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
    }

    const user = result.rows[0]

    // Vérifie le mot de passe
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
    }

    // Génère le token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Ne renvoie pas le mot de passe
    const { password: _, ...userSansPassword } = user

    res.json({ user: userSansPassword, token })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }

  const existing = await pool.query(
  'SELECT id FROM users WHERE email = $1 OR username = $2',
  [email, username]
)
if (existing.rows.length > 0) {
    return res.status(400).json({ error: 'Email ou username déjà utilisé' })
  }
}

export async function getMe(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, username, email, avatar, created_at FROM users WHERE id = $1',
      [req.user.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}