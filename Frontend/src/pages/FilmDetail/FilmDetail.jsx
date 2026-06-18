import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { useWatched } from '../../hooks/useWatched'
import StarRating from '../../components/StarRating/StarRating'
import styles from './FilmDetail.module.css'

function FilmDetail({ toggleFavori, isFavori, toggleWatchlist, isInWatchlist }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [film, setFilm] = useState(null)
  const [similaires, setSimilaires] = useState([])
  const [loading, setLoading] = useState(true)
  const { markAsWatched, unmarkWatched, isWatched, getRating } = useWatched()

  useEffect(() => {
    api.getFilmDetails(id)
      .then(data => {
        setFilm(data)
        window.scrollTo(0, 0)
      })
      .catch(() => navigate('/404'))
      .finally(() => setLoading(false))
  }, [id])

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
  const vu = isWatched(film.tmdb_id)
  const note = getRating(film.tmdb_id)

  function handleRate(stars) {
    markAsWatched(film, stars)
  }

  function handleToggleWatched() {
    if (vu) {
      unmarkWatched(film.id)
    } else {
      markAsWatched(film, null)
    }
  }

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
              <span>⭐ {parseFloat(film.note).toFixed(1)} / 10</span>
              {film.realisateur && <span>🎬 {film.realisateur}</span>}
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
              <button
                className={`${styles.watchedBtn} ${vu ? styles.watchedActive : ''}`}
                onClick={handleToggleWatched}
              >
                {vu ? '✓ Déjà vu' : '👁 Marquer comme vu'}
              </button>
            </div>

            {vu && (
              <div className={styles.ratingSection}>
                <span>Votre note :</span>
                <StarRating rating={note || 0} onRate={handleRate} />
              </div>
            )}

            {film.trailerKey && (
              <div className={styles.trailer}>
                <h3>Bande-annonce</h3>
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${film.trailerKey}`}
                  title="Bande-annonce"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>

        {film.cast?.length > 0 && (
          <section className={styles.castSection}>
            <h2 className={styles.castTitle}>Casting</h2>
            <div className={styles.castGrid}>
              {film.cast.map((actor, i) => (
                <div key={i} className={styles.castCard}>
                  {actor.photo ? (
                    <img src={actor.photo} alt={actor.name} />
                  ) : (
                    <div className={styles.castPlaceholder}>
                      {actor.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <p className={styles.actorName}>{actor.name}</p>
                  <p className={styles.characterName}>{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

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