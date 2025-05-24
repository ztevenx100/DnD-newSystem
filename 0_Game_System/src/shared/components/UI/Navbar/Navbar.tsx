import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Outlet, NavLink } from "react-router-dom";
import { Tooltip } from "@nextui-org/react";

import  SvgHome from '@Icons/SvgHome';
import  SvgPerson from '@Icons/SvgPerson';
import  SvgSystemList from '@Icons/SvgSystemList';
import  SvgMap from '@Icons/SvgMap';

import './Navbar.css';

// Componente para manejar errores en los componentes UI
class TooltipErrorBoundary extends Component<{children: ReactNode}> {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    // Actualiza el estado para que el siguiente renderizado muestre la UI alternativa
    return { hasError: true };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Puedes registrar el error en un servicio de reportes
    console.error('Error en componente UI:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      // Renderiza una UI alternativa en caso de error
      return <li className="tooltip-fallback">{this.props.children}</li>;
    }
    
    return this.props.children;
  }
}

const Navbar: React.FC = () => {
  return (
    <>
      <nav className="navbar ml-2">
        <menu>
          {/* MapWorld */}
          <TooltipErrorBoundary>
            <Tooltip className="bg-dark text-light px-2 py-1" placement="right" content={"Mapamundi"} >
              <li><NavLink className={({ isActive }) => isActive ? 'active' : ''} to="/WorldMap" aria-label="Ir a Mapamundi"><SvgMap width="30" height="30" fill='#fff' stroke='#fff' aria-hidden="true" /></NavLink></li>
            </Tooltip>
          </TooltipErrorBoundary>
          {/* Home */}
          <TooltipErrorBoundary>
            <Tooltip className="bg-dark text-light px-2 py-1" placement="right" content={"Inicio"} >
              <li><NavLink className={({ isActive }) => isActive ? 'active' : ''} to="/" aria-label="Ir a Inicio"><SvgHome width="30" height="30" fill='#fff0' stroke='#fff' aria-hidden="true" /></NavLink></li>
            </Tooltip>
          </TooltipErrorBoundary>
          {/* SystemsGameList */}
          <TooltipErrorBoundary>
            <Tooltip className="bg-dark text-light px-2 py-1" placement="right" content={"Listado de sistemas de juego"} >
              <li><NavLink className={({ isActive }) => isActive ? 'active' : ''} to="/SystemsGameList" aria-label="Ir a Listado de sistemas de juego"><SvgSystemList width="30" height="30" fill='#fff' stroke='#fff' aria-hidden="true" /></NavLink></li>
            </Tooltip>
          </TooltipErrorBoundary>
          {/* UserCharacters */}
          <TooltipErrorBoundary>
            <Tooltip className="bg-dark text-light px-2 py-1" placement="right" content={"Lista de personajes"} >
              <li><NavLink className={({ isActive }) => isActive ? 'active' : ''} to="/UserCharacters" aria-label="Ir a Lista de personajes"><SvgPerson width="30" height="30" fill='#fff' stroke='#fff' aria-hidden="true" /></NavLink></li>
            </Tooltip>
          </TooltipErrorBoundary>
        </menu>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
