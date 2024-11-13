"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Modal from './Modal'; 

export default function BusinessDashboard() {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [search, setSearch] = useState({ id: '', name: '' });
  const [form, setForm] = useState({
    id: '', name: '', picture: null, description: '', phoneNumber: '', whatsappNumber: '', website: '', 
    facebook: '', instagram: '', youtube: '', category: '', address: '', googleMapsLink: '', featured: false
  });
  const [editing, setEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [isEditConfirmModalOpen, setIsEditConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [businessToDelete, setBusinessToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBusinesses = async () => {
      const response = await fetch("/api/businesses");
      const data = await response.json();
      setBusinesses(data);
      setFilteredBusinesses(data);
    };
    fetchBusinesses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'picture' && files && files[0]) {
      const file = files[0];
      setForm(prevForm => ({ ...prevForm, [name]: file }));
      setPreviewUrl(URL.createObjectURL(file));
    } else if (type === 'checkbox') {
      setForm(prevForm => ({ ...prevForm, [name]: checked }));
    } else {
      setForm(prevForm => ({ ...prevForm, [name]: value }));
    }
  };
  
  

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch(prevSearch => ({ ...prevSearch, [name]: value }));
  };

  useEffect(() => {
    const filterBusinesses = () => {
      let filtered = businesses;
      if (search.name) {
        filtered = filtered.filter(business =>
          business.name.toLowerCase().includes(search.name.toLowerCase())
        );
      }
      if (search.id) {
        filtered = filtered.filter(business =>
          business.id.toString().includes(search.id)
        );
      }
      setFilteredBusinesses(filtered);
    };
    filterBusinesses();
  }, [search, businesses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      if (key === 'picture' && form[key] instanceof File) {
        formData.append(key, form[key]);
      } else {
        formData.append(key, form[key] || '');
      }
    }
    const method = editing ? 'PUT' : 'POST';
    const url = '/api/businesses';
    const options = {
      method,
      body: formData,
    };
    await fetch(url, options);
    setEditing(false);
    setForm({
      id: '', name: '', picture: null, description: '', phoneNumber: '', whatsappNumber: '', website: '', 
      facebook: '', instagram: '', youtube: '', category: '', address: '', googleMapsLink: '', featured: false
    });
    setPreviewUrl('');
    const response = await fetch("/api/businesses");
    const data = await response.json();
    setBusinesses(data);
  };
  

  const handleEdit = (business) => {
    setForm({
      id: business.id,
      name: business.name,
      picture: business.picture || null,
      description: business.description,
      phoneNumber: business.phoneNumber,
      whatsappNumber: business.whatsappNumber,
      website: business.website,
      facebook: business.facebook,
      instagram: business.instagram,
      youtube: business.youtube,
      category: business.category,
      address: business.address,
      googleMapsLink: business.googleMapsLink,
      featured: business.featured || false,  // Asegúrate de que "featured" se maneje correctamente
    });
    setEditing(true);
    setPreviewUrl(business.picture || '');
  };
  
  
  

  const handleDeleteClick = (business) => {
    setBusinessToDelete(business);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!businessToDelete) return;

    try {
      const response = await fetch('/api/businesses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: businessToDelete.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete business');
      }

      setBusinesses(prevBusinesses => prevBusinesses.filter(business => business.id !== businessToDelete.id));
      setFilteredBusinesses(prevFiltered => prevFiltered.filter(business => business.id !== businessToDelete.id));
      
      setIsModalOpen(false);
      setBusinessToDelete(null);
      alert(`El negocio "${businessToDelete.name}" ha sido eliminado exitosamente.`);
    } catch (error) {
      console.error('Error deleting business:', error);
      alert(`Error al eliminar el negocio "${businessToDelete.name}". Por favor, inténtalo de nuevo.`);
    }
  };


  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
    });
    router.push('/login');
  };

  const handleGoToUsers = () => {
    router.push('/components/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-black text-3xl font-bold mb-4 text-center">Dashboard de Negocios</h1>
      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirmar eliminación"
        message={`¿Estás seguro que quieres eliminar el negocio?`}
      />

      {/* Modal de confirmación de edición */}
      <Modal
        isOpen={isEditConfirmModalOpen}
        onClose={() => setIsEditConfirmModalOpen(false)}
        onConfirm={() => {
          setIsEditConfirmModalOpen(false);
          handleSubmit();
        }}
        title="Confirmar edición"
        message="¿Estás seguro de que quieres guardar los cambios?"
      />

      {/* Modal de éxito */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Operación exitosa"
        message={successMessage}
      />
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Cerrar Sesión
        </button>
        <button
          onClick={handleGoToUsers}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Usuarios
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        {/* Columna del formulario */}
        <div className="w-full md:w-1/2 bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <h2 className="text-black text-xl font-bold mb-4 text-center">{editing ? 'Editar Negocio' : 'Crear Negocio'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Foto</label>
                <input
                  type="file"
                  name="picture"
                  onChange={handleChange}
                  className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
                {previewUrl && (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="mt-2 rounded-md"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Número de Teléfono</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Número de WhatsApp</label>
                <input
                  type="text"
                  name="whatsappNumber"
                  value={form.whatsappNumber}
                  onChange={handleChange}
                  className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sitio Web</label>
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Facebook</label>
                <input
                  type="text"
                  name="facebook"
                  value={form.facebook}
                  onChange={handleChange}
                  className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Instagram</label>
                <input
                  type="text"
                  name="instagram"
                  value={form.instagram}
                  onChange={handleChange}
                  className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">YouTube</label>
                <input
                  type="text"
                  name="youtube"
                  value={form.youtube}
                  onChange={handleChange}
                  className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Categoría</label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Enlace de Google Maps</label>
                <input
                  type="text"
                  name="googleMapsLink"
                  value={form.googleMapsLink}
                  onChange={handleChange}
                  className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
  <label className="block text-sm font-medium text-gray-700">Destacado</label>
  <input
    type="checkbox"
    name="featured"
    checked={form.featured}
    onChange={handleChange}
    className="text-black mt-1"
  />
</div>

            </div>
            <button
              type="submit"
              className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editing ? 'Guardar Cambios' : 'Crear Negocio'}
            </button>
          </form>
        </div>

        {/* Columna de búsqueda y lista de negocios */}
        <div className="w-full md:w-1/2 bg-white shadow-md rounded-lg p-6">
          <div className="mb-6">
            <input
              type="text"
              name="name"
              placeholder="Buscar por nombre"
              value={search.name}
              onChange={handleSearchChange}
              className="text-black mb-4 mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
            <input
              type="text"
              name="id"
              placeholder="Buscar por ID"
              value={search.id}
              onChange={handleSearchChange}
              className="text-black mb-4 mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredBusinesses.map((business) => (
              <div key={business.id} className="border p-4 rounded-md shadow-md bg-gray-50">
                <h3 className="text-black text-lg font-bold">{business.name}</h3>
                <span className="text-gray-500 text-sm">ID: {business.id}</span>
                <Image
                  src={business.picture || '/default-image.jpg'}
                  alt={business.name}
                  width={400}
                  height={320}
                  className="w-full h-40 object-cover rounded-md my-2"
                />
                <p className="text-black text-sm">{business.description}</p>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleEdit(business)}
                    className="px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteClick(business)}
                    className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      
    </div>
  );
}