import { useAppContext } from '../../context/AppContext'
import { FiTrash2, FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi'
import UserProfile from '../UserProfile/UserProfile'
import logo from '../../assets/logo-camrail.png'
import './Sidebar.css'

export default function Sidebar() {
  const { state, dispatch } = useAppContext()
  const { conversations, activeConversationId, sidebarExpanded } = state

  const handleNewChat = () => dispatch({ type: 'CREATE_NEW_CHAT' })
  const handleDelete = (e, id) => {
    e.stopPropagation()
    dispatch({ type: 'DELETE_CONVERSATION', payload: id })
  }

  return (
    <aside className={`sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-top-controls">
        {sidebarExpanded ? (
          <>
            <img src={logo} alt="Logo" className="sidebar-logo" onError={(e) => { e.target.style.display = 'none' }} />
            <button className="toggle-btn" onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })} title="Réduire la barre">
              <FiChevronLeft size={20} />
            </button>
          </>
        ) : (
          <button className="toggle-btn solo" onClick={() => dispatch({ type: 'SET_SIDEBAR_EXPANDED', payload: true })} title="Étendre la barre">
            <FiChevronRight size={20} />
          </button>
        )}
      </div>

      <button className="new-chat-btn" onClick={handleNewChat}>
        <FiPlus size={18} />
        {sidebarExpanded && <span>Nouveau chat</span>}
      </button>

      {sidebarExpanded && (
        <div className="recent-section">
          <h3 className="recent-title">Récents</h3>
          <div className="conversation-list">
            {conversations.map(conv => (
              <div
                key={conv.id}
                className={`conversation-item ${conv.id === activeConversationId ? 'active' : ''}`}
                onClick={() => dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: conv.id })}
              >
                <span className="conversation-name">{conv.title}</span>
                <button className="delete-btn" onClick={(e) => handleDelete(e, conv.id)} title="Supprimer">
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="sidebar-profile">
        <UserProfile collapsed={!sidebarExpanded} />
      </div>
    </aside>
  )
}