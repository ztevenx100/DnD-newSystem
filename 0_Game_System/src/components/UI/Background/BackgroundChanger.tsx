import React from 'react';

import '@/App.css';

import homeBackground from '@img/jpg/bg-home-01.jpg';

// Interfaz para las propiedades del componente BackgroundChanger
interface BackgroundChangerProps {
    initialBackground: string; // URL del fondo inicial
    children: React.ReactNode; // Permitir elementos HTML adicionales dentro del BackgroundChanger
  }

// Componente BackgroundChanger
const BackgroundChanger: React.FC<BackgroundChangerProps> = ({ initialBackground, children }) => {

    return (
        <div 
            style={{ 
                backgroundImage: `url(${(initialBackground)?initialBackground:homeBackground})`
                , backgroundSize: 'cover'
                , backgroundPosition: 'center' 
            }}
        >
            {children} {/* Renderizar elementos HTML adicionales */}
        </div>
    );
};

export default BackgroundChanger;