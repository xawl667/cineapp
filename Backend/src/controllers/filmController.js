import pool from '../config/db.js'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_IMG_URL = 'https://image.tmdb.org/t/p/w500'

const tmdbFetch = (url) => fetch(`${url}&api_key=${TMDB_API_KEY}`)

function formatFilm(film) {
  return {
    tmdb_id: film.id,
    titre: film.title || film.name,
    synopsis: film.overview,
    affiche: film.poster_path ? `${TMDB_IMG_URL}${film.poster_path}` : null,
    note: film.vote_average,
    annee: film.release_date ? parseInt(film.release_date.split('-')[0]) : null,
    genres: film.genres ? film.genres.map(g => g.name) : []
  }
}

async function upsertFilm(film) {
  const f = formatFilm(film)
  const result = await pool.query(
    `INSERT INTO films (tmdb_id, titre, synopsis, affiche, note, annee, genres)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (tmdb_id)
     DO UPDATE SET titre=$2, synopsis=$3, affiche=$4, note=$5, annee=$6, genres=$7
     RETURNING *`,
    [f.tmdb_id, f.titre, f.synopsis, f.affiche, f.note, f.annee, f.genres]
  )
  return result.rows[0]
}

export async function getFilms(req, res) {
  const { page = 1, genre } = req.query
  try {
    let url = `${TMDB_BASE_URL}/movie/popular?language=fr-FR&page=${page}`
    
    if (genre) {
      url = `${TMDB_BASE_URL}/discover/movie?language=fr-FR&page=${page}&with_genres=${genre}`
    }

    const response = await tmdbFetch(url)
    const data = await response.json()

    const films = await Promise.all(
      data.results.map(film => upsertFilm(film))
    )

    res.json({
      films,
      total_pages: data.total_pages,
      current_page: data.page
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export async function getFilmById(req, res) {
  const { id } = req.params
  try {
    const response = await tmdbFetch(
      `${TMDB_BASE_URL}/movie/${id}?language=fr-FR`
    )
    const film = await response.json()
    const saved = await upsertFilm(film)
    res.json(saved)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export async function searchFilms(req, res) {
  const { q } = req.query
  if (!q) return res.status(400).json({ error: 'Paramètre q manquant' })

  try {
    const response = await tmdbFetch(
      `${TMDB_BASE_URL}/search/movie?language=fr-FR&query=${encodeURIComponent(q)}`
    )
    const data = await response.json()
    const films = await Promise.all(
      data.results.map(film => upsertFilm(film))
    )
    res.json(films)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}