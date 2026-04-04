import { Link } from 'react-router-dom'
import styles from './FilmCard.module.css'

function FilmCard({ film, toggleFavori, isFavori }) {
  const favori = isFavori(film.id)

  const handleFavori = (e) => {
    e.preventDefault() // Empêche la navigation en cliquant sur le bouton ♥
    toggleFavori(film)
  }

  return (
    <Link to={`/films/${film.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={film.image} alt={film.titre} className={styles.image} />
        <div className={styles.overlay}>
          <span className={styles.note}>⭐ {film.note}</span>
          <button
            className={`${styles.favBtn} ${favori ? styles.favActive : ''}`}
            onClick={handleFavori}
            aria-label={favori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            {favori ? '♥' : '♡'}
          </button>
        </div>
      </div>
      <div className={styles.info}>
        <h3 className={styles.titre}>{film.titre}</h3>
        <div className={styles.meta}>
          <span className={styles.genre}>{film.genre}</span>
          <span className={styles.annee}>{film.annee}</span>
        </div>
      </div>
    </Link>
  )
}

export default FilmCard
