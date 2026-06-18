import { Link } from 'react-router-dom'
import { useWatched } from '../../hooks/useWatched'
import StarRating from '../../components/StarRating/StarRating'
import styles from './Watched.module.css'

function Watched() {
  const { watched, unmarkWatched } = useWatched()

  return (
    <div className="page-wrapper">
      <div className={styles.header}>
        <h1 className={styles.title}>Films vus</h1>
        <p className={styles.subtitle}>
          {watched.length === 0
            ? "Vous n'avez pas encore marqué de films comme vus."
            : `${watched.length} film(s) vu(s)`}
        </p>
      </div>

      {watched.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>👁</div>
          <p>Marquez les films comme vus depuis leur page détail pour les retrouver ici.</p>
          <Link to="/films" className={styles.cta}>
            Voir le catalogue →
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {watched.map(film => (
            <div key={film.id} className={styles.card}>
              <Link to={`/films/${film.tmdb_id}`}>
                <img src={film.affiche} alt={film.titre} className={styles.image} />
              </Link>
              <div className={styles.info}>
                <p className={styles.titre}>{film.titre}</p>
                <StarRating rating={film.rating || 0} readonly />
                <button
                  className={styles.removeBtn}
                  onClick={() => unmarkWatched(film.id)}
                >
                  Retirer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Watched