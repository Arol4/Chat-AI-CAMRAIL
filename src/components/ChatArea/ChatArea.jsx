import { useAppContext } from '../../context/AppContext'
import MessageList from '../MessageList/MessageList'
import ChatInput from '../ChatInput/ChatInput'
import './ChatArea.css'

export default function ChatArea() {
  const { state } = useAppContext()
  const activeConv = state.conversations.find(c => c.id === state.activeConversationId)
  const messages = activeConv ? activeConv.messages : []
  const isEmpty = messages.length === 0
  const greetingName = state.username?.trim() || 'utilisateur'

  return (
    <div className={`chat-area ${isEmpty ? 'empty' : ''}`}>
      {isEmpty ? (
        <div className="welcome-message">
          <h1>{state.username ? `Bonjour ${greetingName}` : 'Bonjour, je vous écoute'}</h1>
          <ChatInput conversationId={state.activeConversationId} />
        </div>
      ) : (
        <>
          <MessageList messages={messages} />
          <ChatInput conversationId={state.activeConversationId} />
        </>
      )}      
    </div>
  )
}