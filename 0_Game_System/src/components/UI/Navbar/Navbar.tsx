import React from 'react';
import { Outlet, NavLink } from "react-router-dom";
import { Tooltip } from "@material-tailwind/react";

import  SvgHome from '../../../components/UI/Icons/SvgHome';
import  SvgPerson from '../../../components/UI/Icons/SvgPerson';

import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <>
      <nav className="navbar ml-3">
        <menu>
          {/* Home */}
          <Tooltip className="bg-dark text-light px-2 py-1" placement="right" content={"Inicio"} >
            <li><NavLink className={({ isActive }) => isActive ? 'active' : ''} to="/" ><SvgHome width="40" height="50" fill='none' stroke='#fff' /></NavLink></li>
          </Tooltip>
          {/* UserCharacters */}
          <Tooltip className="bg-dark text-light px-2 py-1" placement="right" content={"Lista de personajes"} >
            <li><NavLink className={({ isActive }) => isActive ? 'active' : ''} to="/UserCharacters" ><SvgPerson width="40" height="50" fill='#fff' /></NavLink></li>
          </Tooltip>
        </menu>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
