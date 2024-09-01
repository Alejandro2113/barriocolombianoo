"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from "next/navigation";
import { MapPin, Phone, Globe, Facebook, Instagram, MessageSquare, Youtube } from 'lucide-react';
import ClipLoader from 'react-spinners/ClipLoader';
import Image from "next/image";
import LOGO from "../../../images/logo.png";

function SearchResultsContent() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `/api/businesses/search?query=${encodeURIComponent(query)}`
          );
          if (response.ok) {
            const data = await response.json();
            setBusinesses(data);
          } else {
            console.error("Error fetching search results:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching search results:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchResults();
    }
  }, [query]);

  const handleCardClick = (id) => {
    window.location.href = `/components/detalles/${id}`;
  };

  const handleClick = () => {
    router.push('/components/contactanos'); // Redirige a la página de contacto
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-[#FFD700] to-[#003893] p-4 flex justify-between items-center">
        {/* Logo */}
        <div>
          <Image src={LOGO} alt="Logo" className="h-12" />
        </div>
        {/* Botón de regresar */}
        <button
          onClick={() => (window.location.href = "/")}
          className="ml-2 px-4 py-2 bg-[#FFD700] text-white font-semibold rounded-md hover:bg-blue-800"
        >
          Regresar a la página principal
        </button>
      </header>

      <div className="p-4 sm:p-6 md:p-8 flex-grow">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-[#003893] text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">Resultados de la Búsqueda</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center space-y-4 p-8 bg-white rounded-lg shadow-md">
              <ClipLoader color="#003893" size={40} />
              <p className="text-[#003893] text-xl font-semibold">Buscando...</p>
            </div>
          ) : businesses.length > 0 ? (
            businesses.map((business) => (
              <div
                key={business.id}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={() => handleCardClick(business.id)}
              >
                {business.picture && (
                  <Image
                    src={business.picture}
                    alt={business.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-[#003893] text-xl font-semibold mb-2">
                    {business.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">
                    <span className="font-medium text-[#003893]">Categoría:</span> {business.category || "No disponible"}
                  </p>
                  <p className="text-gray-700 text-sm mb-3 flex-grow">
                    <span className="font-medium text-[#003893]">Descripción:</span> {business.description}
                  </p>
                  <div className="space-y-1 mb-3 text-sm">
                    {business.phoneNumber && (
                      <p className="flex items-center text-gray-600">
                        <Phone size={16} className="mr-2 text-[#003893]" />
                        {business.phoneNumber}
                      </p>
                    )}
                    {business.whatsappNumber && (
                      <p className="flex items-center text-gray-600">
                        <MessageSquare size={16} className="mr-2 text-[#009347]" />
                        {business.whatsappNumber}
                      </p>
                    )}
                    {business.address && (
                      <p className="flex items-center text-gray-600">
                        <MapPin size={16} className="mr-2 text-[#003893]" />
                        {business.address}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-200">
                    {business.googleMapsLink && (
                      <a
                        href={business.googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#003893] hover:text-indigo-800 transition duration-300"
                      >
                        Ver en Google Maps
                      </a>
                    )}
                    <div className="flex space-x-2">
                      {business.website && (
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-[#003893] transition duration-300"
                        >
                          <Globe size={20} />
                        </a>
                      )}
                      {business.facebook && (
                        <a
                          href={business.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-[#003893] transition duration-300"
                        >
                          <Facebook size={20} />
                        </a>
                      )}
                      {business.instagram && (
                        <a
                          href={business.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-pink-600 transition duration-300"
                        >
                          <Instagram size={20} />
                        </a>
                      )}
                      {business.youtube && (
                        <a
                          href={business.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-red-600 transition duration-300"
                        >
                          <Youtube size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center space-y-4 p-8 bg-white rounded-lg shadow-md">
              <span className="text-[#003893] text-3xl">📭</span>
              <p className="text-[#003893] text-xl font-semibold">No se encontraron negocios que coincidan con tu búsqueda.</p>
            </div>
          )}
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
  );
}

export default function SearchResultsWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
