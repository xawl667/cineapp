import { useState } from 'react'
import { api } from '../../services/api'
import FilmCard from '../../components/FilmCard/FilmCard'
import styles from './Mood.module.css'

const moods = [
  { id: 'chill', label: 'Chill', emoji: '😌' },
  { id: 'dark', label: 'Dark', emoji: '🖤' },
  { id: 'sad', label: 'Triste', emoji: '😢' },
  { id: 'motivated', label: 'Motivé', emoji: '🔥' },
  { id: 'romantic', label: 'Romantique', emoji: '💕' },
  { id: 'scared', label: 'Envie de frissons', emoji: '👻' },
]

function Mood({ toggleFavori, isFavori, toggleWatchlist, isInWatchlist }) {
  const [selected, setSelected] = useState(null)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  function handleSelect(moodId) {
    setSelected(moodId)
    setLoading(true)
    api.getMoodRecommendations(moodId)
      .then(data => setResults(data))
      .catch(err => console.error('Erreur mood:', err))
      .finally(() => setLoading(false))
  }

  return (
    <div className="page-wrapper">
      <div className={styles.header}>
        <h1 className={styles.title}>Quelle est votre humeur ?</h1>
        <p className={styles.subtitle}>On vous trouve les films parfaits</p>
      </div>

      <div className={styles.moodGrid}>
        {moods.map(mood => (
          <button
            key={mood.id}
            className={`${styles.moodCard} ${selected === mood.id ? styles.moodActive : ''}`}
            onClick={() => handleSelect(mood.id)}
          >
            <span className={styles.moodEmoji}>{mood.emoji}</span>
            <span className={styles.moodLabel}>{mood.label}</span>
          </button>
        ))}
      </div>

      {loading && <p className={styles.loading}>Recherche en cours...</p>}

      {!loading && results.length > 0 && (
        <div className={styles.results}>
          <h2 className={styles.resultsTitle}>Sélection pour vous</h2>
          <div className={styles.grid}>
            {results.map(film => (
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
        </div>
      )}
    </div>
  )
}

export default Mood