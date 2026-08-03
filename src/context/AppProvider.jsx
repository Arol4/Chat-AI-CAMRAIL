import { useReducer } from 'react'
import { AppContext } from "./AppContext"
import { v4 as uuidv4 } from 'uuid'

const initialState = {
  conversations: [],
  activeConversationId: null,
  sidebarExpanded: true,
  isVoiceChatActive: false
}

function appReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarExpanded: !state.sidebarExpanded }
    case 'SET_SIDEBAR_EXPANDED':
      return { ...state, sidebarExpanded: action.payload }
    case 'CREATE_NEW_CHAT': {
      const newId = action.payload?.id ?? uuidv4()

      const newConv = {
        id: newId,
        title: 'Nouvelle conversation',
        messages: []
      }

      return {
        ...state,
        conversations: [newConv, ...state.conversations],
        activeConversationId: newId
      }
    }
    case 'DELETE_CONVERSATION': {
      const filtered = state.conversations.filter(c => c.id !== action.payload)
      let nextActive = state.activeConversationId
      if (state.activeConversationId === action.payload) {
        nextActive = filtered.length > 0 ? filtered[0].id : null
      }
      return {
        ...state,
        conversations: filtered,
        activeConversationId: nextActive
      }
    }
    case 'SET_ACTIVE_CONVERSATION':
      return { ...state, activeConversationId: action.payload }
    case 'ADD_MESSAGE': {
      const { conversationId, message } = action.payload
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, messages: [...conv.messages, message], title: conv.messages.length === 0 && message.role === 'user' ? message.content.substring(0, 30) : conv.title }
            : conv
        )
      }
    }
    case 'SET_VOICE_CHAT_ACTIVE':
      return { ...state, isVoiceChatActive: action.payload }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}