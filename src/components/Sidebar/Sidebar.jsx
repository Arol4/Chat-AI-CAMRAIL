import { useAppContext } from '../../context/AppContext'
import { FiTrash2, FiChevronLeft, FiChevronRight, FiPlus, FiEdit } from 'react-icons/fi'
import { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import UserProfile from '../UserProfile/UserProfile'
import logo from '../../assets/logo-camrail.png'
import './Sidebar.css'

export default function Sidebar() {
  const { state, dispatch } = useAppContext()
  const { conversations, activeConversationId, sidebarExpanded } = state
  const [editingConversationId, setEditingConversationId] = useState(null)
  const [draftTitle, setDraftTitle] = useState('')
  const renameInputRef = useRef(null)

  useEffect(() => {
    if (editingConversationId !== null) {
      renameInputRef.current?.focus()
      renameInputRef.current?.select()
    }
  }, [editingConversationId])

  const handleNewChat = () => {
    dispatch({
      type: 'CREATE_NEW_CHAT',
      payload: { id: uuidv4() }
    })
  }

  const handleDelete = (e, id) => {
    e.stopPropagation()
    dispatch({ type: 'DELETE_CONVERSATION', payload: id })
  }

  const handleRenameStart = (e, conv) => {
    e.stopPropagation()
    setEditingConversationId(conv.id)
    setDraftTitle(conv.title)
  }

  const handleRenameSubmit = (e, id) => {
    e.preventDefault()
    e.stopPropagation()

    const nextTitle = draftTitle.trim()

    if (nextTitle) {
      dispatch({
        type: 'RENAME_CONVERSATION',
        payload: { id, title: nextTitle }
      })
    }

    setEditingConversationId(null)
    setDraftTitle('')
  }

  const handleRenameCancel = (e) => {
    e.stopPropagation()
    setEditingConversationId(null)
    setDraftTitle('')
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
                onClick={editingConversationId === conv.id ? undefined : () => dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: conv.id })}
              >
                {editingConversationId === conv.id ? (
                  <input
                    ref={renameInputRef}
                    className="conversation-name-input"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.target.select()}
                    onBlur={(e) => handleRenameSubmit(e, conv.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameSubmit(e, conv.id)
                      if (e.key === 'Escape') handleRenameCancel(e)
                    }}
                  />
                ) : (
                  <>
                    <span className="conversation-name">{conv.title}</span>
                    <div className="conversation-actions">
                      <button className="edit-btn" onClick={(e) => handleRenameStart(e, conv)} title="Renommer">
                        <FiEdit size={16} />
                      </button>
                      <button className="delete-btn" onClick={(e) => handleDelete(e, conv.id)} title="Supprimer">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
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