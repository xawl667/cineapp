import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { api } from "../services/api"

export function useWatched() {
  const { user } = useAuth()
  const [watched, setWatched] = useState([])

  useEffect(() => {
    if (!user) {
      setWatched([])
      return
    }
    api.getWatched()
      .then(data => setWatched(data))
      .catch(err => console.error('Erreur getWatched:', err))
  }, [user])

  async function markAsWatched(film, rating = null, review = null) {
    if (!user) return
    await api.addWatched(film.id, rating, review)
    const updated = await api.getWatched()
    setWatched(updated)
  }

  async function unmarkWatched(filmId) {
    if (!user) return
    await api.removeWatched(filmId)
    setWatched(prev => prev.filter(f => f.id !== filmId))
  }

  function isWatched(tmdbId) {
    return watched.some(f => f.tmdb_id === tmdbId)
  }

  function getRating(tmdbId) {
    const item = watched.find(f => f.tmdb_id === tmdbId)
    return item?.rating || null
  }

  return { watched, markAsWatched, unmarkWatched, isWatched, getRating }
}