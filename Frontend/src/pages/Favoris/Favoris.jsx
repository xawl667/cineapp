import { Link } from 'react-router-dom'
import FilmCard from '../../components/FilmCard/FilmCard'
import styles from './Favoris.module.css'

function Favoris({ favoris, toggleFavori, isFavori }) {
  return (
    <div className="page-wrapper">
      <div className={styles.header}>
        <h1 className={styles.title}>Mes Favoris</h1>
        <p className={styles.subtitle}>
          {favoris.length === 0
            ? "Vous n'avez pas encore de favoris."
            : `${favoris.length} film(s) dans vos favoris`}
        </p>
      </div>

      {favoris.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>♡</div>
          <p>Parcourez le catalogue et cliquez sur ♡ pour ajouter des films ici.</p>
          <Link to="/films" className={styles.cta}>
            Voir le catalogue →
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {favoris.map((film) => (
            <FilmCard
              key={film.id}
              film={film}
              toggleFavori={toggleFavori}
              isFavori={() => true}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Favoris
