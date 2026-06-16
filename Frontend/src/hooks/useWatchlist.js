import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { api } from "../services/api"

export function useWatchlist() {
  const { user } = useAuth()
  const [watchlist, setWatchlist] = useState([])

  useEffect(() => {
    if (!user) {
      setWatchlist([])
      return
    }
    api.getWatchlist()
      .then(data => setWatchlist(data))
      .catch(err => console.error('Erreur getWatchlist:', err))
  }, [user])

  async function toggleWatchlist(film) {
    if (!user) return

    const dejaDedans = watchlist.some(f => f.tmdb_id === film.tmdb_id || f.id === film.id)

    if (dejaDedans) {
      const item = watchlist.find(f => f.tmdb_id === film.tmdb_id || f.id === film.id)
      await api.removeFromWatchlist(item.id)
      setWatchlist(prev => prev.filter(f => f.id !== item.id))
    } else {
      await api.addToWatchlist(film.id)
      const updated = await api.getWatchlist()
      setWatchlist(updated)
    }
  }

  function isInWatchlist(id) {
    return watchlist.some(f => f.tmdb_id === id || f.id === id)
  }

  return { watchlist, toggleWatchlist, isInWatchlist }
}