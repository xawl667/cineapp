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
  const [showFollowList, setShowFollowList] = useState(null)
  const [followList, setFollowList] = useState([])

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

  function openFollowList(type) {
    setShowFollowList(type)
    const fetcher = type === 'followers' ? api.getFollowers : api.getFollowing
    fetcher(id).then(data => setFollowList(data))
  }

  if (loading) return <div className="page-wrapper"><p>Chargement...</p></div>
  if (!profile) return <div className="page-wrapper"><p>Utilisateur introuvable.</p></div>

  const initiales = profile.user.username.slice(0, 2).toUpperCase()
  const isOwnProfile = currentUser?.id === id

  return (
    <div className="page-wrapper">
      <div className={styles.profileCard}>
        <div className={styles.avatar}>
          {profile.user.avatar ? (
            <img src={profile.user.avatar} alt={profile.user.username} />
          ) : initiales}
        </div>
        <h1 className={styles.username}>{profile.user.username}</h1>

        {profile.user.bio && <p className={styles.bio}>{profile.user.bio}</p>}

        <div className={styles.followStats}>
          <button onClick={() => openFollowList('followers')} className={styles.followStatBtn}>
            <strong>{profile.followersCount}</strong> Abonnés
          </button>
          <button onClick={() => openFollowList('following')} className={styles.followStatBtn}>
            <strong>{profile.followingCount}</strong> Abonnements
          </button>
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

      {showFollowList && (
        <div className={styles.followListOverlay} onClick={() => setShowFollowList(null)}>
          <div className={styles.followListModal} onClick={e => e.stopPropagation()}>
            <h3>{showFollowList === 'followers' ? 'Abonnés' : 'Abonnements'}</h3>
            {followList.length === 0 ? (
              <p className={styles.empty}>Aucun utilisateur.</p>
            ) : (
              followList.map(u => (
                <Link
                  to={`/users/${u.id}`}
                  key={u.id}
                  className={styles.followListItem}
                  onClick={() => setShowFollowList(null)}
                >
                  <div className={styles.avatarSmall}>{u.username.slice(0, 2).toUpperCase()}</div>
                  <span>{u.username}</span>
                </Link>
              ))
            )}
            <button className={styles.closeBtn} onClick={() => setShowFollowList(null)}>Fermer</button>
          </div>
        </div>
      )}

      <div className={styles.statsGrid}>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{profile.stats.favoris}</span>
          <span className={styles.statLabel}>Favoris</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{profile.stats.watchlist}</span>
          <span className={styles.statLabel}>Watchlist</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{profile.stats.watched}</span>
          <span className={styles.statLabel}>Films vus</span>
        </div>
      </div>

      {profile.stats.genresPreferes.length > 0 && (
        <div className={styles.genresSection}>
          <h2 className={styles.sectionTitle}>Genres préférés</h2>
          <div className={styles.genreTags}>
            {profile.stats.genresPreferes.map(g => (
              <span key={g.genre} className={styles.genreTag}>
                {g.genre} ({g.count})
              </span>
            ))}
          </div>
        </div>
      )}

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