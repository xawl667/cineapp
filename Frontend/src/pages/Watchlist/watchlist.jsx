import { Link } from 'react-router-dom'
import FilmCard from '../../components/FilmCard/FilmCard'
import styles from './watchlist.module.css'

function Watchlist({ watchlist, toggleWatchlist, isInWatchlist }) {
  return (
    <div className="page-wrapper">
      <div className={styles.header}>
        <h1 className={styles.title}>Ma Watchlist</h1>
        <p className={styles.subtitle}>
          {watchlist.length === 0
            ? "Vous n'avez pas encore de films à voir."
            : `${watchlist.length} film(s) dans votre watchlist`}
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🎬</div>
          <p>Ajoutez des films à voir plus tard depuis le catalogue.</p>
          <Link to="/films" className={styles.cta}>
            Voir le catalogue →
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {watchlist.map((film) => (
            <FilmCard
              key={film.id}
              film={film}
              toggleWatchlist={toggleWatchlist}
              isInWatchlist={() => true}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Watchlist