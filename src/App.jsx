import { AppProvider } from './context/AppProvider'
import { useAppContext } from './context/AppContext'
import Sidebar from './components/Sidebar/Sidebar'
import ChatArea from './components/ChatArea/ChatArea'
import Login from './components/Login/Login'
import './App.css'

function AppContent() {
  const { state } = useAppContext()

  if (!state.isAuthenticated) {
    return <Login />
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-chat">
        <ChatArea />
      </main>
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App