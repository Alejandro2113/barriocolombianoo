"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import LOGO from "../images/logo.png";
import { MapPin, Phone, Globe, ArrowUp } from 'lucide-react';
import { X } from 'lucide-react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Home() {
  const [businesses, setBusinesses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [formType, setFormType] = useState('advertisement');
  const [cityLocation, setCityLocation] = useState(null);
  const [locationError, setLocationError] = useState('');

  const router = useRouter();

  // Routing function for business/announcement details
  const handleBusinessClick = (item) => {
    // Determine the route based on whether it's a business or an announcement
    const routePrefix = item.phoneNumber ? 'components/detalles/' : 'components/detallesA/';
    router.push(`/${routePrefix}/${item.id}`);
  };

  const sendNotificationEmail = async (formData, formType) => {
    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          type: formType,
          category: formData.category
        })
      });
  
      if (!response.ok) {
        console.error('Failed to send notification email');
      }
    } catch (error) {
      console.error('Error sending notification email:', error);
    }
  };

  const Notification = ({ type, message, onClose }) => {
    useEffect(() => {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }, [onClose]);
  
    const typeStyles = {
      success: {
        background: 'bg-green-50',
        border: 'border-green-400',
        icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
        text: 'text-green-800'
      },
      error: {
        background: 'bg-red-50',
        border: 'border-red-400',
        icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
        text: 'text-red-800'
      }
    };
  
    const { background, border, icon, text } = typeStyles[type];
  
    return (
      <div 
        className={`fixed top-4 right-4 z-[100] ${background} ${border} border-2 rounded-lg shadow-lg p-4 flex items-center space-x-3 max-w-md animate-slide-in`}
      >
        {icon}
        <div className={`flex-1 ${text}`}>
          <p className="font-semibold">{message}</p>
        </div>
        <button 
          onClick={onClose}
          className="hover:bg-gray-100 rounded-full p-1"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    );
  };

  const categories = [
    "Se Vende",
    "Empleo",
    "Eventos",
    "Se renta apartamento/casa",
    "Promover mi negocio",
  ];

  const [formData, setFormData] = useState({
    name: "",
    picture: "",
    description: "",
    category: "",
    email: "",
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
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/components/search?query=${encodeURIComponent(searchQuery)}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const businessesResponse = await fetch("/api/businesses", { cache: 'no-store' });
        const businessesData = await businessesResponse.json();
  
        const announcementsResponse = await fetch("/api/annoucement", { cache: 'no-store' });
        const announcementsData = await announcementsResponse.json();
  
        const combinedData = [...businessesData, ...announcementsData].map(item => ({
          ...item,
          createdAt: new Date(item.createdAt || new Date())
        }));

        const sortedData = combinedData.sort((a, b) => b.createdAt - a.createdAt);
        
        setBusinesses(sortedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);

  const detectCityLocation = async (cityName) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=AIzaSyCEOpccOqRZyabXPVyYhF4hNxv_czaRz6E`
      );

      const data = await response.json();

      if (data.status === 'OK') {
        const location = data.results[0].geometry.location;
        const addressComponents = data.results[0].address_components;

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
      if (value.length > 9) {
        detectCityLocation(value);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = formType === "business" ? "api/buisnessClient" : "api/annoucementClient";
    
    const formDataToSend = new FormData();
  
    for (const key in formData) {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    }
  
    const pictureInput = document.querySelector('input[name="picture"]');
    if (pictureInput?.files?.length > 0) {
      formDataToSend.append("picture", pictureInput.files[0]);
    }
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formDataToSend,
      });
  
      if (response.ok) {
        await sendNotificationEmail(formData, formType);

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
        const errorData = await response.json();
        alert(`Error al publicar: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Ocurrió un error al publicar.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col">
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
              className="w-full p-3 bg-white bg-opacity-90 rounded-lg text-gray-600 text-left hover:bg-opacity-100 transition-all duration-200 cursor-pointer shadow-sm border-2 border-blue-500"
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
      <select
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 px-6 py-3 rounded-lg text-gray-800 text-base md:text-lg w-full border border-gray-300"
      >
        <option value="Se Vende">Se Vende</option>
        <option value="Empleo">Empleo</option>
        <option value="Eventos">Eventos</option>
        <option value="Se renta apartamento/casa">Se renta apartamento/casa</option>
      </select>
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
    <div className="bg-gray-100 rounded-2xl shadow-lg w-full max-w-2xl p-4 relative max-h-[90vh] overflow-y-auto">
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

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-black">
        {/* Campos comunes */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            {formType === 'business' ? 'Nombre del Negocio' : 'Título del Anuncio'}
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Categoría</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
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

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
            required
          />
        </div>

        {/* Campo de imagen */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            {formType === 'business' ? 'Imagen del Negocio' : 'Imagen del Anuncio'}
          </label>
          <input
            type="file"
            name="picture"
            accept="image/*"
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
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
                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
              <input
                type="tel"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Google Maps</label>
              <input
                type="url"
                name="googleMapsLink"
                value={formData.googleMapsLink}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Facebook</label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Instagram</label>
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">YouTube</label>
              <input
                type="url"
                name="youtube"
                value={formData.youtube}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Sitio Web</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Dirección</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
              />
            </div>

            {/* 

            <div className="sm:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">¿Destacar este negocio?</span>
              </label>
            </div>  */}
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
                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
              />
            </div>

            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Ciudad</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Escribe el nombre de tu ciudad"
                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Precio</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                required
              />
            </div>
          </>
        )}

        {/* Botón de envío */}
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="w-full bg-[#1877F2] text-white p-2 rounded-lg hover:bg-[#135eac] focus:outline-none"
          >
            {formType === 'business' ? 'Registrar Negocio' : 'Publicar Anuncio'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-6">
          {businesses.map((business) => (
            <div
              key={business.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              onClick={() => handleBusinessClick(business)}
            >
              {/* Business Rendering */}
              {business.phoneNumber ? (
                <>
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
                </>
              ) : (
                // Announcement Rendering
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-[#003893]">{business.name}</h3>
                      <p className="text-sm text-gray-500">{business.category}</p>
                    </div>
                    {business.featured && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                        Destacado
                      </span>
                    )}
                  </div>

                  {business.picture && (
                    <div className="relative h-72 w-full mb-4">
                      <Image
                        src={business.picture}
                        alt={business.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{business.city || 'Ciudad no especificada'}</span>
                    </div>
                    <div className="text-gray-700 mt-2">
                      {business.description}
                    </div>
                  </div>
                </div>
              )}
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
