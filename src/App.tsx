import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./components/ThemeProvider"
import './App.css'

import Home from "./pages/Home"
import NotePage from "./pages/NotePage"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"

function App() {

  return (
    <ThemeProvider>
      <Router>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notes/:id" element={<NotePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
