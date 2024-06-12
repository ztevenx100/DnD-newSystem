import React from 'react';

import './Footer.css';

const Footer: React.FC = () => {
  return (
    <>
        <footer className="footer relative w-full">
            <section className="flex w-full flex-row flex-wrap items-center justify-center gap-y-4 gap-x-12 border-t border-gray-900 bg-gray-700 py-5 px-5 text-center md:justify-between">
                <p className="text-center font-normal text-white" >
                    2024-05 - Pedro Steven Castiblanco
                </p>
            </section>
        </footer>
    </>
  );
};

export default Footer;