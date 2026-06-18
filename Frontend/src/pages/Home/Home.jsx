import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import styles from './Home.module.css'

function Home() {
  const { user } = useAuth()
  const [visible, setVisible] = useState(false)
  const [topFilms, setTopFilms] = useState([])
  const [tendances, setTendances] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    Promise.all([
      api.getFilms(1),
      api.getTrending()
    ])
      .then(([popular, trending]) => {
        const sorted = [...popular.films]
          .sort((a, b) => parseFloat(b.note) - parseFloat(a.note))
          .slice(0, 3)
        setTopFilms(sorted)
        setTendances(trending.slice(0, 6))
      })
      .catch(err => console.error('Erreur Home:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className={`${styles.main} ${visible ? styles.visible : ''}`}>

      {/* HERO */}
      <section className={styles.hero}>
        {topFilms[0] && (
          <div className={styles.heroBackground}>
            <img src={topFilms[0].affiche} alt="" />
            <div className={styles.heroOverlay}></div>
          </div>
        )}
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>🎬 Votre catalogue de films</p>
          <h1 className={styles.heroTitle}>
            {user ? `Bienvenue, ${user.username}` : 'Découvrez les'}
            <br />
            <span>{user ? 'Que regardez-vous ce soir ?' : 'meilleurs films'}</span>
          </h1>
          <p className={styles.heroSub}>
            Explorez des milliers de films, sauvegardez vos favoris,
            gérez votre watchlist et découvrez vos prochains coups de cœur.
          </p>
          <div className={styles.heroActions}>
            <Link to="/films" className={styles.btnPrimary}>
              Voir tous les films →
            </Link>
            {user ? (
              <Link to="/watchlist" className={styles.btnSecondary}>
                Ma Watchlist
              </Link>
            ) : (
              <Link to="/register" className={styles.btnSecondary}>
                Créer un compte
              </Link>
            )}
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>500K+</span>
              <span className={styles.statLabel}>Films</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>4K</span>
              <span className={styles.statLabel}>En HD</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>20+</span>
              <span className={styles.statLabel}>Genres</span>
            </div>
          </div>
        </div>
      </section>

      {/* TOP 3 */}
      {!loading && topFilms.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🏆 Top 3 — Les mieux notés</h2>
          <div className={styles.topGrid}>
            {topFilms.map((film, index) => (
              <Link to={`/films/${film.tmdb_id}`} key={film.id} className={styles.topCard}>
                <span className={styles.topRank}>#{index + 1}</span>
                <img src={film.affiche} alt={film.titre} className={styles.topImage} />
                <div className={styles.topInfo}>
                  <h3>{film.titre}</h3>
                  <p>{film.annee} · {film.genres?.[0]}</p>
                  <p className={styles.topNote}>⭐ {parseFloat(film.note).toFixed(1)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* TENDANCES */}
      {!loading && tendances.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🔥 Tendances cette semaine</h2>
          <div className={styles.tendancesGrid}>
            {tendances.map(film => (
              <Link
                to={`/films/${film.id}`}
                key={film.id}
                className={styles.tendanceCard}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
                  alt={film.title}
                  className={styles.tendanceImage}
                />
                <div className={styles.tendanceInfo}>
                  <p className={styles.tendanceTitre}>{film.title}</p>
                  <span>⭐ {film.vote_average?.toFixed(1)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className={styles.cta}>
        {user ? (
          <>
            <h2>Continuez votre exploration</h2>
            <p>Des milliers de films vous attendent.</p>
            <Link to="/films" className={styles.btnPrimary}>
              Parcourir le catalogue
            </Link>
          </>
        ) : (
          <>
            <h2>Rejoignez CinéApp</h2>
            <p>Créez un compte pour sauvegarder vos favoris et gérer votre watchlist.</p>
            <Link to="/register" className={styles.btnPrimary}>
              Créer un compte gratuit
            </Link>
          </>
        )}
      </section>

    </main>
  )
}

export default Home