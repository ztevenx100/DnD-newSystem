import React from 'react';
import { Outlet, Link } from "react-router-dom";
import { Tooltip, Typography } from "@material-tailwind/react";

import  SvgHome from '../../../components/UI/Icons/SvgHome';
import  SvgPerson from '../../../components/UI/Icons/SvgPerson';

import './Navbar.css'; // Importa un archivo de estilo para posicionar el navbar

const Navbar: React.FC = () => {
  return (
    <>
      <nav className="navbar ml-3">
        <menu>
          <Tooltip className="bg-dark text-light px-2 py-1" placement="right" content={"Inicio"} >
            <li><Link to="/" ><SvgHome width="50" height="50" fill='none' stroke='#fff' /></Link></li>
          </Tooltip>
          <Tooltip className="bg-dark text-light px-2 py-1" placement="right" content={"Hoja de personaje"} >
            <li><Link to="/CharacterSheet" ><SvgPerson width="50" height="50" fill='#fff' /></Link></li>
          </Tooltip>
        </menu>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
