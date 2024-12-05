// app/components/detalles/[id]/page.js

"use client";

import { Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MapPin, Phone, Globe, Facebook, Instagram, Youtube, MessageSquare, FileText, Tag, Map } from 'lucide-react';
import Image from "next/image";
import LOGO from "../../../../images/logo.png";

export default function BusinessDetails() {
  const router = useRouter();
  const { id } = useParams();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("ID recibido:", id);
    if (id) {
      console.log("Haciendo fetch de los datos del negocio...");
      fetch(`/api/businesses/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch business data');
          }
          return response.json();
        })
        .then((data) => {
          console.log("Datos del negocio recibidos:", data);
          setBusiness(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching business data:', err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id]);

  const handleClick = () => {
    router.push('/components/contactanos');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 md:p-8">
        <div className="flex flex-col items-center">
          <div className="border-t-4 border-indigo-600 border-solid w-16 h-16 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 md:p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
          >
            Volver a la página principal
          </button>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 md:p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Negocio no encontrado</h2>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
          >
            Volver a la página principal
          </button>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="relative bg-gradient-to-r from-[#FFD700] to-[#003893] p-4 flex justify-between items-center">
          {/* Logo */}
          <div>
            <Image src={LOGO} alt="Logo" width={100} height={50} />
          </div>
          {/* Botón de regresar */}
          <button
            onClick={() => router.push('/')}
            className="ml-2 px-4 py-2 bg-[#fad039] text-white font-semibold rounded-md hover:bg-blue-800"
          >
            Página Principal
          </button>
        </header>

        <div className="flex-grow p-4 sm:p-6 md:p-8">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            {business.picture && (
              <Image
                src={business.picture}
                alt={business.name}
                width={800}
                height={400}
                className="w-full h-60 object-cover"
              />
            )}
            <div className="p-6">
              <h1 className="text-indigo-800 text-4xl font-extrabold mb-4">
                {business.name}
              </h1>
              <p className="text-gray-800 text-lg mb-6 flex items-start">
                <FileText size={20} className="mr-3 text-indigo-600" />
                <span>
                  <span className="font-medium">Descripción:</span>{" "}
                  {business.description}
                </span>
              </p>
              <div className="space-y-4 text-gray-700 text-lg">
                {business.phoneNumber && (
                  <p className="flex items-center">
                    <Phone size={20} className="mr-3 text-indigo-600" />
                    <span className="font-medium">Teléfono:</span>{" "}
                    {business.phoneNumber}
                  </p>
                )}
               {business.whatsappNumber && (
  <p className="flex items-center">
    <MessageSquare size={20} className="mr-3 text-green-600" />
    <a
      href={
        business.whatsappNumber.includes("https://api.whatsapp.com/send/?")
          ? `https://wa.me/${business.whatsappNumber.match(/phone=([0-9]+)/)[1]}` // Extrae el número de teléfono de la URL
          : `https://wa.me/${business.whatsappNumber}` // Si ya es solo un número
      }
      target="_blank"
      rel="noopener noreferrer"
      className="text-green-600 hover:underline"
    >
      WhatsApp: {
        business.whatsappNumber.includes("https://api.whatsapp.com/send/?")
          ? business.whatsappNumber.match(/phone=([0-9]+)/)[1] // Muestra solo el número
          : business.whatsappNumber.replace("https://wa.me/", "") // Si es solo un número
      }
    </a>
  </p>
)}



                {business.address && (
                  <p className="flex items-center">
                    <MapPin size={20} className="mr-3 text-indigo-600" />
                    <span className="font-medium">Dirección:</span>{" "}
                    {business.address}
                  </p>
                )}
                {business.googleMapsLink && (
                  <a
                    href={business.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-indigo-700 hover:text-indigo-900 transition duration-300"
                  >
                    <Map size={20} className="mr-3 text-indigo-600" />
                    <span className="font-medium">Ver en Google Maps</span>
                  </a>
                )}
                {business.category && (
                  <p className="flex items-center">
                    <Tag size={20} className="mr-3 text-indigo-600" />
                    <span className="font-medium">Categoría:</span>{" "}
                    {business.category}
                  </p>
                )}
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between mt-6 border-t border-gray-300 pt-6">
                <div className="flex space-x-4 mb-4 md:mb-0">
                  {business.website && (
                    <a
                      href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#003893] transition duration-300"
                    >
                      <Globe size={24} />
                    </a>
                  )}
                  {business.facebook && (
                    <a
                      href={business.facebook.startsWith('http') ? business.facebook : `https://${business.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-700 transition duration-300"
                    >
                      <Facebook size={24} />
                      <span className="sr-only">Facebook</span>
                    </a>
                  )}
                  {business.instagram && (
                    <a
                      href={business.instagram.startsWith('http') ? business.instagram : `https://${business.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-pink-700 transition duration-300"
                    >
                      <Instagram size={24} />
                      <span className="sr-only">Instagram</span>
                    </a>
                  )}
                  {business.youtube && (
                    <a
                      href={business.youtube.startsWith('http') ? business.youtube : `https://${business.youtube}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-red-700 transition duration-300"
                    >
                      <Youtube size={24} />
                      <span className="sr-only">YouTube</span>
                    </a>
                  )}
                </div>
                <button
                  onClick={() => router.back()}
                  className="bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 transition duration-300"
                >
                  Regresar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-[#5682b0] to-[#121d2e] text-white py-4">
          <div className="container mx-auto flex justify-center">
            <button
              onClick={handleClick}
              className="ml-2 px-4 py-2 bg-[#FFD700] text-white font-semibold rounded-md hover:bg-blue-800"
            >
              Contáctanos
            </button>
          </div>
        </footer>
      </div>
    </Suspense>
  );
}
