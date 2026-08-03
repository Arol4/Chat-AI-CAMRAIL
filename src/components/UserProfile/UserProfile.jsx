import { useState } from 'react'
import profilePic from '../../assets/photo-profil.jpeg'
import './UserProfile.css'

export default function UserProfile({ collapsed }) {
  const [imgError, setImgError] = useState(false)

  const initials = 'DK'

  return (
    <div className={`user-profile ${collapsed ? 'compact' : ''}`}>
      <div className="avatar-circle">
        {!imgError ? (
          <img
            src={profilePic}
            alt="Profil"
            onError={() => setImgError(true)}
            className="avatar-img"
          />
        ) : (
          <span className="avatar-initials">{initials}</span>
        )}
      </div>
      {!collapsed && <span className="username">Djeufack Kafack</span>}
    </div>
  )
}