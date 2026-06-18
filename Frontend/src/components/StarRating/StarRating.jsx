import { useState } from 'react'
import styles from './StarRating.module.css'

function StarRating({ rating, onRate, readonly = false }) {
  const [hover, setHover] = useState(0)

  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          className={styles.starBtn}
          disabled={readonly}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => !readonly && onRate(star)}
        >
          {star <= (hover || rating) ? '★' : '☆'}
        </button>
      ))}
    </div>
  )
}

export default StarRating