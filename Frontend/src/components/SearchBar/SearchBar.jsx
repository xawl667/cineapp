import styles from './SearchBar.module.css'

function SearchBar({ value, onChange, placeholder = 'Rechercher un film...' }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
      />
      {value && (
        <button className={styles.clear} onClick={() => onChange('')} aria-label="Effacer">
          ✕
        </button>
      )}
    </div>
  )
}

export default SearchBar
