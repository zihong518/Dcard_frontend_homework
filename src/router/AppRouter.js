import Login from "../pages/Login"
import Redirect from "../pages/redirect"
import Task from "../pages/Task"
import { HashRouter, Route, Routes } from "react-router-dom"
import React, { useState } from "react"

const App = () => {
  const [data, setData] = useState("")

  return (
    // <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="redirect" element={<Redirect />} />
        <Route path="task" element={<Task />} />
      </Routes>
    </HashRouter>
    // </React.StrictMode>
  )
}

export default App
