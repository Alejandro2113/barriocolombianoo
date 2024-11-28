"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    picture: null,
    description: "",
    whatsappNumber: "",
    website: "",
    facebook: "",
    instagram: "",
    category: "",
    googleMapsLink: "",
    featured: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const categories = [
    "Salud", "Electrónica", "Restaurante", "Alquiler", "Real Estate", "Mascotas",
    "Tienda", "Ayuda Legal", "Peluquería", "Servicios Profesionales", "Deportes",
    "Educación", "Transporte", "Viajes", "Moda", "Tecnología", "Arte y Cultura",
    "Gastronomía", "Entretenimiento", "Belleza", "Inmuebles", "Bienes Raíces",
    "Turismo", "Consultoría",
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "picture" && formData[key]) {
          formDataToSend.append("picture", formData[key]);
        } else if (key !== "picture") {
          formDataToSend.append(key, formData[key].toString());
        }
      });

      const response = await fetch("/api/buisnessClient", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear el negocio");
      }

      const result = await response.json();
      alert("Negocio registrado exitosamente");
      router.push("/components/search");
    } catch (error) {
      alert(error.message || "Error al registrar el negocio");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col">
      {/* Banner */}
      <div className="relative bg-gradient-to-r from-[#FFD700] to-[#003893] text-white text-center py-12">
        <h1 className="text-4xl font-bold mt-10">Bienvenido a Barrio Colombiano</h1>
        <p className="mt-2 text-lg">Descubre negocios colombianos cerca de ti.</p>
      </div>

      {/* Business Form */}
      <div className="px-4 py-6 bg-gray-100 rounded-md max-w-4xl mx-auto">
        <h3 className="text-black text-2xl font-bold mb-4 text-center">
          Completa los datos de tu negocio
        </h3>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="text-black grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {/* Nombre */}
            <div className="flex flex-col">
              <label htmlFor="name" className="mb-2 font-semibold">
                Nombre del negocio *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="p-2 border border-gray-300 rounded"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            {/* Imagen */}
            <div className="flex flex-col">
              <label htmlFor="picture" className="mb-2 font-semibold">
                Imagen del negocio
              </label>
              <input
                type="file"
                id="picture"
                name="picture"
                accept="image/*"
                className="p-2 border border-gray-300 rounded"
                onChange={handleInputChange}
              />
            </div>

            {/* Descripción */}
            <div className="flex flex-col sm:col-span-2">
              <label htmlFor="description" className="mb-2 font-semibold">
                Descripción *
              </label>
              <textarea
                id="description"
                name="description"
                required
                className="p-2 border border-gray-300 rounded"
                rows="4"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            

            {/* WhatsApp */}
            <div className="flex flex-col">
              <label htmlFor="whatsappNumber" className="mb-2 font-semibold">
                WhatsApp
              </label>
              <input
                type="tel"
                id="whatsappNumber"
                name="whatsappNumber"
                className="p-2 border border-gray-300 rounded"
                value={formData.whatsappNumber}
                onChange={handleInputChange}
              />
            </div>

            {/* Sitio Web */}
            <div className="flex flex-col">
              <label htmlFor="website" className="mb-2 font-semibold">
                Sitio Web
              </label>
              <input
                type="url"
                id="website"
                name="website"
                className="p-2 border border-gray-300 rounded"
                value={formData.website}
                onChange={handleInputChange}
              />
            </div>

            {/* Facebook */}
            <div className="flex flex-col">
              <label htmlFor="facebook" className="mb-2 font-semibold">
                Facebook
              </label>
              <input
                type="url"
                id="facebook"
                name="facebook"
                className="p-2 border border-gray-300 rounded"
                value={formData.facebook}
                onChange={handleInputChange}
              />
            </div>

            {/* Instagram */}
            <div className="flex flex-col">
              <label htmlFor="instagram" className="mb-2 font-semibold">
                Instagram
              </label>
              <input
                type="url"
                id="instagram"
                name="instagram"
                className="p-2 border border-gray-300 rounded"
                value={formData.instagram}
                onChange={handleInputChange}
              />
            </div>

            
            
            {/* Google Maps */}
            <div className="flex flex-col">
              <label htmlFor="googleMapsLink" className="mb-2 font-semibold">
                Link de Google Maps
              </label>
              <input
                type="url"
                id="googleMapsLink"
                name="googleMapsLink"
                className="p-2 border border-gray-300 rounded"
                value={formData.googleMapsLink}
                onChange={handleInputChange}
              />
            </div>

            {/* Categoría */}
            <div className="flex flex-col">
              <label htmlFor="category" className="mb-2 font-semibold">
                Categoría *
              </label>
              <select
                id="category"
                name="category"
                required
                className="p-2 border border-gray-300 rounded"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Seleccione una categoría
                </option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Destacado */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                className="mr-2"
                checked={formData.featured}
                onChange={handleInputChange}
              />
              <label htmlFor="featured" className="font-semibold">
                Destacar negocio
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FFD700] text-white font-semibold py-2 rounded hover:bg-[#FFB700] disabled:bg-gray-400"
          >
            {isSubmitting ? "Enviando..." : "Registrar Negocio"}
          </button>
        </form>
      </div>

      <footer className="bg-gradient-to-r from-[#5682b0] to-[#121d2e] text-white py-4 mt-auto">
        <div className="container mx-auto flex justify-center">
          <button
            onClick={() => router.push("/components/contactanos")}
            className="px-4 py-2 bg-[#FFD700] text-white font-semibold rounded-md hover:bg-[#FFB700]"
          >
            Contáctanos
          </button>
        </div>
      </footer>
    </div>
  );
}
