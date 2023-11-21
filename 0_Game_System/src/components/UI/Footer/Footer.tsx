import React from 'react';

import { Typography } from "@material-tailwind/react";

import './Footer.css';

const Footer: React.FC = () => {
  return (
    <>
        <footer className="footer relative w-full">
            <section className="flex w-full flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 border-t border-gray-900 bg-gray-700 py-6 px-2 text-center md:justify-between">
                <Typography className="text-center font-normal text-white">
                    2023-11 - Pedro Steven Castiblanco
                </Typography>
            </section>
        </footer>
    </>
  );
};

export default Footer;