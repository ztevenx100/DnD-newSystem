import React from 'react'

import { Card, CardBody } from "@nextui-org/react"
import "@unocss/reset/tailwind.css"
import "uno.css"
import "./ErrorPage.css"


const ErrorPage: React.FC = () => {


    return (
        <>
        <section className="min-h-screen grid grid-cols-1 grid-rows-6 gap-x-0 gap-y-4 py-4 mb-3">
            <header className='bg-white shadow-lg rounded py-2 grid items-center'>
                <h1 className='title-list'>Pagina no encontrada</h1>
            </header>
            <Card className="w-full px-10 py-5 row-span-6" >
                <CardBody>
                    <p></p>
                </CardBody>
            </Card>
        </section>
        </>
    );
}

export default ErrorPage