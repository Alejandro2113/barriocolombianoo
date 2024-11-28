"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [businessFormData, setBusinessFormData] = useState({
    name: "",
    picture: null,
    description: "",
    whatsappNumber: "",
    website: "",
    facebook: "",
    instagram: "",
    category: "",
    googleMapsLink: "",
    featured: true,
  });
  const [adFormData, setAdFormData] = useState({
    title: "",
    image: null,
    description: "",
    contact: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [showAdForm, setShowAdForm] = useState(false);
  const router = useRouter();

  const categories = [
    "Salud", "Electrónica", "Restaurante", "Alquiler", "Real Estate", "Mascotas",
    "Tienda", "Ayuda Legal", "Peluquería", "Servicios Profesionales", "Deportes",
    "Educación", "Transporte", "Viajes", "Moda", "Tecnología", "Arte y Cultura",
    "Gastronomía", "Entretenimiento", "Belleza", "Inmuebles", "Bienes Raíces",
    "Turismo", "Consultoría", "Alquiler",
  ];

  const handleBusinessInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setBusinessFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setBusinessFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleAdInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setAdFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setAdFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleBusinessSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(businessFormData).forEach((key) => {
        if (key === "picture" && businessFormData[key]) {
          formDataToSend.append("picture", businessFormData[key]);
        } else if (key !== "picture") {
          formDataToSend.append(key, businessFormData[key].toString());
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

      alert("Negocio registrado exitosamente");
      router.push("/components/search");
    } catch (error) {
      alert(error.message || "Error al registrar el negocio");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(adFormData).forEach((key) => {
        if (key === "image" && adFormData[key]) {
          formDataToSend.append("image", adFormData[key]);
        } else if (key !== "image") {
          formDataToSend.append(key, adFormData[key].toString());
        }
      });

      const response = await fetch("/api/annoucementClient", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear el anuncio");
      }

      alert("Anuncio registrado exitosamente");
      router.push("/components/search");
    } catch (error) {
      alert(error.message || "Error al registrar el anuncio");
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
      {/* Botones centrados */}
      {!showBusinessForm && !showAdForm && (
        <div className="absolute inset-0 flex justify-center items-center space-x-6">
          <button
            onClick={() => setShowBusinessForm(true)}
            className="px-6 py-3 bg-[#FFD700] text-white font-semibold rounded-md hover:bg-[#FFB700]"
          >
            Publicar negocio
          </button>
          <button
            onClick={() => setShowAdForm(true)}
            className="px-6 py-3 bg-[#FFD700] text-white font-semibold rounded-md hover:bg-[#FFB700]"
          >
            Publicar anuncio
          </button>
        </div>
      )}

      
      {/* Formulario de negocio */}
{showBusinessForm && (
  <div className="text-black px-4 py-6 bg-gray-100 rounded-md max-w-4xl mx-auto">
    <h2 className="text-2xl font-bold mb-4 text-center">Registrar Negocio</h2>
    <form onSubmit={handleBusinessSubmit} encType="multipart/form-data">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nombre */}
        <div className="mb-4">
          <label htmlFor="name" className="block font-medium mb-1">
            Nombre del negocio
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={businessFormData.name}
            onChange={handleBusinessInputChange}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Imagen */}
        <div className="mb-4">
          <label htmlFor="picture" className="block font-medium mb-1">
            Imagen del negocio
          </label>
          <input
            type="file"
            id="picture"
            name="picture"
            onChange={handleBusinessInputChange}
            accept="image/*"
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Descripción */}
        <div className="mb-4 sm:col-span-2">
          <label htmlFor="description" className="block font-medium mb-1">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={businessFormData.description}
            onChange={handleBusinessInputChange}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          ></textarea>
        </div>

        {/* Número de WhatsApp */}
        <div className="mb-4">
          <label htmlFor="whatsappNumber" className="block font-medium mb-1">
            Número de WhatsApp
          </label>
          <input
            type="text"
            id="whatsappNumber"
            name="whatsappNumber"
            value={businessFormData.whatsappNumber}
            onChange={handleBusinessInputChange}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Página web */}
        <div className="mb-4">
          <label htmlFor="website" className="block font-medium mb-1">
            Página Web
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={businessFormData.website}
            onChange={handleBusinessInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Redes sociales */}
        <div className="mb-4">
          <label htmlFor="facebook" className="block font-medium mb-1">
            Facebook
          </label>
          <input
            type="url"
            id="facebook"
            name="facebook"
            value={businessFormData.facebook}
            onChange={handleBusinessInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="instagram" className="block font-medium mb-1">
            Instagram
          </label>
          <input
            type="url"
            id="instagram"
            name="instagram"
            value={businessFormData.instagram}
            onChange={handleBusinessInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Categoría */}
        <div className="mb-4">
          <label htmlFor="category" className="block font-medium mb-1">
            Categoría
          </label>
          <select
            id="category"
            name="category"
            value={businessFormData.category}
            onChange={handleBusinessInputChange}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Seleccione una categoría</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Google Maps */}
        <div className="mb-4">
          <label htmlFor="googleMapsLink" className="block font-medium mb-1">
            Enlace de Google Maps
          </label>
          <input
            type="url"
            id="googleMapsLink"
            name="googleMapsLink"
            value={businessFormData.googleMapsLink}
            onChange={handleBusinessInputChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        
      </div>

      {/* Botones */}
      <div className="flex justify-center space-x-4 mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#FFD700] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#FFB700] disabled:bg-gray-400"
        >
          {isSubmitting ? "Enviando..." : "Registrar Negocio"}
        </button>
        <button
          onClick={() => setShowBusinessForm(false)}
          className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-md hover:bg-gray-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
)}


      {/* Formulario de anuncio */}
      {showAdForm && (
        <div className="px-4 py-6 text-black bg-gray-100 rounded-md max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-center">Registrar Anuncio</h2>

          {/* Contenido del formulario */}
          <form onSubmit={handleAdSubmit} encType="multipart/form-data">
  {/* Nombre */}
  <div className="mb-4">
    <label htmlFor="name" className="block font-medium mb-1">
      Nombre del anuncio
    </label>
    <input
      type="text"
      id="name"
      name="name"
      value={adFormData.name}
      onChange={handleAdInputChange}
      required
      className="w-full border border-gray-300 rounded-md p-2"
    />
  </div>

  {/* Imagen */}
  <div className="mb-4">
    <label htmlFor="picture" className="block font-medium mb-1">
      Imagen del anuncio
    </label>
    <input
      type="file"
      id="picture"
      name="picture"
      onChange={handleAdInputChange}
      accept="image/*"
      required
      className="w-full border border-gray-300 rounded-md p-2"
    />
  </div>

  {/* Descripción */}
  <div className="mb-4">
    <label htmlFor="description" className="block font-medium mb-1">
      Descripción
    </label>
    <textarea
      id="description"
      name="description"
      value={adFormData.description}
      onChange={handleAdInputChange}
      required
      className="w-full border border-gray-300 rounded-md p-2"
    ></textarea>
  </div>

  {/* Teléfono */}
  <div className="mb-4">
    <label htmlFor="phone" className="block font-medium mb-1">
      Teléfono
    </label>
    <input
      type="text"
      id="phone"
      name="phone"
      value={adFormData.phone}
      onChange={handleAdInputChange}
      className="w-full border border-gray-300 rounded-md p-2"
    />
  </div>

  {/* Categoría */}
  <div className="mb-4">
    <label htmlFor="category" className="block font-medium mb-1">
      Categoría
    </label>
    <select
      id="category"
      name="category"
      value={adFormData.category}
      onChange={handleAdInputChange}
      required
      className="w-full border border-gray-300 rounded-md p-2"
    >
      <option value="" disabled>
        Selecciona una categoría
      </option>
      <option value="Tecnología">Tecnología</option>
      <option value="Inmuebles">Inmuebles</option>
      <option value="Automóviles">Automóviles</option>
    </select>
  </div>

  {/* Contacto */}
  <div className="mb-4">
    <label htmlFor="contact" className="block font-medium mb-1">
      Información de contacto
    </label>
    <input
      type="text"
      id="contact"
      name="contact"
      value={adFormData.contact}
      onChange={handleAdInputChange}
      required
      className="w-full border border-gray-300 rounded-md p-2"
    />
  </div>

  {/* Botones */}
  <div className="flex justify-center space-x-4">
    <button
      type="submit"
      disabled={isSubmitting}
      className="bg-[#FFD700] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#FFB700] disabled:bg-gray-400"
    >
      {isSubmitting ? "Enviando..." : "Registrar Anuncio"}
    </button>
    <button
      type="button"
      onClick={() => setShowAdForm(false)}
      className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-md hover:bg-gray-300"
    >
      Cancelar
    </button>
  </div>
</form>


        </div>
      )}

      {/* Footer */}
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
