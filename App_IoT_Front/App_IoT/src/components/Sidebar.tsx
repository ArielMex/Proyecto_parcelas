"use client"

import type { FC } from "react"
import { useNavigate } from "react-router-dom"
import { FiGrid, FiTrash2, FiLogOut, FiDroplet } from "react-icons/fi"
import "../styles/Sidebar.css"

interface SidebarProps {
  onSelect: (view: string) => void
  currentView: string
}

const Sidebar: FC<SidebarProps> = ({ onSelect, currentView }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    navigate("/", { replace: true })
    window.location.reload()
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>APLICACIÓN DE IOT</h1>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className={currentView === "dashboard" ? "active" : ""}>
            <button onClick={() => onSelect("dashboard")}>
              <FiGrid className="icon" /> Dashboard
            </button>
          </li>
          <li className={currentView === "parcelas-eliminadas" ? "active" : ""}>
            <button onClick={() => onSelect("parcelas-eliminadas")}>
              <FiTrash2 className="icon" /> Parcelas Eliminadas
            </button>
          </li>
          <li className={currentView === "zonas-riego" ? "active" : ""}>
            <button onClick={() => onSelect("zonas-riego")}>
              <FiDroplet className="icon" /> Zonas de Riego
            </button>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          <FiLogOut className="icon" /> Salir
        </button>
      </div>
    </div>
  )
}

export default Sidebar