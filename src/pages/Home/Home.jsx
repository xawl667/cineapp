import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import films from '../../data/films'
import styles from './Home.module.css'

function Home() {
  const [visible, setVisible] = useState(false)


  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

 
  const topFilms = [...films].sort((a, b) => b.note - a.note).slice(0, 3)

  return (
    <main className={`${styles.main} ${visible ? styles.visible : ''}`}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>🎬 Votre catalogue de films</p>
          <h1 className={styles.heroTitle}>
            Découvrez les
            <br />
            <span>meilleurs films</span>
          </h1>
          <p className={styles.heroSub}>
            Explorez notre sélection de films cultes, sauvegardez vos favoris et retrouvez
            toutes les informations dont vous avez besoin.
          </p>
          <div className={styles.heroActions}>
            <Link to="/films" className={styles.btnPrimary}>
              Voir tous les films →
            </Link>
            <Link to="/favoris" className={styles.btnSecondary}>
              Mes favoris
            </Link>
          </div>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{films.length}</span>
            <span className={styles.statLabel}>Films</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>8.7</span>
            <span className={styles.statLabel}>Note moy.</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>6</span>
            <span className={styles.statLabel}>Genres</span>
          </div>
        </div>
      </section>

      {/* TOP 3 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Top 3 — Les mieux notés</h2>
        <div className={styles.topGrid}>
          {topFilms.map((film, index) => (
            <Link to={`/films/${film.id}`} key={film.id} className={styles.topCard}>
              <span className={styles.topRank}>#{index + 1}</span>
              <img src={film.image} alt={film.titre} className={styles.topImage} />
              <div className={styles.topInfo}>
                <h3>{film.titre}</h3>
                <p>{film.annee} · {film.genre}</p>
                <p className={styles.topNote}>⭐ {film.note}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Prêt à explorer ?</h2>
        <p>Plus de {films.length} films vous attendent dans le catalogue.</p>
        <Link to="/films" className={styles.btnPrimary}>
          Parcourir le catalogue
        </Link>
      </section>
    </main>
  )
}

export default Home
