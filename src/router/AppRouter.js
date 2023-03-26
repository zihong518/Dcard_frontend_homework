import Login from "../pages/Login"
import Redirect from "../pages/redirect"
import Task from "../pages/Task"
import { HashRouter, Route, Routes } from "react-router-dom"
import React, { useState } from "react"

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="redirect" element={<Redirect />} />
        <Route path="task" element={<Task />} />
      </Routes>
    </HashRouter>
  )
}

export default App
