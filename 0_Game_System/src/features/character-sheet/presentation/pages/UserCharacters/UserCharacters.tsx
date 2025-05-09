import "./UserCharacters.css";

import { Suspense, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardBody } from "@nextui-org/react";
import ScreenLoader from "@shared/components/UI/ScreenLoader/ScreenLoader";
import ListUserCharacter from "@features/character-sheet/UserCharacters/ListUserCharacter/ListUserCharacter";
import { DBUsuario } from "@shared/utils/types";
import SvgAddCharacter from '@shared/components/UI/Icons/SvgAddCharacter';
import supabase from "@database/config/supabase";
import { normalizeUser } from "@shared/utils/helpers/userHelpers";

// Definimos un tipo que se ajuste exactamente a lo que espera ListUserCharacter
type ListUserCharacterUser = {
  id: string;  // Este campo es requerido, NO opcional
  nombre?: string;
  usu_nombre?: string;
  usu_id?: string;
  email?: string;
};

const UserCharacters = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<DBUsuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Función para obtener el usuario actual
    const getCurrentUser = async () => {
      try {
        setLoading(true);

        // Intenta obtener el usuario de la sesión de Supabase
        const { data: session } = await supabase.auth.getSession();

        if (session && session.session?.user) {
          // Obtiene los datos adicionales del usuario si es necesario
          const { data: userData } = await supabase
            .from('usuarios') // Asegúrate de que este sea el nombre correcto de la tabla
            .select('*')
            .eq('id', session.session.user.id)
            .single();

          if (userData) {
            // Si existen datos de usuario, configura el estado con TODOS los campos requeridos
            setUser({
              usu_id: session.session.user.id,
              usu_nombre: userData.nombre || session.session.user.email?.split('@')[0] || 'Usuario',
              usu_email: session.session.user.email || '',
              id: session.session.user.id,
              nombre: userData.nombre || session.session.user.email?.split('@')[0] || 'Usuario',
              email: session.session.user.email || ''
            });
          } else {
            // Si no hay datos, usa información básica del usuario de auth
            setUser({
              usu_id: session.session.user.id,
              usu_nombre: session.session.user.email?.split('@')[0] || 'Usuario',
              usu_email: session.session.user.email || '',
              id: session.session.user.id,
              nombre: session.session.user.email?.split('@')[0] || 'Usuario',
              email: session.session.user.email || ''
            });
          }
        } else {
          // Para desarrollo: si no hay sesión, usa un usuario de prueba
          console.warn('No se encontró sesión de usuario. Usando ID de prueba para desarrollo.');
          setUser({
            usu_id: '43c29fa1-d02c-4da5-90ea-51f451ed8952', // Un UUID fijo para pruebas
            usu_nombre: 'Usuario de Prueba',
            usu_email: 'test@example.com',
            id: '43c29fa1-d02c-4da5-90ea-51f451ed8952',
            nombre: 'Usuario de Prueba',
            email: 'test@example.com'
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Error al obtener el usuario actual:', error);
        setError('Error al cargar el usuario. Por favor, inténtalo de nuevo.');
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);  const handleOpenCharacter = () => {
    if (!user) {
      console.error('No hay usuario disponible para crear un personaje');
      // Mostrar algún mensaje de error al usuario
      setError('No se puede crear un personaje sin un usuario válido.');
      return;
    }
    
    // Verificamos que el ID sea válido antes de navegar
    if (!user.id && !user.usu_id) {
      console.error('El usuario no tiene un ID válido');
      setError('El usuario no tiene un ID válido para crear un personaje.');
      return;
    }
    
    // Navegar a la página de creación de personajes
    navigate('/CharacterSheet');
  };// Función para convertir de DBUsuario al tipo que espera ListUserCharacter
  const toListUserCharacterUser = (user: DBUsuario): ListUserCharacterUser => {
    // Primero normalizamos el usuario para asegurar que tenga todos los campos
    const normalizedUser = normalizeUser(user);
    
    // Luego creamos un objeto que cumpla con la interfaz de ListUserCharacter
    return {
      id: normalizedUser.id || normalizedUser.usu_id, // Garantizamos que id nunca sea undefined
      nombre: normalizedUser.nombre,
      usu_nombre: normalizedUser.usu_nombre,
      usu_id: normalizedUser.usu_id,
      email: normalizedUser.email || normalizedUser.usu_email
    };
  };

  if (loading) {
    return <ScreenLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="min-h-screen w-full px-4 py-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-[1400px] mx-auto">
          <header className="bg-white shadow-lg rounded-lg py-6 mb-8">
            <h1 className="text-3xl font-bold uppercase text-center text-gray-800">
              Listado de personajes
            </h1>
            {user && (
              <p className="text-center text-gray-600 mt-2">
                Usuario: {user.nombre || user.usu_nombre}
              </p>
            )}
          </header>
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardBody className="p-6 md:p-8">
              <div className="flex justify-end mb-6">
                <button
                  className="btn-add-character"
                  onClick={handleOpenCharacter}
                  title="Añadir nuevo personaje"
                >
                  <SvgAddCharacter className="icon" width={32} height={32} />
                  <span>Nuevo Personaje</span>
                </button>
              </div>              <Suspense fallback={<ScreenLoader />}>
                {user && (
                  <ListUserCharacter user={toListUserCharacterUser(user)} />
                )}
                {!user && (
                  <div className="text-center p-8 text-gray-500">
                    No se ha podido cargar la información del usuario
                  </div>
                )}
              </Suspense>
            </CardBody>
          </Card>
        </div>
      </section>
    </>
  );
};

export default UserCharacters;