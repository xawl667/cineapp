import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"

export function useWatchlist() {
  const { user } = useAuth()
  const storageKey = user ? `watchlist_${user.id}` : null

  const [watchlist, setWatchlist] = useState(() => {
    if (!storageKey) return []
    return JSON.parse(localStorage.getItem(storageKey) || "[]")
  })

  useEffect(() => {
    if (!storageKey) {
      setWatchlist([])
      return
    }
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]")
    setWatchlist(saved)
  }, [storageKey])

  useEffect(() => {
    if (!storageKey) return
    localStorage.setItem(storageKey, JSON.stringify(watchlist))
  }, [watchlist, storageKey])

  function toggleWatchlist(film) {
    setWatchlist(prev =>
      prev.find(f => f.id === film.id)
        ? prev.filter(f => f.id !== film.id)
        : [...prev, film]
    )
  }

  function isInWatchlist(id) {
    return watchlist.some(f => f.id === id)
  }

  return { watchlist, toggleWatchlist, isInWatchlist }
}