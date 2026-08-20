import { useAppContext } from '../../context/AppContext'
import './UserProfile.css'
import keycloak from "../../services/keycloak";

export default function UserProfile({ collapsed }) {
  const user = keycloak.tokenParsed;
  console.log(user);
  const username = user?.preferred_username || 'Utilisateur';
  const initials = username
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('') || 'U'

  return (
    <div className={`user-profile ${collapsed ? 'compact' : ''}`}>
      <div className="avatar-circle">
        <span className="avatar-initials">{initials}</span>
      </div>
      {!collapsed && <span className="username">{username}</span>}
    </div>
  )
}