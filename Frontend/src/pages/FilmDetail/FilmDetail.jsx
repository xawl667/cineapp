import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import styles from './FilmDetail.module.css'

function FilmDetail({ toggleFavori, isFavori, toggleWatchlist, isInWatchlist }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [film, setFilm] = useState(null)
  const [similaires, setSimilaires] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getFilmById(id)
      .then(data => {
        setFilm(data)
        window.scrollTo(0, 0)
      })
      .catch(() => navigate('/404'))
      .finally(() => setLoading(false))
  }, [id])

  // Films similaires via TMDB
  useEffect(() => {
  if (!film) return
  api.getSimilarFilms(film.tmdb_id)
    .then(data => setSimilaires(data))
    .catch(err => console.error('Erreur similaires:', err))
}, [film])

  if (loading) return <div className="page-wrapper"><p>Chargement...</p></div>
  if (!film) return null

  const favori = isFavori(film.tmdb_id)
  const watchlist = isInWatchlist(film.tmdb_id)

  return (
    <div className={styles.page}>
      <div
        className={styles.backdrop}
        style={{ backgroundImage: `url(${film.affiche})` }}
      >
        <div className={styles.backdropOverlay} />
      </div>

      <div className="page-wrapper" style={{ position: 'relative', zIndex: 2 }}>
        <Link to="/films" className={styles.backLink}>← Retour aux films</Link>

        <div className={styles.content}>
          <img src={film.affiche} alt={film.titre} className={styles.poster} />

          <div className={styles.info}>
            <div className={styles.genres}>
              {film.genres?.map(g => (
                <span key={g} className={styles.genreBadge}>{g}</span>
              ))}
            </div>

            <h1 className={styles.titre}>{film.titre}</h1>

            <div className={styles.meta}>
              <span>📅 {film.annee}</span>
              <span>⭐ {film.note} / 10</span>
            </div>

            <p className={styles.description}>{film.synopsis}</p>

            <div className={styles.actions}>
              <button
                className={`${styles.favBtn} ${favori ? styles.favActive : ''}`}
                onClick={() => toggleFavori(film)}
              >
                {favori ? '♥ Retirer des favoris' : '♡ Ajouter aux favoris'}
              </button>
              <button
                className={`${styles.watchBtn} ${watchlist ? styles.watchActive : ''}`}
                onClick={() => toggleWatchlist(film)}
              >
                {watchlist ? '✓ Dans la watchlist' : '+ Watchlist'}
              </button>
            </div>
          </div>
        </div>

        {similaires.length > 0 && (
          <section className={styles.similaires}>
            <h2 className={styles.similairesTitle}>Films similaires</h2>
            <div className={styles.similairesGrid}>
              {similaires.map(s => (
                <Link to={`/films/${s.id}`} key={s.id} className={styles.similaireCard}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${s.poster_path}`}
                    alt={s.title}
                  />
                  <p>{s.title}</p>
                  <span>⭐ {s.vote_average?.toFixed(1)}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default FilmDetail