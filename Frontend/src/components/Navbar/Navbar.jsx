import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'
import { useAuth } from '../../context/AuthContext'

function Navbar({ nbFavoris }) {
  const { user, logout } = useAuth()

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
        </ul>

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