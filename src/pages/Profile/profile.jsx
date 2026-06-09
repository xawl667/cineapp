import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import styles from "./Profile.module.css"
import { useFavoris } from "../../hooks/useFavoris"

function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { favoris } = useFavoris()

  function handleLogout() {
    logout()
    navigate("/login")
  }

  const initiales = user.username.slice(0, 2).toUpperCase()

  return (
    <div className="page-wrapper">
      <div className={styles.profileCard}>

        <div className={styles.avatar}>{initiales}</div>
        <h1 className={styles.username}>{user.username}</h1>
        <p className={styles.email}>{user.email}</p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{favoris.length}</span>
            <span className={styles.statLabel}>Favoris</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>0</span>
            <span className={styles.statLabel}>Films vus</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>0</span>
            <span className={styles.statLabel}>Watchlist</span>
          </div>
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          Se déconnecter
        </button>

      </div>
    </div>
  )
}

export default Profile