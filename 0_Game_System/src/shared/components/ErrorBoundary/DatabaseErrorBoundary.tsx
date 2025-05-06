import React from 'react';
import { useRouteError } from 'react-router-dom';
import { Card, CardBody, Button } from "@nextui-org/react";

const DatabaseErrorBoundary: React.FC = () => {
  const error = useRouteError() as any;
  
  // Extract error details from the error object
  const errorMessage = error?.message || "Unknown database error";
  const errorCode = error?.code || "";
  const errorDetail = error?.details || "";

  return (
    <section className="min-h-screen w-full px-4 py-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-[1200px] mx-auto">
        <header className="bg-white shadow-lg rounded-lg py-6 mb-8">
          <h1 className="text-3xl font-bold uppercase text-center text-gray-800">
            Error de Base de Datos
          </h1>
        </header>
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
          <CardBody className="p-6 md:p-8">
            <div className="rounded-lg bg-red-50 p-6 border border-red-200 mb-6">
              <h2 className="text-xl font-semibold text-red-700 mb-3">
                Ocurrió un error en la base de datos
              </h2>
              <p className="text-gray-800 mb-2">
                Lo sentimos, ha ocurrido un error al acceder a la base de datos.
              </p>
              <div className="bg-white rounded p-4 my-4 font-mono text-sm overflow-auto">
                <p><span className="font-semibold">Error:</span> {errorMessage}</p>
                {errorCode && <p><span className="font-semibold">Código:</span> {errorCode}</p>}
                {errorDetail && <p><span className="font-semibold">Detalle:</span> {errorDetail}</p>}
              </div>
              <p className="text-gray-700 mt-4">
                Si el problema persiste, contacte al administrador del sistema.
              </p>
            </div>
            <div className="flex justify-center mt-4">
              <Button 
                color="primary"
                className="font-semibold"
                size="lg"
                onClick={() => window.location.href = '/'}
              >
                Volver al inicio
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </section>
  );
};

export default DatabaseErrorBoundary;