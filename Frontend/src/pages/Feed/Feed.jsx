import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import styles from './Feed.module.css'

function Feed() {
  const [activities, setActivities] = useState([])
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getFeed()
      .then(data => setActivities(data))
      .catch(err => console.error('Erreur feed:', err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (search.trim() === '') {
      setUsers([])
      return
    }
    const timeout = setTimeout(() => {
      api.searchUsers(search)
        .then(data => setUsers(data))
        .catch(err => console.error('Erreur search users:', err))
    }, 400)
    return () => clearTimeout(timeout)
  }, [search])

  function renderActivity(act) {
    if (act.type === 'favori') {
      return (
        <>
          <strong>{act.username}</strong> a ajouté <strong>{act.titre}</strong> à ses favoris
        </>
      )
    }
    if (act.type === 'follow') {
      return <><strong>{act.username}</strong> a suivi quelqu'un</>
    }
    return <><strong>{act.username}</strong> a fait une action</>
  }

  return (
    <div className="page-wrapper">
      <div className={styles.header}>
        <h1 className={styles.title}>Fil d'activité</h1>
        <p className={styles.subtitle}>Ce que vos amis regardent</p>
      </div>

      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        {users.length > 0 && (
          <div className={styles.searchResults}>
            {users.map(u => (
              <Link to={`/users/${u.id}`} key={u.id} className={styles.searchResult}>
                <div className={styles.avatarSmall}>
                  {u.username.slice(0, 2).toUpperCase()}
                </div>
                <span>{u.username}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <p className={styles.empty}>Chargement...</p>
      ) : activities.length === 0 ? (
        <div className={styles.empty}>
          <p>Aucune activité pour le moment.</p>
          <p>Suivez des utilisateurs pour voir leurs activités ici.</p>
        </div>
      ) : (
        <div className={styles.feed}>
          {activities.map(act => (
            <div key={act.id} className={styles.activityCard}>
              {act.affiche && (
                <img src={act.affiche} alt={act.titre} className={styles.activityImage} />
              )}
              <div className={styles.activityContent}>
                <div className={styles.avatarSmall}>
                  {act.username.slice(0, 2).toUpperCase()}
                </div>
                <p>{renderActivity(act)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Feed