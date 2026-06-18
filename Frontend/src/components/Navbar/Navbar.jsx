import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import styles from './Navbar.module.css'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'

function Navbar({ nbFavoris }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!user || searchQuery.trim() === '') {
      setResults([])
      return
    }
    const timeout = setTimeout(() => {
      api.searchUsers(searchQuery)
        .then(data => {
          setResults(data)
          setShowResults(true)
        })
        .catch(err => console.error('Erreur recherche users:', err))
    }, 400)
    return () => clearTimeout(timeout)
  }, [searchQuery, user])

  function handleSelectUser(userId) {
    setSearchQuery('')
    setShowResults(false)
    navigate(`/users/${userId}`)
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <NavLink to="/" className={styles.logo}>
          CINÉ<span>APP</span>
        </NavLink>

        <ul className={styles.links}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
              end
            >
              Accueil
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/films"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              Films
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/mood"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              Mood
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/watchlist"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              Watchlist
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/favoris"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              Favoris
              {nbFavoris > 0 && (
                <span className={styles.badge}>{nbFavoris}</span>
              )}
            </NavLink>
          </li>
          {user && (
            <li>
              <NavLink
                to="/feed"
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
              >
                Feed
              </NavLink>
            </li>
          )}
        </ul>

        {user && (
          <div className={styles.searchWrapper} ref={searchRef}>
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => results.length > 0 && setShowResults(true)}
            />
            {showResults && results.length > 0 && (
              <div className={styles.searchResults}>
                {results.map(u => (
                  <button
                    key={u.id}
                    className={styles.searchResultItem}
                    onClick={() => handleSelectUser(u.id)}
                  >
                    👤 {u.username}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className={styles.authSection}>
          {user ? (
            <>
              <NavLink to="/profile" className={styles.username}>
                👤 {user.username}
              </NavLink>
              <button onClick={logout} className={styles.logoutBtn}>
                Déconnexion
              </button>
            </>
          ) : (
            <NavLink to="/login" className={styles.link}>
              Connexion
            </NavLink>
          )}
        </div>

      </nav>
    </header>
  )
}

export default Navbar