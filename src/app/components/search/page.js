"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Phone, MessageSquare, Globe, Facebook, Instagram, Youtube } from "lucide-react";

import ClipLoader from "react-spinners/ClipLoader";
import Image from "next/image";
import LOGO from "../../../images/logo.png";

function SearchResultsContent() {
  const [results, setResults] = useState({ businesses: [], ads: [] });
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
            setResults(data);
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

  const handleCardClick = (id, type) => {
    const path = type === "business" ? "detalles" : "detallesA";
    window.location.href = `/components/${path}/${id}`;
  };

  const truncateDescription = (text, length = 150) => {
    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-[#FFD700] to-[#003893] p-4 flex justify-between items-center">
        <div>
          <Image src={LOGO} alt="Logo" className="h-12" />
        </div>
        <button
          onClick={() => (window.location.href = "/")}
          className="ml-2 px-4 py-2 bg-[#FFD700] text-white font-semibold rounded-md hover:bg-blue-800"
        >
          Regresar a la página principal
        </button>
      </header>

      <div className="p-4 sm:p-6 md:p-8 flex-grow">
        <h1 className="text-[#003893] text-2xl sm:text-3xl font-bold mb-4">
          Resultados de la Búsqueda
        </h1>
        {loading ? (
          <div className="flex items-center justify-center">
            <ClipLoader color="#003893" size={40} />
          </div>
        ) : (
          <>
            {/* Businesses */}
            <h2 className="text-xl font-semibold text-[#003893] mb-4">Negocios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {results.businesses.map((business) => (
                <div
                  key={business.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-300"
                  onClick={() => handleCardClick(business.id, "business")}
                >
                  {business.picture && (
                    <Image
                      width={400}
                      height={350}
                      src={business.picture}
                      alt={business.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-[#003893] mb-2">
                      {business.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      <strong>Descripción:</strong> {business.description}
                    </p>

                    {/* Información de Contacto */}
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone size={16} className="mr-2 text-[#003893]" />
                        <span>
                          <strong>Teléfono:</strong>{" "}
                          {business.phoneNumber || "No disponible"}
                        </span>
                      </div>

                      {/* WhatsApp */}
                      {business.whatsappNumber && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MessageSquare size={16} className="mr-2 text-green-600" />
                          <span>
                            <strong>WhatsApp:</strong>
                            <a
                              href={
                                business.whatsappNumber.startsWith("https://wa.me/")
                                  ? business.whatsappNumber // Si ya es un link completo
                                  : `https://wa.me/${business.whatsappNumber}` // Si es solo un número
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:underline"
                            >
                              {business.whatsappNumber.startsWith("https://wa.me/")
                                ? business.whatsappNumber.replace("https://wa.me/", "") // Extrae el número si es un link
                                : business.whatsappNumber}
                            </a>
                          </span>
                        </div>
                      )}

                      {/* Otras redes sociales */}
                      <div className="flex space-x-3 text-gray-600">
                        {business.website && (
                          <a
                            href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#003893]"
                          >
                            <Globe size={20} />
                          </a>
                        )}
                        {business.facebook && (
                          <a
                            href={business.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#003893]"
                          >
                            <Facebook size={20} />
                          </a>
                        )}
                        {business.instagram && (
                          <a
                            href={business.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#D9507A]"
                          >
                            <Instagram size={20} />
                          </a>
                        )}
                        {business.youtube && (
                          <a
                            href={business.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-red-600"
                          >
                            <Youtube size={20} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ads */}
            <h2 className="text-xl font-semibold text-[#003893] mb-4">Anuncios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.ads.map((ad) => (
                <div
                  key={ad.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-300"
                  onClick={() => handleCardClick(ad.id, "ad")}
                >
                  {ad.picture && (
                    <Image
                      width={400}
                      height={350}
                      src={ad.picture}
                      alt={ad.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-[#003893] mb-2">
                      {ad.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      <strong>Categoría:</strong> {ad.category}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      <strong>Ubicación:</strong>  {ad.city || "Ciudad no disponible"}
                     
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      {truncateDescription(ad.description)}
                    </p>
                    
                    <button className="text-[#003893] mt-2">Mostrar más</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#5682b0] to-[#121d2e] text-white py-4">
        <div className="container mx-auto flex justify-center">
          <button
            onClick={() => (window.location.href = "/contact")}
            className="ml-2 px-4 py-2 bg-[#FFD700] text-white font-semibold rounded-md hover:bg-blue-800"
          >
            Contáctanos
          </button>
        </div>
      </footer>
    </div>
  );
}

export default SearchResultsContent;
