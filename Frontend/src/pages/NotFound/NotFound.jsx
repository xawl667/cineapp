import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import styles from './NotFound.module.css'

function NotFound() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={`${styles.page} ${visible ? styles.visible : ''}`}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Page introuvable</h1>
      <p className={styles.text}>
        Oops ! Cette page n'existe pas ou a été supprimée.
      </p>
      <Link to="/" className={styles.btn}>
        ← Retour à l'accueil
      </Link>
    </div>
  )
}

export default NotFound
