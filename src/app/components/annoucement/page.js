"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const router = useRouter();

  // Categorías quemadas
  const categories = [
    "Salud",
    "Electrónica",
    "Restaurante",
    "Alquiler",
    "Real Estate",
    "Mascotas",
    "Tienda",
    "Ayuda Legal",
    "Peluquería",
    "Servicios Profesionales",
    "Deportes",
    "Educación",
    "Transporte",
    "Viajes",
    "Moda",
    "Tecnología",
    "Arte y Cultura",
    "Gastronomía",
    "Entretenimiento",
    "Belleza",
    "Inmuebles",
    "Bienes Raíces",
    "Turismo",
    "Consultoría",
  ];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (selectedCategory) {
      // Redirigir con la categoría seleccionada
      router.push(`/components/search?query=${encodeURIComponent(selectedCategory)}`);
    }
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col">
      {/* Banner */}
      <div className="relative bg-gradient-to-r from-[#FFD700] to-[#003893] text-white text-center py-12">
        <h1 className="text-4xl font-bold text-[#fff] mt-10">Bienvenido a Barrio Colombiano</h1>
        <p className="mt-2 text-lg text-white">Descubre negocios colombianos cerca de ti.</p>
      </div>

      {/* Categories Selection */}
      <div className="pt-6 px-4 py-4 bg-white">
        <h2 className="text-[#003893] text-3xl font-bold mb-4 text-center">Selecciona una categoría</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`relative border-2 border-transparent p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                selectedCategory === category ? "bg-[#FFD700] border-[#003893]" : "hover:bg-[#f1f1f1]"
              }`}
            >
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={selectedCategory === category}
                  onChange={() => handleCategoryChange(category)}
                  className="text-[#003893] accent-[#FFD700] focus:ring-2 focus:ring-[#003893]"
                />
                <span
                  className={`text-lg font-semibold ${
                    selectedCategory === category ? "text-[#003893]" : "text-black"
                  }`}
                >
                  {category}
                </span>
              </label>
            </div>
          ))}
        </div>

        {/* Mostrar mensaje si no hay categoría seleccionada */}
        {!selectedCategory && (
          <p className="text-center text-gray-500">Por favor, selecciona una categoría.</p>
        )}
      </div>

      {/* Button to Search */}
      <div className="px-4 py-4 bg-white flex justify-center">
        <button
          onClick={handleSearch}
          disabled={!selectedCategory}
          className={`px-6 py-2 bg-[#FFD700] text-white font-semibold rounded-md hover:bg-blue-800 ${!selectedCategory ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Buscar negocios
        </button>
      </div>

      <div className="px-4 py-4 bg-white flex justify-center">
        <button
          onClick={handleSearch}
          disabled={!selectedCategory}
          className={`px-6 py-2 bg-[#FFD700] text-white font-semibold rounded-md hover:bg-blue-800 ${!selectedCategory ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Siguiente
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#5682b0] to-[#121d2e] text-white py-4">
        <div className="container mx-auto flex justify-center">
          <button
            onClick={() => router.push("/components/contactanos")}
            className="px-4 py-2 bg-[#FFD700] text-white font-semibold rounded-md hover:bg-blue-800"
          >
            Contáctanos
          </button>
        </div>
      </footer>
    </div>
  );
}
