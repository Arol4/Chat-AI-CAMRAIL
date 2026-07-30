import { AppProvider } from './context/AppProvider'
import Sidebar from './components/Sidebar/Sidebar'
import ChatArea from './components/ChatArea/ChatArea'
import './App.css'

function App() {
  return (
    <AppProvider>
      <div className="app-container">
        <Sidebar />
        <main className="main-chat">
          <ChatArea />
        </main>
      </div>
    </AppProvider>
  )
}

export default App