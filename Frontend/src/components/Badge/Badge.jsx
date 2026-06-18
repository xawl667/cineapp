import styles from './Badge.module.css'

function Badge({ label, active, onClick }) {
  return (
    <button
      className={`${styles.badge} ${active ? styles.active : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export default Badge
