import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import styles from "./profile.module.css"
import { useFavoris } from "../../hooks/useFavoris"
import { useWatchlist } from "../../hooks/useWatchlist"
import { useWatched } from "../../hooks/useWatched"
import { api } from "../../services/api"

function Profile() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const { favoris } = useFavoris()
  const { watchlist } = useWatchlist()
  const { watched } = useWatched()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    bio: user?.bio || "",
    avatar: user?.avatar || ""
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  if (!user) return <p className={styles.loading}>Chargement du profil...</p>

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      await api.updateProfile(formData.bio, formData.avatar)

      if (updateUser) {
        updateUser({ ...user, ...formData })
      } else {
        const updatedUser = { ...user, ...formData }
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      }

      setIsEditing(false)
    } catch (err) {
      console.error('Erreur update profil:', err)
      setError("Impossible de mettre à jour le profil. Réessayez.")
    } finally {
      setSaving(false)
    }
  }

  const initiales = user.username ? user.username.slice(0, 2).toUpperCase() : "??"

  return (
    <div className={styles.profileContainer}>

      {/* --- EN-TÊTE DU PROFIL --- */}
      <section className={styles.profileHeader}>
        <div className={styles.avatarWrapper}>
          {user.avatar ? (
            <img src={user.avatar} alt={`Avatar de ${user.username}`} className={styles.avatarImg} />
          ) : (
            <div className={styles.avatarInitials}>{initiales}</div>
          )}
        </div>

        <div className={styles.userInfo}>
          <h1 className={styles.username}>{user.username}</h1>

          {user.bio && !isEditing && <p className={styles.bio}>"{user.bio}"</p>}

          {!isEditing && (
            <div className={styles.headerActions}>
              <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
                Modifier le profil
              </button>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* --- FORMULAIRE D'ÉDITION --- */}
      {isEditing && (
        <form onSubmit={handleSave} className={styles.editForm}>
          <h3>Modifier mes informations</h3>
          {error && <p className={styles.errorMessage}>{error}</p>}

          <div className={styles.formField}>
            <label htmlFor="avatar">URL de l'avatar</label>
            <input
              id="avatar"
              name="avatar"
              type="url"
              placeholder="https://exemple.com/photo.jpg"
              value={formData.avatar}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.formField}>
            <div className={styles.labelRow}>
              <label htmlFor="bio">Biographie</label>
              <span className={styles.charCount}>{formData.bio.length}/150</span>
            </div>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              placeholder="Parlez de vous..."
              value={formData.bio}
              onChange={handleInputChange}
              maxLength={150}
            />
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => setIsEditing(false)} disabled={saving}>
              Annuler
            </button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      )}

      {/* --- STATISTIQUES --- */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{favoris.length}</span>
          <span className={styles.statLabel}>Favoris</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{watchlist.length}</span>
          <span className={styles.statLabel}>Watchlist</span>
        </div>
        <Link to="/watched" className={styles.statCard}>
          <span className={styles.statNumber}>{watched.length}</span>
          <span className={styles.statLabel}>Films vus</span>
        </Link>
      </section>

      {/* --- CONTENU (FAVORIS, WATCHLIST, WATCHED) --- */}
      <section className={styles.listsContainer}>
        <div className={styles.listSection}>
          <h2>Mes Favoris ({favoris.length})</h2>
          {favoris.length === 0 ? (
            <p className={styles.emptyMessage}>Aucun favori pour le moment.</p>
          ) : (
            <div className={styles.movieGrid}>
              {favoris.map(movie => {
                const posterUrl = movie.affiche || "https://placehold.co/300x450/1a1a2e/ffffff?text=Image+Indisponible"
                return (
                  <div key={movie.id} className={styles.movieCard}>
                    <img src={posterUrl} alt={movie.titre} />
                    <h4>{movie.titre}</h4>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className={styles.listSection}>
          <h2>Ma Watchlist ({watchlist.length})</h2>
          {watchlist.length === 0 ? (
            <p className={styles.emptyMessage}>Votre liste est vide.</p>
          ) : (
            <div className={styles.movieGrid}>
              {watchlist.map(movie => {
                const posterUrl = movie.affiche || "https://placehold.co/300x450/1a1a2e/ffffff?text=Image+Indisponible"
                return (
                  <div key={movie.id} className={styles.movieCard}>
                    <img src={posterUrl} alt={movie.titre} />
                    <h4>{movie.titre}</h4>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className={styles.listSection}>
          <h2>Films vus ({watched.length})</h2>
          {watched.length === 0 ? (
            <p className={styles.emptyMessage}>Aucun film marqué comme vu.</p>
          ) : (
            <div className={styles.movieGrid}>
              {watched.map(movie => {
                const posterUrl = movie.affiche || "https://placehold.co/300x450/1a1a2e/ffffff?text=Image+Indisponible"
                return (
                  <div key={movie.id} className={styles.movieCard}>
                    <img src={posterUrl} alt={movie.titre} />
                    <h4>{movie.titre}</h4>
                    {movie.rating && <span className={styles.miniRating}>⭐ {movie.rating}/5</span>}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

    </div>
  )
}

export default Profile