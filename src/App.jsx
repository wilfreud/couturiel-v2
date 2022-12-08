import './App.css'
import Login from './pages/Login'
import AppWrapper from './pages/AppWrapper'
import { AuthProvider } from './context/AuthProvider'
import { RequireAuth } from './context/RequireAuth'
import { HashRouter, Routes, Route } from 'react-router-dom'

function App() {


  return (
    <div className="App">
        <div id="modal-portal" />
      <HashRouter>
      <AuthProvider>
        <Routes>

          <Route path="/" element={<Login />} />

          <Route path="/app/*" element={<RequireAuth> <AppWrapper /> </RequireAuth>} />
        
        </Routes>
      </AuthProvider>
      </HashRouter>

    </div>
  )
}

export default App
