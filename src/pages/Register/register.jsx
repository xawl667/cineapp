import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import styles from "./Register.module.css"

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  })
  const [error, setError] = useState(null)

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      register(formData.username, formData.email, formData.password)
      navigate("/")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>CINÉ<span>APP</span></div>
        <p className={styles.subtitle}>Crée ton compte gratuitement 🎬</p>

        {error && <p className={styles.error}>{error}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Pseudo</label>
            <input
              name="username"
              type="text"
              placeholder="TonPseudo"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="ton@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label>Mot de passe</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button className={styles.btn} type="submit">Créer mon compte</button>
        </form>

        <div className={styles.footer}>
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </div>
      </div>
    </div>
  )
}

export default Register