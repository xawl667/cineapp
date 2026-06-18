import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import FilmCard from '../../components/FilmCard/FilmCard'
import SearchBar from '../../components/SearchBar/SearchBar'
import Badge from '../../components/Badge/Badge'
import styles from './Films.module.css'

function Films({ toggleFavori, isFavori, toggleWatchlist, isInWatchlist }) {
  const [films, setFilms] = useState([])
  const [filmsFiltres, setFilmsFiltres] = useState([])
  const [genres, setGenres] = useState(['Tous'])
  const [recherche, setRecherche] = useState('')
  const [genreActif, setGenreActif] = useState('Tous')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Chargement films depuis l'API avec pagination
  useEffect(() => {
    setLoading(true)
    api.getFilms(page)
      .then(data => {
        setFilms(data.films)
        setFilmsFiltres(data.films)
        setTotalPages(data.total_pages)
        const tousLesGenres = ['Tous', ...new Set(data.films.flatMap(f => f.genres || []))]
        setGenres(tousLesGenres)
      })
      .catch(err => console.error('Erreur getFilms:', err))
      .finally(() => setLoading(false))
  }, [page])

  // Filtres genre local
  useEffect(() => {
    if (recherche.trim() !== '') return
    let resultat = films
    if (genreActif !== 'Tous') {
      resultat = resultat.filter(f => f.genres?.includes(genreActif))
    }
    setFilmsFiltres(resultat)
  }, [genreActif, films])

  // Recherche via API avec debounce
  useEffect(() => {
    if (recherche.trim() === '') {
      setFilmsFiltres(films)
      return
    }
    const timeout = setTimeout(() => {
      api.searchFilms(recherche)
        .then(data => setFilmsFiltres(data))
        .catch(err => console.error('Erreur search:', err))
    }, 500)
    return () => clearTimeout(timeout)
  }, [recherche])

  if (loading) return <div className="page-wrapper"><p>Chargement...</p></div>

  return (
    <div className="page-wrapper">
      <div className={styles.header}>
        <h1 className={styles.title}>Catalogue de films</h1>
        <p className={styles.subtitle}>{filmsFiltres.length} film(s) trouvé(s)</p>
      </div>

      <div className={styles.controls}>
        <SearchBar value={recherche} onChange={setRecherche} />
        <div className={styles.genres}>
          {genres.map(genre => (
            <Badge
              key={genre}
              label={genre}
              active={genreActif === genre}
              onClick={() => setGenreActif(genre)}
            />
          ))}
        </div>
      </div>

      {filmsFiltres.length > 0 ? (
        <div className={styles.grid}>
          {filmsFiltres.map(film => (
            <FilmCard
              key={film.id}
              film={film}
              toggleFavori={toggleFavori}
              isFavori={isFavori}
              toggleWatchlist={toggleWatchlist}
              isInWatchlist={isInWatchlist}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>😕 Aucun film ne correspond à votre recherche.</p>
          <button onClick={() => { setRecherche(''); setGenreActif('Tous') }}>
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {recherche.trim() === '' && (
        <div className={styles.pagination}>
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
          >
            ← Précédent
          </button>
          <span>Page {page} / {totalPages}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === totalPages}
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  )
}

export default Films