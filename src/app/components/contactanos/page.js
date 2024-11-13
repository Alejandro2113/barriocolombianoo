"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import LOGO from "../../../images/logo.png";

export default function Home() {
  const [businesses, setBusinesses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch("/api/businesses");
        const data = await response.json();
        // Mostrar todos los negocios sin importar si están destacados
        setBusinesses(data);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      }
    };
    fetchBusinesses();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/components/search?query=${encodeURIComponent(searchQuery)}`);
  };

  const handleBusinessClick = (id) => {
    router.push(`/components/detalles/${id}`);
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col">
      {/* Banner */}
      <div className="relative bg-gradient-to-r from-[#FFD700] to-[#003893] text-white text-center py-12">
        <Image src={LOGO} alt="Logo" className="absolute top-4 left-5 h-35" />
        <h1 className="text-4xl font-bold text-[#fff] mt-10">Bienvenido a Barrio Colombiano</h1>
        <p className="mt-2 text-lg text-white">Descubre negocios colombianos cerca de ti y haz crecer el tuyo.</p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mt-6 flex justify-center">
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-black px-4 py-2 w-2/3 md:w-1/3 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-[#FFD700] text-white font-semibold rounded-md hover:bg-blue-800"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Businesses List (Craigslist Style) */}
      <div className="pt-6 px-4 py-8 flex-grow bg-white">
        <h2 className="text-[#003893] text-3xl font-bold mb-6 text-center">Negocios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {businesses.map((business) => (
            <div
              key={business.id}
              className="bg-white p-4 rounded-lg shadow border border-gray-300 cursor-pointer relative"
              onClick={() => handleBusinessClick(business.id)}
            >
              <h3 className="text-[#003893] text-xl font-semibold mb-2">{business.name}</h3>
              <p className="text-gray-700 mb-1">
                <strong>Categoría:</strong> {business.category}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Teléfono:</strong> {business.phoneNumber || 'No disponible'}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Dirección:</strong> {business.address || 'No disponible'}
              </p>
              {business.website ? (
                <a
                  href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#003893] hover:underline"
                >
                  Visita su sitio web
                </a>
              ) : (
                <p className="text-gray-600">Sitio web no disponible</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#5682b0] to-[#121d2e] text-white py-4">
        <div className="container mx-auto flex justify-center">
          <button
            onClick={() => router.push('/components/contactanos')}
            className="px-4 py-2 bg-[#FFD700] text-white font-semibold rounded-md hover:bg-blue-800"
          >
            Contáctanos
          </button>
        </div>
      </footer>
    </div>
  );
}
