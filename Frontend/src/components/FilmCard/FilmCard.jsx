import { Link } from 'react-router-dom'
import styles from './FilmCard.module.css'

function FilmCard({ film, toggleFavori, isFavori, toggleWatchlist, isInWatchlist }) {
  const favori = isFavori ? isFavori(film.tmdb_id) : false
  const watchlist = isInWatchlist ? isInWatchlist(film.tmdb_id) : false

  const handleFavori = (e) => {
    e.preventDefault()
    toggleFavori(film)
  }

  const handleWatchlist = (e) => {
    e.preventDefault()
    toggleWatchlist(film)
  }

  return (
    <Link to={`/films/${film.tmdb_id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={film.affiche} alt={film.titre} className={styles.image} />
        <div className={styles.overlay}>
          <span className={styles.note}>⭐ {film.note}</span>
          <div className={styles.actions}>
            {toggleFavori && (
              <button
                className={`${styles.favBtn} ${favori ? styles.favActive : ''}`}
                onClick={handleFavori}
              >
                {favori ? '✓ Favori' : '+ Favori'}
              </button>
            )}
            {toggleWatchlist && (
              <button
                className={`${styles.watchBtn} ${watchlist ? styles.watchActive : ''}`}
                onClick={handleWatchlist}
              >
                {watchlist ? '✓ Watchlist' : '+ Watchlist'}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className={styles.info}>
        <h3 className={styles.titre}>{film.titre}</h3>
        <div className={styles.meta}>
          <span className={styles.genre}>{film.genres?.[0]}</span>
          <span className={styles.annee}>{film.annee}</span>
        </div>
      </div>
    </Link>
  )
}

export default FilmCard