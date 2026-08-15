import { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import './Login.css'

export default function Login() {
  const { dispatch } = useAppContext()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username.trim() || !password) {
      setError('Veuillez saisir le nom d\'utilisateur et le mot de passe.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({
        client_id: 'react-client',
        username: username.trim(),
        password,
        grant_type: 'password'
      })

      const response = await fetch('http://localhost:8080/realms/camrail-rda/protocol/openid-connect/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.access_token) {
        throw new Error(data.error_description || data.error || 'Identifiants invalides.')
      }

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          username: username.trim(),
          accessToken: data.access_token
        }
      })
    } catch (err) {
      setError(err.message || 'Connexion impossible. Vérifiez votre serveur Keycloak.')
      dispatch({ type: 'LOGIN_FAILURE', payload: err.message || 'Connexion impossible.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Connexion</h1>

        <label className="login-field">
          <span>Nom d'utilisateur</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Entrez votre nom d'utilisateur"
            autoComplete="username"
          />
        </label>

        <label className="login-field">
          <span>Mot de passe</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez votre mot de passe"
            autoComplete="current-password"
          />
        </label>

        {error && <p className="login-error">{error}</p>}

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}
