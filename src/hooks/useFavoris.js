import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"

export function useFavoris() {
  const { user } = useAuth()
  const storageKey = user ? `favoris_${user.id}` : null

  const [favoris, setFavoris] = useState(() => {
    if (!storageKey) return []
    return JSON.parse(localStorage.getItem(storageKey) || "[]")
  })

  useEffect(() => {
    if (!storageKey) {
      setFavoris([])
      return
    }
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]")
    setFavoris(saved)
  }, [storageKey])

  useEffect(() => {
    if (!storageKey) return
    localStorage.setItem(storageKey, JSON.stringify(favoris))
  }, [favoris, storageKey])

  function toggleFavori(film) {
    setFavoris(prev =>
      prev.find(f => f.id === film.id)
        ? prev.filter(f => f.id !== film.id)
        : [...prev, film]
    )
  }

  function isFavori(id) {
    return favoris.some(f => f.id === id)
  }

  return { favoris, toggleFavori, isFavori }
} 