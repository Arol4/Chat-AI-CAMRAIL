import { useReducer } from 'react'
import { AppContext } from "./AppContext"
import { v4 as uuidv4 } from 'uuid'

const initialState = {
  conversations: [
    {
      id: '1',
      title: 'Présentation du projet',
      messages: [
        { id: 'm1', role: 'user', content: 'Bonjour, peux-tu me parler du projet ?'},
        { id: 'm2', role: 'assistant', content: 'Bien sûr ! Voici un résumé...', sources: ['Documentation interne', 'Rapport Q1'], reasoning: 'Le projet vise à améliorer l\'efficacité du transport ferroviaire en Afrique centrale.'}
      ]
    }
  ],
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
      return {
        ...state,
        activeConversationId: action.payload?.id ?? uuidv4()
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

    case 'RENAME_CONVERSATION': {
      const nextTitle = action.payload.title.trim()

      if (!nextTitle) {
        return state
      }

      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === action.payload.id
            ? { ...conv, title: nextTitle }
            : conv
        )
      }
    }

    case 'ADD_MESSAGE': {
      const { conversationId, message } = action.payload

      const existingConversation = state.conversations.find(conv => conv.id === conversationId)

      if (!existingConversation) {
        const newTitle =
          message.role === 'user'
            ? message.content.trim().substring(0, 30)
            : 'Nouvelle conversation'

        return {
          ...state,
          conversations: [
            {
              id: conversationId,
              title: newTitle,
              messages: [message]
            },
            ...state.conversations
          ],
          activeConversationId: conversationId
        }
      }

      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, message],
                title:
                  conv.messages.length === 0 && message.role === 'user'
                    ? message.content.trim().substring(0, 30)
                    : conv.title
              }
            : conv
        )
      }
    }

    case 'SET_VOICE_CHAT_ACTIVE':
      return { ...state, isVoiceChatActive: action.payload }

    case 'UPDATE_MESSAGE_CONTENT': {
      const { conversationId, messageId, content } = action.payload

      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: conv.messages.map(msg =>
                  msg.id === messageId
                    ? { ...msg, content }
                    : msg
                )
              }
            : conv
        )
      }
    }

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