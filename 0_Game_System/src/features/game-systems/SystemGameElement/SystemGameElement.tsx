import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDataQuerySju } from '@database/models/dbTables';

import { Card, CardBody, Button, Spinner, Divider } from "@nextui-org/react"
import "@unocss/reset/tailwind.css"
import "uno.css"
import "./SystemGameElement.css"

// Interfaces
import { DBSistemaJuego } from '@shared/utils/types';

const SystemGameElement: React.FC = () => {
    const [game, setGame] = useState<DBSistemaJuego>()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    // Cargue de informacion de base de datos
    const params = useParams()
    const navigate = useNavigate()
    
    useEffect(() => {
        getGame()
    }, []);    async function getGame() {
        setIsLoading(true);
        setError(null);

        try {
            if (params.id === 'new') {
                // Modo para crear un nuevo sistema
                setGame({
                    sju_id: '0',
                    sju_nombre: '',
                    sju_descripcion: ''
                });
                setIsLoading(false);
                return;
            }

            if (params.id === undefined || params.id === null) {
                throw new Error('ID del sistema no especificado');
            }

            const data = await Promise.resolve(
                getDataQuerySju(
                    'sju_id, sju_nombre, sju_descripcion',
                    { 'sju_id': params.id }
                )
            );

            if (data === null || data.length === 0) {
                throw new Error('Sistema de juego no encontrado');
            }

            setGame(data[0]);
        } catch (err) {
            console.error('Error al cargar el sistema de juego:', err);
            setError(err instanceof Error ? err.message : 'Error al cargar el sistema de juego');
        } finally {
            setIsLoading(false);
        }
    }    return (
        <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Botón de regreso */}
                <div className="mb-6">
                    <button 
                        onClick={() => navigate('/SystemsGameList')}
                        className="back-link"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Volver a la lista
                    </button>
                </div>

                {isLoading && <LoadingState />}
                {error && <ErrorState error={error} navigate={navigate} />}
                {game && <GameState game={game} />}
                    <div className="animate-fade-in">
                        {/* Encabezado */}
                        <div className="game-header mb-8">
                            <h1 className="game-title">{game.sju_nombre || 'Nuevo Sistema de Juego'}</h1>
                            <p className="text-white text-opacity-90 mt-4 max-w-3xl">
                                {params.id === 'new' ? 'Crea un nuevo sistema de juego para tu campaña.' : 'Detalles del sistema de juego y configuración.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Columna principal */}
                            <div className="lg:col-span-2 space-y-6 animate-fade-in delay-100">
                                {/* Sección de descripción */}
                                <Card className="shadow-md game-card">
                                    <CardBody className="p-6">
                                        <h2 className="section-title">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                <path d="M14 2v6h6" />
                                                <path d="M16 13H8" />
                                                <path d="M16 17H8" />
                                                <path d="M10 9H8" />
                                            </svg>
                                            Descripción
                                        </h2>
                                        <Divider className="my-3" />
                                        {params.id === 'new' ? (
                                            <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-gray-500 text-center">
                                                <p>Aquí podrás añadir la descripción del nuevo sistema de juego.</p>
                                            </div>
                                        ) : (
                                            <p className="description-text">
                                                {game.sju_descripcion || 'Sin descripción disponible.'}
                                            </p>
                                        )}
                                    </CardBody>
                                </Card>

                                {/* Sección de reglas o características (ejemplo) */}
                                <Card className="shadow-md game-card animate-fade-in delay-200">
                                    <CardBody className="p-6">
                                        <h2 className="section-title">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 20h9" />
                                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                            </svg>
                                            Características
                                        </h2>
                                        <Divider className="my-3" />
                                        {params.id === 'new' ? (
                                            <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-gray-500 text-center">
                                                <p>Aquí podrás definir las características del sistema.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="p-4 bg-gray-50 rounded-lg">
                                                    <h3 className="font-medium text-gray-800 mb-2">Tipo de dados</h3>
                                                    <p className="text-gray-600">D20, D10, D8, D6, D4</p>
                                                </div>
                                                <div className="p-4 bg-gray-50 rounded-lg">
                                                    <h3 className="font-medium text-gray-800 mb-2">Clases disponibles</h3>
                                                    <p className="text-gray-600">12 clases básicas</p>
                                                </div>
                                                <div className="p-4 bg-gray-50 rounded-lg">
                                                    <h3 className="font-medium text-gray-800 mb-2">Razas</h3>
                                                    <p className="text-gray-600">8 razas jugables</p>
                                                </div>
                                                <div className="p-4 bg-gray-50 rounded-lg">
                                                    <h3 className="font-medium text-gray-800 mb-2">Nivel máximo</h3>
                                                    <p className="text-gray-600">Nivel 20</p>
                                                </div>
                                            </div>
                                        )}
                                    </CardBody>
                                </Card>
                            </div>

                            {/* Columna lateral */}
                            <div className="space-y-6 animate-fade-in delay-300">
                                {/* Card de acciones */}
                                <Card className="shadow-md game-card">
                                    <CardBody className="p-6">
                                        <h2 className="section-title">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 20h9" />
                                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                            </svg>
                                            Acciones
                                        </h2>
                                        <Divider className="my-3" />
                                        <div className="space-y-3">
                                            <Button 
                                                className="w-full action-button"
                                                color="warning"
                                                variant={params.id === 'new' ? 'solid' : 'light'}
                                            >
                                                {params.id === 'new' ? 'Guardar Sistema' : 'Editar Sistema'}
                                            </Button>
                                            
                                            {params.id !== 'new' && (
                                                <Button 
                                                    className="w-full action-button"
                                                    color="danger"
                                                    variant="flat"
                                                >
                                                    Eliminar Sistema
                                                </Button>
                                            )}
                                        </div>
                                    </CardBody>
                                </Card>

                                {/* Card de información adicional */}
                                {params.id !== 'new' && (
                                    <Card className="shadow-md game-card">
                                        <CardBody className="p-6">
                                            <h2 className="section-title">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <path d="M12 16v-4" />
                                                    <path d="M12 8h.01" />
                                                </svg>
                                                Información
                                            </h2>
                                            <Divider className="my-3" />
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-1">ID del Sistema</p>
                                                    <p className="font-medium">{game.sju_id}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-1">Creado</p>
                                                    <p className="font-medium">12/05/2025</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-1">Última modificación</p>
                                                    <p className="font-medium">20/05/2025</p>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-lg">No se encontró el sistema de juego</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SystemGameElement;