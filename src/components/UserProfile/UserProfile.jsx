import { FiLogOut } from 'react-icons/fi'
import './UserProfile.css'
import keycloak from '../../services/keycloak'

export default function UserProfile({ collapsed }) {
  const user = keycloak.tokenParsed
  const username = user?.preferred_username || 'Utilisateur'
  const initials = username
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('') || 'U'

  const handleLogout = () => {
    keycloak.logout({ redirectUri: window.location.origin })
  }

  return (
    <div className={`user-profile ${collapsed ? 'compact' : ''}`}>
      <div className="user-identity">
        <div className="avatar-circle">
          <span className="avatar-initials">{initials}</span>
        </div>
        {!collapsed && <span className="username">{username}</span>}
      </div>
      <button className="logout-btn" onClick={handleLogout} title="Se déconnecter" aria-label="Se déconnecter">
        <FiLogOut size={18} />
        {!collapsed && <span>Se déconnecter</span>}
      </button>
    </div>
  )
}