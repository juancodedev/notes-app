import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./components/ThemeProvider"


import Home from "./pages/Home"
import './App.css'

function App() {

  return (
    <ThemeProvider>
      <Router>

        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/notes/create" element={<CreateNote />} />
          <Route path="/notes/:id" element={<CreateNote />} /> */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
