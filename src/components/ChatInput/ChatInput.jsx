import { useState, useRef, useEffect } from 'react'
import { FiPlus, FiMic, FiMicOff, FiPhone, FiPhoneOff } from 'react-icons/fi'
import { useAppContext } from '../../context/AppContext'
import { generateResponseStream } from '../../services/aiService'
import { v4 as uuidv4 } from 'uuid'
import './ChatInput.css'

export default function ChatInput({ conversationId }) {
  const [inputValue, setInputValue] = useState('')
  const [listening, setListening] = useState(false)
  const [response, setResponse] = useState('')
  const { state, dispatch } = useAppContext()
  const recognitionRef = useRef(null)
  const textareaRef = useRef(null)

  // Gestion dictée vocale (micro)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'fr-FR'

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInputValue(prev => prev + ' ' + transcript)
    }

    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)

    recognitionRef.current = recognition
  }, [])

  const startDictation = () => {
    if (recognitionRef.current) {
      setListening(true)
      recognitionRef.current.start()
    }
  }

  const stopDictation = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setListening(false)
    }
  }

  // Gestion discussion vocale (appel)
  const toggleVoiceChat = () => {
    dispatch({ type: 'SET_VOICE_CHAT_ACTIVE', payload: !state.isVoiceChatActive })
    // Ici on pourrait démarrer une logique de chat vocal bidirectionnel
  }

  const handleSend = async (e) => {
    const text = inputValue.trim()
    if (!text) return

    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: text
    }

    const targetConversationId = conversationId ?? state.activeConversationId ?? uuidv4()

    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        conversationId: targetConversationId,
        message: userMessage
      }
    })

    setInputValue('')

    const assistantMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: '',
      sources: ['Documentation', 'FAQ'],
      reasoning: "L'IA a analysé la question et a généré une réponse basée sur les données disponibles."
    }

    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        conversationId: targetConversationId,
        message: assistantMessage
      }
    })

    const stream = await generateResponseStream(text)
    let fullText = ''

    for await (const chunk of stream) {
      const chunkText = chunk.text()
      fullText += chunkText

      dispatch({
        type: 'UPDATE_MESSAGE_CONTENT',
        payload: {
          conversationId: targetConversationId,
          messageId: assistantMessage.id,
          content: fullText
        }
      })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-input-container">
      <div className="input-box">
        <button className="input-action left" title="Ajouter des fichiers">
          <FiPlus size={20} />
        </button>

        <textarea
          ref={textareaRef}
          className="message-input"
          placeholder="Écrivez votre message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />

        <button
          className={`input-action mic-btn ${listening ? 'active' : ''}`}
          onClick={listening ? stopDictation : startDictation}
          title={listening ? 'Arrêter la dictée' : 'Dicter un message'}
        >
          {listening ? <FiMicOff size={20} /> :<FiMic size={20} />}
        </button>

        <button
          className={`input-action voice-chat-btn ${state.isVoiceChatActive ? 'active' : ''}`}
          onClick={toggleVoiceChat}
          title={state.isVoiceChatActive ? 'Arrêter la discussion vocale' : 'Lancer la discussion vocale'}
        >
          {state.isVoiceChatActive ? <FiPhoneOff size={20} /> : <FiPhone size={20} />}
        </button>
      </div>
    </div>
  )
}