"use client"; // To ensure it renders as a client component

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation'; // Ensure you import useRouter

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ id: '', email: '', password: '' });
  const [search, setSearch] = useState({ id: '', email: '' });
  const [editing, setEditing] = useState(false);
  const router = useRouter(); // Hook for navigation

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch(prevSearch => ({ ...prevSearch, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = '/api/users';
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    };
    await fetch(url, options);
    setEditing(false);
    setForm({ id: '', email: '', password: '' });
    const response = await fetch("/api/users");
    const data = await response.json();
    setUsers(data);
  };

  const handleEdit = (user) => {
    setForm(user);
    setEditing(true);
  };

  const handleDelete = async (id) => {
    await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const response = await fetch("/api/users");
    const data = await response.json();
    setUsers(data);
  };

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
    });
    router.push('/login'); // Redirect to login page
  };

  const handleGoToBusinessDashboard = () => {
    router.push('/components/business-dashboard'); // Redirect to business dashboard
  };

  // Filter users based on search criteria
  const filteredUsers = users.filter(user =>
    (search.id === '' || user.id.toString().includes(search.id)) &&
    (search.email === '' || user.email.toLowerCase().includes(search.email.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-black text-3xl font-bold mb-4 text-center">Dashboard de Usuarios</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full justify-center">
        <button
          onClick={handleLogout}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Cerrar Sesión
        </button>
        <button
          onClick={handleGoToBusinessDashboard}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Negocios
        </button>
      </div>
      <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleSubmit} className="mb-6">
            <h2 className="text-black text-xl font-bold mb-4 text-center">{editing ? 'Editar Usuario' : 'Crear Usuario'}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {editing ? 'Actualizar Usuario' : 'Crear Usuario'}
            </button>
          </form>
        </div>
        <div>
          <div className="mb-4">
            <h2 className="text-black text-xl font-bold mb-4 text-center">Buscar Usuario</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                name="id"
                value={search.id}
                onChange={handleSearchChange}
                placeholder="Buscar por ID"
                className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              <input
                type="text"
                name="email"
                value={search.email}
                onChange={handleSearchChange}
                placeholder="Buscar por Email"
                className="text-black mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha de Creación</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-2 text-sm text-gray-700">{user.id}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{user.email}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
