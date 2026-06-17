import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import styles from './UserProfile.module.css'

function UserProfile() {
  const { id } = useParams()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [id])

  function loadProfile() {
    setLoading(true)
    Promise.all([
      api.getPublicProfile(id),
      currentUser ? api.getFollowing(currentUser.id) : Promise.resolve([])
    ])
      .then(([profileData, following]) => {
        setProfile(profileData)
        setIsFollowing(following.some(f => f.id === id))
      })
      .catch(err => console.error('Erreur profil:', err))
      .finally(() => setLoading(false))
  }

  async function handleFollow() {
    if (isFollowing) {
      await api.unfollowUser(id)
    } else {
      await api.followUser(id)
    }
    setIsFollowing(!isFollowing)
    loadProfile()
  }

  if (loading) return <div className="page-wrapper"><p>Chargement...</p></div>
  if (!profile) return <div className="page-wrapper"><p>Utilisateur introuvable.</p></div>

  const initiales = profile.user.username.slice(0, 2).toUpperCase()
  const isOwnProfile = currentUser?.id === id

  return (
    <div className="page-wrapper">
      <div className={styles.profileCard}>
        <div className={styles.avatar}>{initiales}</div>
        <h1 className={styles.username}>{profile.user.username}</h1>

        <div className={styles.followStats}>
          <span><strong>{profile.followersCount}</strong> Abonnés</span>
          <span><strong>{profile.followingCount}</strong> Abonnements</span>
        </div>

        {!isOwnProfile && currentUser && (
          <button
            className={`${styles.followBtn} ${isFollowing ? styles.following : ''}`}
            onClick={handleFollow}
          >
            {isFollowing ? '✓ Suivi' : '+ Suivre'}
          </button>
        )}
      </div>

      <h2 className={styles.sectionTitle}>Favoris</h2>
      {profile.favoris.length === 0 ? (
        <p className={styles.empty}>Aucun favori pour le moment.</p>
      ) : (
        <div className={styles.grid}>
          {profile.favoris.map(film => (
            <Link to={`/films/${film.tmdb_id}`} key={film.id} className={styles.filmCard}>
              <img src={film.affiche} alt={film.titre} />
              <p>{film.titre}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserProfile