import { useAppContext } from '../../context/AppContext'
import './UserProfile.css'

export default function UserProfile({ collapsed }) {
  const { state } = useAppContext()
  const username = state.username?.trim() || 'Utilisateur'
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