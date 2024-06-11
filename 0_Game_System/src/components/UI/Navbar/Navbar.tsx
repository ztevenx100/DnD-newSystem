import React from 'react';
import { Outlet, NavLink } from "react-router-dom";
import {Tooltip} from "@nextui-org/tooltip";

import  SvgHome from '@Icons/SvgHome';
import  SvgPerson from '@Icons/SvgPerson';
import  SvgSystemList from '@Icons/SvgSystemList';
import  SvgMap from '@Icons/SvgMap';

import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <>
      <nav className="navbar ml-2">
        <menu>
          {/* MapWorld */}
          {/* <Tooltip className="bg-dark text-light px-2 py-1" placement="right" content={"Mapamundi"} >
            <li><NavLink className={({ isActive }) => isActive ? 'active' : ''} to="/WorldMap" ><SvgMap width="30" height="30" fill='#fff' stroke='#fff' /></NavLink></li>
          </Tooltip> */}
          {/* Home */}
          <Tooltip className="bg-dark text-light px-2 py-1" placement="right" content={"Inicio"} >
            <li><NavLink className={({ isActive }) => isActive ? 'active' : ''} to="/" ><SvgHome width="30" height="30" fill='none' stroke='#fff' /></NavLink></li>
          </Tooltip>
          {/* SystemsGameList */}
          <Tooltip className="bg-dark text-light px-2 py-1" placement="right" content={"Listado de sistemas de juego"} >
            <li><NavLink className={({ isActive }) => isActive ? 'active' : ''} to="/SystemsGameList" ><SvgSystemList width="30" height="30" fill='#fff' stroke='#fff' /></NavLink></li>
          </Tooltip>
          {/* UserCharacters */}
          <Tooltip className="bg-dark text-light px-2 py-1" placement="right" content={"Lista de personajes"} >
            <li><NavLink className={({ isActive }) => isActive ? 'active' : ''} to="/UserCharacters" ><SvgPerson width="30" height="30" fill='#fff' /></NavLink></li>
          </Tooltip>
        </menu>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
