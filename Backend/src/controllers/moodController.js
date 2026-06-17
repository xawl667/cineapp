import pool from '../config/db.js'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_IMG_URL = 'https://image.tmdb.org/t/p/w500'

const tmdbFetch = (url) => fetch(`${url}&api_key=${TMDB_API_KEY}`)

// Mapping mood → IDs de genres TMDB (officiels)
const moodToGenreIds = {
  chill:     '35,16,10751',     // Comédie, Animation, Famille
  dark:      '53,27,80',        // Thriller, Horreur, Crime
  sad:       '18,10749',        // Drame, Romance
  motivated: '28,12,878',       // Action, Aventure, SF
  romantic:  '10749,35',        // Romance, Comédie
  scared:    '27,53',           // Horreur, Thriller
}

function formatFilm(film) {
  return {
    tmdb_id: film.id,
    titre: film.title,
    synopsis: film.overview,
    affiche: film.poster_path ? `${TMDB_IMG_URL}${film.poster_path}` : null,
    note: film.vote_average,
    annee: film.release_date ? parseInt(film.release_date.split('-')[0]) : null,
  }
}

async function upsertFilm(film) {
  const f = formatFilm(film)
  const result = await pool.query(
    `INSERT INTO films (tmdb_id, titre, synopsis, affiche, note, annee, genres)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (tmdb_id)
     DO UPDATE SET titre=$2, synopsis=$3, affiche=$4, note=$5, annee=$6
     RETURNING *`,
    [f.tmdb_id, f.titre, f.synopsis, f.affiche, f.note, f.annee, []]
  )
  return result.rows[0]
}

export async function getMoods(req, res) {
  res.json(Object.keys(moodToGenreIds))
}

export async function getRecommendations(req, res) {
  const { mood } = req.params

  if (!moodToGenreIds[mood]) {
    return res.status(400).json({ error: 'Mood invalide' })
  }

  try {
    const genreIds = moodToGenreIds[mood]
    const randomPage = Math.floor(Math.random() * 5) + 1

    const response = await tmdbFetch(
      `${TMDB_BASE_URL}/discover/movie?language=fr-FR&with_genres=${genreIds}&sort_by=popularity.desc&page=${randomPage}`
    )
    const data = await response.json()

    const films = await Promise.all(
      (data.results || []).slice(0, 12).map(film => upsertFilm(film))
    )

    if (req.user) {
      await pool.query(
        `INSERT INTO mood_sessions (user_id, mood) VALUES ($1, $2)`,
        [req.user.id, mood]
      )
    }

    res.json(films)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}