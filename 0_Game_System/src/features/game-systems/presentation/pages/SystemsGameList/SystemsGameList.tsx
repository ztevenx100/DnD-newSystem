import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody, Button, Spinner, Input } from "@nextui-org/react"
import "@unocss/reset/tailwind.css"
import "uno.css"
import "./SystemsGameList.css"

import { DBSistemaJuego } from '@shared/utils/types';
import { getDataQuerySju } from '@database/models/dbTables';

const SystemsGameList: React.FC = () => {
    const [list, setList] = useState<DBSistemaJuego[]>([])
    const [filteredList, setFilteredList] = useState<DBSistemaJuego[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        getList();
    }, [])

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredList(list);
        } else {
            const filtered = list.filter(
                (system) => 
                    system.sju_nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    system.sju_descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredList(filtered);
        }
    }, [searchQuery, list]);

    async function getList() {
        setIsLoading(true);
        try {
            const data = await Promise.resolve(
                getDataQuerySju(
                    'sju_id, sju_nombre, sju_descripcion '
                )
            );

            if (data !== null) {
                setList(data);
                setFilteredList(data);
            }
        } catch (error) {
            console.error("Error al cargar los sistemas de juego:", error);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header con título y botón para agregar */}
                    <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center" style={{ backgroundColor: '#F2AF29' }}>
                        <h1 className="text-2xl font-bold text-white">Sistemas de Juego</h1>
                        <Button 
                            variant="shadow" 
                            startContent={
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1z" />
                                </svg>
                            }
                            onClick={() => navigate('/SystemGameElement/new')}
                            className="font-semibold px-5 py-2 transition-transform duration-200 transform hover:scale-105 hover:-translate-y-1"
                            style={{ 
                                backgroundColor: '#ffffff',
                                color: '#F2AF29',
                                border: '2px solid #F2AF29',
                                boxShadow: '0 4px 6px rgba(242, 175, 41, 0.3)',
                                minWidth: '160px'
                            }}
                        >
                            Nuevo Sistema
                        </Button>
                    </div>
                    {/* Barra de búsqueda */}
                    <div className="px-6 py-5 bg-gray-50">
                        <div className="relative max-w-md mx-auto" style={{ transition: 'all 0.3s ease' }}>
                            <div className="relative search-input-container" style={{ 
                                transform: searchQuery ? 'translateY(-2px)' : 'none',
                                transition: 'transform 0.3s ease'
                            }}><Input
                                    placeholder="Buscar sistema de juego..."
                                    aria-label="Buscar sistema de juego"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    startContent={
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F2AF29" strokeWidth="2.5" className="ml-2 search-icon">
                                            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M21 21L16.65 16.65" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    }
                                    className="w-full transition-all duration-300 shadow-md search-input"
                                    classNames={{
                                        inputWrapper: "search-wrapper",
                                        input: "search-text",
                                        clearButton: "search-clear-button"
                                    }}
                                    description={searchQuery ? `Mostrando ${filteredList.length} resultados` : ""}
                                    size="md"
                                    variant="flat"
                                    radius="full"
                                    isClearable
                                    onClear={() => setSearchQuery("")}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contenido principal */}
                    <div className="px-6 py-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <Spinner size="lg" color="warning" />
                            </div>
                        ) : filteredList.length === 0 ? (
                            <div className="text-center py-20 text-gray-500">
                                {searchQuery ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#F2AF29" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-70">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                            <path d="M8 11h6"></path>
                                        </svg>
                                        <p className="text-lg mb-3">No se encontraron resultados para "<span className="font-medium text-amber-600">{searchQuery}</span>"</p>
                                    </>
                                ) : (
                                    <p className="text-lg">No se encontraron sistemas de juego</p>
                                )}
                                {searchQuery && (
                                    <p className="mt-2">
                                        Intenta con otra búsqueda o{" "}
                                        <Button
                                            variant="light" 
                                            onClick={() => setSearchQuery("")}
                                            className="px-3 py-1 font-medium transition-transform duration-200 transform hover:scale-105"
                                            style={{ 
                                                color: '#F2AF29',
                                                borderBottom: '2px solid #F2AF29'
                                            }}
                                        >
                                            Ver todos
                                        </Button>
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredList.map((system) => (
                                    <Card 
                                        key={system.sju_id} 
                                        isPressable 
                                        className="hover:shadow-lg transition-shadow duration-300 border border-gray-100 card"
                                        radius="lg"
                                        onClick={() => navigate('/SystemGameElement/' + system.sju_id)}
                                    >
                                        <CardBody className="p-5">
                                            <div className="flex items-start gap-4">
                                                <div className="h-14 w-14 flex items-center justify-center rounded-full text-white text-xl font-bold shadow-md" 
                                                    style={{ 
                                                        backgroundColor: '#F2AF29',
                                                        border: '2px solid white',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                                                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(242, 175, 41, 0.3)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                                                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                                                    }}>
                                                    {system.sju_nombre.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{system.sju_nombre}</h2>
                                                    <p className="text-gray-600 text-sm line-clamp-2" style={{ 
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}>{system.sju_descripcion}</p>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


export default SystemsGameList;