import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import styles from "./Login.module.css"

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState(null)

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      login(formData.email, formData.password)
      navigate("/")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>CINÉ<span>APP</span></div>
        <p className={styles.subtitle}>Content de te revoir 👋</p>

        {error && <p className={styles.error}>{error}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
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
          <button className={styles.btn} type="submit">Se connecter</button>
        </form>

        <div className={styles.footer}>
          Pas encore de compte ? <Link to="/register">S'inscrire</Link>
        </div>
      </div>
    </div>
  )
}

export default Login