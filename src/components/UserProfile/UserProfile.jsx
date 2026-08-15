import { useState } from 'react'
import './UserProfile.css'

export default function UserProfile({ collapsed }) {
  const [imgError, setImgError] = useState(false)

  const initials = 'DK'

  return (
    <div className={`user-profile ${collapsed ? 'compact' : ''}`}>
      <div className="avatar-circle">
        <span className="avatar-initials">{initials}</span>
      </div>
      {!collapsed && <span className="username">Djeufack Kafack</span>}
    </div>
  )
}