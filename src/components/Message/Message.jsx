import { useState } from 'react'
import { MdSource, MdContentCopy, MdChevronRight } from "react-icons/md";
import './Message.css'

export default function Message({ message }) {
  const [showCopy, setShowCopy] = useState(false)
  const [showReasoning, setShowReasoning] = useState(false)

  const isUser = message.role === 'user'

  const hasReasoning =
    typeof message?.reasoning === 'string'
      ? message.reasoning.trim() !== ''
      : Boolean(message?.reasoning)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setShowCopy(true)
    setTimeout(() => setShowCopy(false), 1500)
  }

  return (
    <div className={`message-row ${isUser ? 'user-row' : 'assistant-row'}`}>
      <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
        {hasReasoning && (
          <button
            type="button"
            className="reasoning-toggle"
            onClick={() => setShowReasoning((prev) => !prev)}
            aria-expanded={showReasoning}
          >
            <span>{showReasoning ? 'Masquer le raisonnement' : 'Afficher le raisonnement'}</span>
          </button>
        )}

        {showReasoning && hasReasoning && (
          <div className="message-reasoning">
            {message.reasoning}
          </div>
        )}

        <p>{message.content}</p>
      </div>

      <div
        className={`message-actions ${isUser ? 'user-actions' : 'assistant-actions'}`}
        onMouseEnter={() => isUser && setShowCopy(true)}
        onMouseLeave={() => isUser && setShowCopy(false)}
      >
        {isUser ? (
          showCopy && (
            <button className="action-btn copy-btn" onClick={handleCopy} title="Copier">
              <MdContentCopy size={14} />
            </button>
          )
        ) : (
          <>
            <button className="action-btn copy-btn" onClick={handleCopy} title="Copier">
              <MdContentCopy size={14} />
            </button>
            {message.sources && message.sources.length > 0 && (
              <button className="action-btn sources-btn">
                <MdSource size={14} />
                <span>Sources</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}