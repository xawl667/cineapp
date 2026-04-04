import { useState, useEffect } from 'react'
import films from '../../data/films'
import FilmCard from '../../components/FilmCard/FilmCard'
import SearchBar from '../../components/SearchBar/SearchBar'
import Badge from '../../components/Badge/Badge'
import styles from './Films.module.css'


const tousLesGenres = ['Tous', ...new Set(films.map((f) => f.genre))]

function Films({ toggleFavori, isFavori }) {
  const [recherche, setRecherche] = useState('')
  const [genreActif, setGenreActif] = useState('Tous')
  const [filmsFiltres, setFilmsFiltres] = useState(films)


  useEffect(() => {
    let resultat = films

    if (genreActif !== 'Tous') {
      resultat = resultat.filter((f) => f.genre === genreActif)
    }

    if (recherche.trim() !== '') {
      const query = recherche.toLowerCase()
      resultat = resultat.filter(
        (f) =>
          f.titre.toLowerCase().includes(query) ||
          f.realisateur.toLowerCase().includes(query)
      )
    }

    setFilmsFiltres(resultat)
  }, [recherche, genreActif])

  return (
    <div className="page-wrapper">
      <div className={styles.header}>
        <h1 className={styles.title}>Catalogue de films</h1>
        <p className={styles.subtitle}>{filmsFiltres.length} film(s) trouvé(s)</p>
      </div>

      {/* Barre de recherche + filtres */}
      <div className={styles.controls}>
        <SearchBar value={recherche} onChange={setRecherche} />
        <div className={styles.genres}>
          {tousLesGenres.map((genre) => (
            <Badge
              key={genre}
              label={genre}
              active={genreActif === genre}
              onClick={() => setGenreActif(genre)}
            />
          ))}
        </div>
      </div>

      {/* Grille de films */}
      {filmsFiltres.length > 0 ? (
        <div className={styles.grid}>
          {filmsFiltres.map((film) => (
            <FilmCard
              key={film.id}
              film={film}
              toggleFavori={toggleFavori}
              isFavori={isFavori}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>😕 Aucun film ne correspond à votre recherche.</p>
          <button
            onClick={() => {
              setRecherche('')
              setGenreActif('Tous')
            }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  )
}

export default Films
