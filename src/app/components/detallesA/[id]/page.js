"use client";

import { Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MapPin, Phone, Tag, DollarSign } from 'lucide-react';
import Image from "next/image";
import LOGO from "../../../../images/logo.png";

export default function AdDetails() {
  const router = useRouter();
  const { id } = useParams();

  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/announcement/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch ad data');
          }
          return response.json();
        })
        .then((data) => {
          setAd(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return (
      <div>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => router.push('/')}>Volver a la página principal</button>
      </div>
    );
  }

  if (!ad) {
    return (
      <div>
        <h2>Anuncio no encontrado</h2>
        <button onClick={() => router.push('/')}>Volver a la página principal</button>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="relative bg-gradient-to-r from-[#FFD700] to-[#003893] p-4 flex justify-between items-center">
          <div>
            <Image src={LOGO} alt="Logo" width={100} height={50} />
          </div>
          <button
            onClick={() => router.push('/')}
            className="ml-2 px-4 py-2 bg-[#fad039] text-white font-semibold rounded-md hover:bg-blue-800"
          >
            Página Principal
          </button>
        </header>

        <div className="flex-grow p-4 sm:p-6 md:p-8">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            {ad.picture && (
              <Image
                src={ad.picture}
                alt={ad.name}
                width={800}
                height={400}
                className="w-full h-60 object-cover"
              />
            )}
            <div className="p-6">
              <h1 className="text-indigo-800 text-4xl font-extrabold mb-4">
                {ad.name}
              </h1>
              <p className="text-gray-800 text-lg mb-6">
                <span className="font-medium">Descripción:</span> {ad.description}
              </p>
              <div className="space-y-4 text-gray-700 text-lg">
                {ad.phone && (
                  <p className="flex items-center">
                    <Phone size={20} className="mr-3 text-indigo-600" />
                    <span className="font-medium">Teléfono:</span> {ad.phone}
                  </p>
                )}
                {ad.category && (
                  <p className="flex items-center">
                    <Tag size={20} className="mr-3 text-indigo-600" />
                    <span className="font-medium">Categoría:</span> {ad.category}
                  </p>
                )}
                {ad.city && (
                  <p className="flex items-center">
                    <MapPin size={20} className="mr-3 text-indigo-600" />
                    <span className="font-medium">Ciudad:</span> {ad.city}
                  </p>
                )}
                <p className="flex items-center">
                  <DollarSign size={20} className="mr-3 text-green-600" />
                  <span className="font-medium">Precio:</span> ${ad.price.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => router.back()}
                className="bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 mt-6"
              >
                Regresar
              </button>
            </div>
          </div>
        </div>

        <footer className="bg-gradient-to-r from-[#5682b0] to-[#121d2e] text-white py-4">
          <div className="container mx-auto text-center">
            © 2024 Anuncios
          </div>
        </footer>
      </div>
    </Suspense>
  );
}