"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import LOGO from "../images/logo.png";

export default function Home() {
  const [businesses, setBusinesses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch("/api/businesses");
        const data = await response.json();
        // Filtrar solo los negocios destacados que tengan todos los campos requeridos
        const featuredBusinesses = data.filter(business => 
          business.featured && business.phoneNumber && business.address && business.website
        );
        // Ordenar los negocios destacados
        const sortedBusinesses = featuredBusinesses.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        setBusinesses(sortedBusinesses);
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

  const handleClick = () => {
    router.push('/components/contactanos');
  };

  const handleBusinessClick = (id) => {
    router.push(`/components/detalles/${id}`);
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col">
      {/* Banner */}
      <div className="relative bg-gradient-to-r from-[#FFD700] to-[#003893] text-white text-center py-12">
        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col items-center absolute top-4 left-0 right-0">
          <Image src={LOGO} alt="Logo" className="h-20" />
          <button
            onClick={handleClick}
            className="mt-3 px-5 py-2 bg-white text-[#003893] font-semibold rounded-lg shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#003893]"
          >
            Publica tu negocio gratis
          </button>
        </div>
        
        {/* iPad Layout */}
        <div className="hidden md:flex lg:hidden flex-col items-center absolute top-0 left-4 right-4">
          <Image src={LOGO} alt="Logo" className="h-20" />
          <button
            onClick={handleClick}
            className="mt-3 px-5 py-2 bg-white text-[#003893] font-semibold rounded-lg shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#003893]"
          >
            Publica tu negocio gratis
          </button>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <Image src={LOGO} alt="Logo" className="absolute top-4 left-5 h-35" />
          <button
            onClick={handleClick}
            className="absolute top-4 right-4 px-6 py-3 bg-white text-[#003893] font-semibold rounded-lg shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#003893]"
          >
            Publica tu negocio gratis
          </button>
        </div>
        
        {/* Content */}
        <h1 className="text-4xl font-bold text-[#fff] mt-32 md:mt-24 lg:mt-0">Bienvenido a Barrio Colombiano</h1>
        <p className="mt-2 text-lg text-white">Descubre los mejores negocios colombianos cerca de ti y haz crecer el tuyo.</p>

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

      {/* Carousel */}
      <div className="pt-16 px-4 py-8 flex-grow bg-white">
        <h2 className="text-[#003893] text-3xl font-bold mb-6 text-center">Negocios Destacados</h2>
        <div className="flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6 justify-center">
          {businesses.slice(0, 3).map((business) => (
            <div
              key={business.id}
              className="bg-white p-6 rounded-lg shadow-lg w-full md:w-64 border border-[#FFD700] cursor-pointer relative"
              onClick={() => handleBusinessClick(business.id)}
            >
              {business.featured && (
                <span className="absolute top-2 right-2 px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded-full">
                  Destacado
                </span>
              )}
              {business.picture && (
                <Image
                  src={business.picture}
                  alt={business.name}
                  width={400}
                  height={320}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-[#003893] text-xl font-semibold mb-2">{business.name}</h3>
              <p className="text-gray-700 mb-2">
                <strong>Categoría:</strong> {business.category}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Teléfono:</strong> {business.phoneNumber || 'No disponible'}
              </p>
              <p className="text-gray-600 mb-2">
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
