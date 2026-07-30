import Message from '../Message/Message'
import './MessageList.css'

export default function MessageList({ messages }) {
  return (
    <div className="message-list">
      {messages.map(msg => (
        <Message key={msg.id} message={msg} />
      ))}
    </div>
  )
}