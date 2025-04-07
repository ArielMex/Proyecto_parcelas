"use client"

import type { FC } from "react"
import { RefreshCw, User } from "lucide-react"
import "../styles/Header.css"

interface HeaderProps {
  onRefresh: () => void
  loading: boolean
  lastUpdated: string
}

const Header: FC<HeaderProps> = ({ onRefresh, loading, lastUpdated }) => {
  return (
    <div className="header">
      <div className="header-left">
        <h1>BIENVENIDO</h1>
        <div className="refresh-controls">
          <button onClick={onRefresh} disabled={loading} className={`refresh-button ${loading ? "loading" : ""}`}>
            <RefreshCw className={loading ? "spin" : ""} size={18} />
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
          <span className="update-time">{lastUpdated && `Últ. actualización: ${lastUpdated}`}</span>
        </div>
      </div>
      <div className="user-avatar">
        <div className="avatar-icon">
          <User size={24} /> {/* Ícono de usuario en lugar del texto AH */}
        </div>
      </div>
    </div>
  )
}

export default Header

