import { useAppContext } from '../../context/AppContext'
import MessageList from '../MessageList/MessageList'
import ChatInput from '../ChatInput/ChatInput'
import './ChatArea.css'

export default function ChatArea() {
  const { state } = useAppContext()
  const activeConv = state.conversations.find(c => c.id === state.activeConversationId)
  const messages = activeConv ? activeConv.messages : []

  return (
    <div className="chat-area">
      {messages.length === 0 ? (
        <div className="welcome-message">
          <h1>Bonjour, je vous écoute</h1>
        </div>
      ) : (
        <MessageList messages={messages} />
      )}
      <ChatInput conversationId={state.activeConversationId} />
    </div>
  )
}