// src/app/components/contactanos.js

"use client";

import { useRouter } from "next/navigation";

export default function Contactanos() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/'); // Redirige a la página principal
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <div className="flex-grow flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
          <h2 className="text-2xl font-bold mb-4">Contáctanos</h2>
          <p className="text-gray-700 mb-6">
            ¿Está interesado en promover su negocio colombiano en la comunidad latina de forma gratuita o tiene otra inquietud? 
            Envíenos un correo electrónico a <a href="mailto:barriocolombianousa@gmail.com" className="text-blue-500 underline">barriocolombianousa@gmail.com</a>
          </p>
        </div>
      </div>
      <footer className="bg-gray-200 py-4 text-center">
        <button
          onClick={handleGoHome}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Volver a la página principal
        </button>
      </footer>
    </div>
  );
}
