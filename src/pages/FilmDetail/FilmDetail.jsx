import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import films from '../../data/films'
import styles from './FilmDetail.module.css'

function FilmDetail({ toggleFavori, isFavori }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [film, setFilm] = useState(null)

 
  useEffect(() => {
    const trouve = films.find((f) => f.id === parseInt(id))
    if (!trouve) {
      navigate('/404')
    } else {
      setFilm(trouve)
      window.scrollTo(0, 0)
    }
  }, [id, navigate])

  if (!film) return null

  const favori = isFavori(film.id)

 
  const similaires = films
    .filter((f) => f.genre === film.genre && f.id !== film.id)
    .slice(0, 3)

  return (
    <div className={styles.page}>
      {/* BACKDROP */}
      <div
        className={styles.backdrop}
        style={{ backgroundImage: `url(${film.image})` }}
      >
        <div className={styles.backdropOverlay} />
      </div>

      <div className="page-wrapper" style={{ position: 'relative', zIndex: 2 }}>
        {/* Retour */}
        <Link to="/films" className={styles.backLink}>
          ← Retour aux films
        </Link>

        {/* Contenu principal */}
        <div className={styles.content}>
          <img src={film.image} alt={film.titre} className={styles.poster} />

          <div className={styles.info}>
            <div className={styles.genres}>
              {film.genres.map((g) => (
                <span key={g} className={styles.genreBadge}>
                  {g}
                </span>
              ))}
            </div>

            <h1 className={styles.titre}>{film.titre}</h1>

            <div className={styles.meta}>
              <span>📅 {film.annee}</span>
              <span>⏱ {film.duree}</span>
              <span>⭐ {film.note} / 10</span>
            </div>

            <p className={styles.realisateur}>
              Réalisé par <strong>{film.realisateur}</strong>
            </p>

            <p className={styles.description}>{film.description}</p>

            <button
              className={`${styles.favBtn} ${favori ? styles.favActive : ''}`}
              onClick={() => toggleFavori(film)}
            >
              {favori ? '♥ Retirer des favoris' : '♡ Ajouter aux favoris'}
            </button>
          </div>
        </div>

        {/* Films similaires */}
        {similaires.length > 0 && (
          <section className={styles.similaires}>
            <h2 className={styles.similairesTitle}>Films similaires</h2>
            <div className={styles.similairesGrid}>
              {similaires.map((s) => (
                <Link to={`/films/${s.id}`} key={s.id} className={styles.similaireCard}>
                  <img src={s.image} alt={s.titre} />
                  <p>{s.titre}</p>
                  <span>⭐ {s.note}</span>
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
