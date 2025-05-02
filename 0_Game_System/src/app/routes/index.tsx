import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';

// Importaciones lazy para las páginas principales
const CharacterSheet = lazy(() => import('@modules/characters/presentation/pages/CharacterSheet'));
const WorldMap = lazy(() => import('@modules/world/presentation/pages/WorldMap'));
const SystemsGameList = lazy(() => import('@modules/game-systems/presentation/pages/SystemsGameList'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CharacterSheet />,
  },
  {
    path: '/world-map',
    element: <WorldMap />,
  },
  {
    path: '/game-systems',
    element: <SystemsGameList />,
  },
]); 