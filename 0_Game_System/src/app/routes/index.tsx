import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ROUTES } from '../config/routes';
import { ErrorPage } from '@/shared/components/ErrorPage';
import { ScreenLoader } from '@/shared/components/ScreenLoader';

// Importaciones lazy para las páginas principales
const Home = lazy(() => import('@modules/home/presentation/pages/Home'));
const UserCharacters = lazy(() => import('@modules/characters/presentation/pages/UserCharacters'));
const CharacterSheet = lazy(() => import('@modules/characters/presentation/pages/CharacterSheet'));
const WorldMap = lazy(() => import('@modules/world/presentation/pages/WorldMap'));
const SystemsGameList = lazy(() => import('@modules/gameSystems/presentation/pages/SystemsGameList'));

// Componente de carga para las rutas lazy
const LoadingFallback = () => <ScreenLoader />;

export const router = createBrowserRouter([
    {
        path: ROUTES.HOME,
        element: (
            <Suspense fallback={<LoadingFallback />}>
                <Home />
            </Suspense>
        ),
    },
    {
        path: ROUTES.CHARACTERS.LIST,
        element: (
            <Suspense fallback={<LoadingFallback />}>
                <UserCharacters />
            </Suspense>
        ),
    },
    {
        path: ROUTES.CHARACTERS.SHEET,
        element: (
            <Suspense fallback={<LoadingFallback />}>
                <CharacterSheet />
            </Suspense>
        ),
    },
    {
        path: ROUTES.CHARACTERS.CREATE,
        element: (
            <Suspense fallback={<LoadingFallback />}>
                <CharacterSheet />
            </Suspense>
        ),
    },
    {
        path: ROUTES.WORLD.MAP,
        element: (
            <Suspense fallback={<LoadingFallback />}>
                <WorldMap />
            </Suspense>
        ),
    },
    {
        path: ROUTES.GAME_SYSTEMS.LIST,
        element: (
            <Suspense fallback={<LoadingFallback />}>
                <SystemsGameList />
            </Suspense>
        ),
    },
    {
        path: ROUTES.GAME_SYSTEMS.DETAIL,
        element: (
            <Suspense fallback={<LoadingFallback />}>
                <SystemsGameList />
            </Suspense>
        ),
    },
    {
        path: ROUTES.ERROR,
        element: <ErrorPage />,
    },
]); 