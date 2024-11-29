"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import LOGO from "../images/logo.png";
import { MapPin, Phone, Globe, ArrowUp } from 'lucide-react';
import { X } from 'lucide-react';

export default function Home() {
  const [businesses, setBusinesses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [formType, setFormType] = useState('advertisement'); // 'business' or 'advertisement'

  const [cityLocation, setCityLocation] = useState(null);
  const [locationError, setLocationError] = useState('');


  const categories = [
    "Se Vende",
    "Empleo",
    "Eventos",
    "Se renta apartamento/casa",
    "Promover mi negocio",
  ];

  const router = useRouter();

  const [formData, setFormData] = useState({
    // Campos comunes
    name: "",
    picture: "",
    description: "",
    category: "",
    email: "", // Nuevo campo para correo electrónico
    // Campos específicos de negocios
    phoneNumber: "",
    whatsappNumber: "",
    website: "",
    facebook: "",
    instagram: "",
    youtube: "",
    address: "",
    googleMapsLink: "",
    featured: false,
    // Campos específicos de anuncios
    phone: "",
    contact: "",
    city: "", // Nuevo campo para ciudad
    price: "", // Nuevo campo para precio

  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/components/search?query=${encodeURIComponent(searchQuery)}`);
  };


  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch("/api/businesses");
        const data = await response.json();
        const featuredBusinesses = data.filter(
          (business) =>
            business.featured && business.phoneNumber && business.address && business.website
        );
        const sortedBusinesses = featuredBusinesses.sort(
          (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        );
        setBusinesses(sortedBusinesses);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      }
    };
    fetchBusinesses();

    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const detectCityLocation = async (cityName) => {
    try {
      // Reemplaza 'YOUR_GOOGLE_MAPS_API_KEY' con tu clave de API real
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=AIzaSyCEOpccOqRZyabXPVyYhF4hNxv_czaRz6E`
      );
      
      const data = await response.json();

      if (data.status === 'OK') {
        const location = data.results[0].geometry.location;
        const addressComponents = data.results[0].address_components;

        // Extraer ciudad, región y país
        const cityComponent = addressComponents.find(component => 
          component.types.includes('locality')
        );
        const regionComponent = addressComponents.find(component => 
          component.types.includes('administrative_area_level_1')
        );
        const countryComponent = addressComponents.find(component => 
          component.types.includes('country')
        );

        const detectedLocation = {
          city: cityComponent ? cityComponent.long_name : '',
          region: regionComponent ? regionComponent.long_name : '',
          country: countryComponent ? countryComponent.long_name : '',
          latitude: location.lat,
          longitude: location.lng
        };

        setCityLocation(detectedLocation);
        setFormData(prev => ({
          ...prev,
          city: `${detectedLocation.city}, ${detectedLocation.region}, ${detectedLocation.country}`
        }));
        setLocationError('');
      } else {
        setLocationError('No se pudo encontrar la ubicación');
        setCityLocation(null);
      }
    } catch (error) {
      console.error('Error detectando ubicación:', error);
      setLocationError('Error al detectar la ubicación');
      setCityLocation(null);
    }
  };

  


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "category") {
      // Determina el tipo de formulario según la categoría seleccionada
      const advertisementCategories = [
        "Se Vende",
        "Empleo",
        "Eventos",
        "Se renta apartamento/casa",
      ];
      setFormType(
        value === "Promover mi negocio"
          ? "business"
          : advertisementCategories.includes(value)
            ? "advertisement"
            : "other"
      );
    }

    if (name === 'city') {
      // Iniciar detección de ubicación solo si hay suficientes caracteres
      if (value.length > 2) {
        detectCityLocation(value);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = formType === "business" ? "/api/businesses" : "/api/advertisements";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(
          formType === "business"
            ? "Negocio publicado con éxito!"
            : "Anuncio publicado con éxito!"
        );
        setIsModalOpen(false);
        setFormData({
          name: "",
          picture: "",
          description: "",
          category: "",
          phoneNumber: "",
          whatsappNumber: "",
          website: "",
          facebook: "",
          instagram: "",
          youtube: "",
          address: "",
          googleMapsLink: "",
          featured: false,
          phone: "",
          contact: "",
          city: "",
          price: "",
          email: "",
        });
      } else {
        alert("Error al publicar.");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Ocurrió un error al publicar.");
    }
  };


  // Continuación del componente Home...

  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col">
      {/* Header y otros elementos permanecen igual... */}
      {/* Header */}
      <div className="relative bg-gradient-to-r from-[#FFD700] to-[#003893]">
        <div className="container mx-auto px-4 py-4">
          {/* Logo */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <div className="w-38 md:w-46 lg:w-54">
              <Image
                src={LOGO}
                alt="Logo"
                className="w-full h-auto"
                priority
              />
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center text-white mb-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
              Bienvenido a Barrio Colombiano
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl px-4">
              Donde los colombianos se conectan.
            </p>
          </div>



          {/* Publication Bar */}
          <div className="max-w-3xl mx-auto px-4 pb-4">
            <button
              className="w-full p-3 bg-white bg-opacity-90 rounded-lg text-gray-600 text-left hover:bg-opacity-100 transition-all duration-200 cursor-pointer shadow-sm border border-blue-500"
              onClick={() => setIsModalOpen(true)}
            >
              Publica tu anuncio gratis aquí
            </button>
          </div>

        </div>
      </div>

      {/* Search Bar */}
      <div className="sticky top-0 bg-white z-10 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-6 py-3 rounded-lg text-gray-800 text-base md:text-lg w-full border border-gray-300"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-yellow-400 text-white font-semibold rounded-lg hover:bg-yellow-500 text-base md:text-lg w-full sm:w-auto"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>


      {/* Modal con formulario dinámico */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-gray-100 rounded-2xl shadow-lg w-full max-w-3xl p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-black absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-[#1877F2]">
                {formType === 'business' ? 'Publica tu Negocio' : 'Publica tu Anuncio'}
              </h2>
              <p className="text-base text-gray-600">
                {formType === 'business'
                  ? '¡Haz crecer tu negocio en nuestra comunidad!'
                  : '¡Comparte tu anuncio con la comunidad!'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-black">
              {/* Campos comunes */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {formType === 'business' ? 'Nombre del Negocio' : 'Título del Anuncio'}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg border border-[#ddd] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Categoría</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg border border-[#ddd] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 col-span-2">
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg border border-[#ddd] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg border border-[#ddd] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                  required
                />
              </div>

              {/* Campos específicos para negocios */}
              {formType === 'business' && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-[#ddd] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
                    <input
                      type="tel"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-[#ddd] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Sitio Web</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-[#ddd] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Dirección</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-[#ddd] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Google Maps</label>
                    <input
                      type="url"
                      name="googleMapsLink"
                      value={formData.googleMapsLink}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-[#ddd] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Facebook</label>
                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-[#ddd] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Instagram</label>
                    <input
                      type="url"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-[#ddd] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">YouTube</label>
                    <input
                      type="url"
                      name="youtube"
                      value={formData.youtube}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-[#ddd] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">¿Destacar este negocio?</span>
                    </label>
                  </div>
                </>
              )}

              {/* Campos específicos para anuncios */}
              {formType === 'advertisement' && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Teléfono de contacto</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-[#ddd] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Información de contacto</label>
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-[#ddd] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                    />
                  </div>
                  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">Ciudad</label>
    <div>
      <input
        type="text"
        name="city"
        value={formData.city}
        onChange={handleInputChange}
        placeholder="Escribe el nombre de tu ciudad"
        className="w-full p-2 rounded-lg border border-[#ddd] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
      />
      {cityLocation && (
        <div className="mt-2 text-green-600">
          Ubicación detectada: {cityLocation.city}, {cityLocation.region}, {cityLocation.country}
        </div>
      )}
      {locationError && (
        <div className="mt-2 text-red-600">
          {locationError}
        </div>
      )}
    </div>
  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Precio</label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-[#ddd] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                      required
                    />
                  </div>


                </>
              )}

              {/* Subir Imagen */}
              <div className="space-y-2 col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  {formType === 'business' ? 'Imagen del Negocio' : 'Imagen del Anuncio'}
                </label>
                <input
                  type="file"
                  name="picture"
                  accept="image/*"
                  className="w-full p-2 rounded-lg border border-[#ddd] focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                />
              </div>

              <div className="col-span-2">
                <button
                  type="submit"
                  className="w-full p-3 bg-[#1877F2] text-white rounded-full font-semibold hover:bg-[#166fe5] transition-all"
                >
                  {formType === 'business' ? 'Publicar Negocio' : 'Publicar Anuncio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* El resto del componente permanece igual... */}
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-6">
          {businesses.map((business) => (
            <div
              key={business.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              onClick={() => handleBusinessClick(business.id)}
            >
              <div className="p-4 flex items-center space-x-3">
                {business.picture && (
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={business.picture}
                      alt={business.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg text-[#003893]">{business.name}</h3>
                  <p className="text-sm text-gray-500">{business.category}</p>
                </div>
                {business.featured && (
                  <span className="ml-auto px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                    Destacado
                  </span>
                )}
              </div>

              {business.picture && (
                <div className="relative h-72 w-full">
                  <Image
                    src={business.picture}
                    alt={business.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="p-4 space-y-3">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{business.address}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-2" />
                  <span>{business.phoneNumber}</span>
                </div>
                {business.website && (
                  <div className="flex items-center text-[#003893]">
                    <Globe className="w-5 h-5 mr-2" />
                    <a
                      href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Visitar sitio web
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-200"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      <footer className="bg-gradient-to-r from-[#5682b0] to-[#121d2e] text-white mt-auto">
        <div className="container mx-auto px-4 py-4 flex justify-center">
          <button

            className="px-4 py-2 bg-[#FFD700] text-white font-semibold rounded-md hover:bg-yellow-500"
          >
            Contáctanos
          </button>
        </div>
      </footer>
    </div>
  );
}
