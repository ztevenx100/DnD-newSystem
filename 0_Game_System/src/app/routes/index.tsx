import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ROUTES } from '../config/routes';
import { ErrorPage } from '@/shared/components/ErrorPage';
import { ScreenLoader } from '@/shared/components/ScreenLoader';
import DatabaseErrorBoundary from '@/shared/components/ErrorBoundary/DatabaseErrorBoundary';
import { getCharacter, getUser } from '@features/character-sheet/infrastructure/services';
import { DBUsuario } from '@shared/utils/types';
import { DBPersonajesUsuario } from '@shared/utils/types/dbTypes';

// Importaciones lazy para las páginas principales
const Home = lazy(() => import('@/app/Home'));
const UserCharacters = lazy(() => import('@features/character-sheet/UserCharacters/UserCharacters'));
const CharacterSheet = lazy(() => import('@features/character-sheet/UserCharacters/CharacterSheet/CharacterSheet'));
const WorldMap = lazy(() => import('@features/world-map/WorldMap/WorldMap'));
const SystemsGameList = lazy(() => import('@features/game-systems/presentation/pages/SystemsGameList'));

// Componente de carga para las rutas lazy
const LoadingFallback = () => <ScreenLoader />;

async function getUserSession(): Promise<DBUsuario> {
    const user: DBUsuario[] = await Promise.resolve(
      getUser("43c29fa1-d02c-4da5-90ea-51f451ed8952")
    );
  
    return user[0];
}

const userLoader = async () => {
    const user = await getUserSession();
    return user;
};

const userAndCharacterLoader = async ({ params }: any) => {
    const user = await getUserSession();
  
    const characters = await getCharacter(params.id);
    return {
      user,
      character: Boolean(characters?.length) ? characters[0] as DBPersonajesUsuario : undefined,
    };
};

const changeBackground = (newBackground: string) => {
    document.body.style.backgroundImage = `url(${newBackground})`;
};

export const router = createBrowserRouter([
    {
        path: ROUTES.HOME,
        element: (
            <Suspense fallback={<LoadingFallback />}>
                <Home changeBackground={changeBackground} />
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
        errorElement: <DatabaseErrorBoundary />,
        loader: userLoader, // Agregar el loader aquí
    },
    {
        path: ROUTES.CHARACTERS.SHEET,
        element: (
            <Suspense fallback={<LoadingFallback />}>
                <CharacterSheet changeBackground={changeBackground} />
            </Suspense>
        ),
        errorElement: <DatabaseErrorBoundary />,
        loader: userAndCharacterLoader, // Agregar el loader aquí
    },
    {
        path: ROUTES.CHARACTERS.CREATE,
        element: (
            <Suspense fallback={<LoadingFallback />}>
                <CharacterSheet changeBackground={changeBackground} />
            </Suspense>
        ),
        errorElement: <DatabaseErrorBoundary />,
        loader: userLoader, // Agregar el loader aquí
    },
    {
        path: ROUTES.WORLD.MAP,
        element: (
            <Suspense fallback={<LoadingFallback />}>
                <WorldMap changeBackground={changeBackground} />
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