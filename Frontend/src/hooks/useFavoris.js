import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { api } from "../services/api"

export function useFavoris() {
  const { user } = useAuth()
  const [favoris, setFavoris] = useState([])

  // Charge les favoris depuis l'API quand l'user change
  useEffect(() => {
    if (!user) {
      setFavoris([])
      return
    }
    api.getFavoris()
      .then(data => setFavoris(data))
      .catch(err => console.error('Erreur getFavoris:', err))
  }, [user])

  async function toggleFavori(film) {
    if (!user) return

    const dejaDedans = favoris.some(f => f.tmdb_id === film.tmdb_id || f.id === film.id)

    if (dejaDedans) {
      const favori = favoris.find(f => f.tmdb_id === film.tmdb_id || f.id === film.id)
      await api.removeFavori(favori.id)
      setFavoris(prev => prev.filter(f => f.id !== favori.id))
    } else {
      await api.addFavori(film.id)
      const updated = await api.getFavoris()
      setFavoris(updated)
    }
  }

  function isFavori(id) {
    return favoris.some(f => f.tmdb_id === id || f.id === id)
  }

  return { favoris, toggleFavori, isFavori }
}