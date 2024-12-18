// src/pages/api/announcementClient.js

import { PrismaClient } from "@prisma/client";
import { IncomingForm } from 'formidable';
import cloudinary from 'cloudinary';
import sharp from 'sharp';

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function compressImage(file) {
  try {
    const compressedImageBuffer = await sharp(file.filepath)
      .resize({ width: 1920, height: 1080, fit: 'inside' })
      .jpeg({ quality: 80 })
      .toBuffer();
    return compressedImageBuffer;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
}

async function uploadToCloudinary(buffer) {
  console.log("Iniciando carga a Cloudinary");
  return new Promise((resolve, reject) => {
    const upload_stream = cloudinary.v2.uploader.upload_stream(
      { 
        folder: "anuncios",
        timeout: 60000 // 60 segundos de tiempo de espera
      },
      (error, result) => {
        if (error) {
          console.error("Error en la carga a Cloudinary:", error);
          reject(error);
        } else {
          console.log("Carga a Cloudinary exitosa:", result.secure_url);
          resolve(result.secure_url);
        }
      }
    );
    
    upload_stream.end(buffer);
  });
}

async function deleteFromCloudinary(publicId) {
  if (publicId) {
    try {
      await cloudinary.v2.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
    }
  }
}

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(Buffer.from(body));
    });
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  console.log("Método de la solicitud:", req.method);

  if (req.method === "GET") {
    try {
      const { id, name } = req.query;

      let anuncios;
      if (id) {
        anuncios = await prisma.anuncios.findUnique({
          where: { id: parseInt(id) },
        });
      } else if (name) {
        anuncios = await prisma.anuncios.findMany({
          where: { name: { contains: name, mode: "insensitive" } },
        });
      } else {
        anuncios = await prisma.anuncios.findMany();
      }

      res.status(200).json(anuncios);
    } catch (error) {
      console.error('Error in GET:', error);
      res.status(500).json({ error: "Error al obtener los anuncios" });
    }
  } else if (req.method === "POST" || req.method === "PUT") {
    try {
      console.log("Procesando solicitud POST/PUT");
      const form = new IncomingForm();

      const [fields, files] = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) {
            console.error("Error al analizar el formulario:", err);
            reject(err);
          }
          console.log("Campos recibidos:", fields);
          console.log("Archivos recibidos:", files);
          resolve([fields, files]);
        });
      });

      let pictureUrl = '';
      if (files.picture) {
        const file = Array.isArray(files.picture) ? files.picture[0] : files.picture;
        const compressedImageBuffer = await compressImage(file);
        pictureUrl = await uploadToCloudinary(compressedImageBuffer);
      }

      const anuncioData = {
        name: fields.name[0],
        email: fields.email ? fields.email[0] : undefined,
        picture: pictureUrl || undefined,
        description: fields.description[0],
        phone: fields.phone ? fields.phone[0] : undefined,
        category: fields.category ? fields.category[0] : undefined,
        city: fields.city ? fields.city[0] : undefined,
        contact: fields.contact ? fields.contact[0] : undefined,
        price: fields.price ? parseFloat(fields.price[0]) : 0.0,
      };

      console.log("Datos del anuncio a guardar:", anuncioData);

      let anuncio;
      if (req.method === "POST") {
        console.log("Creando nuevo anuncio");
        anuncio = await prisma.anuncios.create({ data: anuncioData });
      } else {
        console.log("Actualizando anuncio existente");
        const id = parseInt(fields.id[0]);
        const oldAnuncio = await prisma.anuncios.findUnique({ where: { id } });
        
        if (oldAnuncio && pictureUrl && oldAnuncio.picture) {
          await deleteFromCloudinary(oldAnuncio.picture);
        }
        
        anuncio = await prisma.anuncios.update({
          where: { id },
          data: anuncioData,
        });
      }

      console.log("Anuncio guardado exitosamente:", anuncio);
      res.status(req.method === "POST" ? 201 : 200).json(anuncio);
    } catch (error) {
      console.error('Error en POST/PUT:', error);
      if (error.name === 'TimeoutError') {
        res.status(504).json({ error: "La carga de la imagen ha excedido el tiempo de espera. Por favor, intenta con una imagen más pequeña o verifica tu conexión a Internet." });
      } else {
        res.status(500).json({ error: `Error al ${req.method === "POST" ? "crear" : "actualizar"} el anuncio: ${error.message}` });
      }
    }
  } else if (req.method === "DELETE") {
    try {
      console.log("Iniciando eliminación");
      
      const buffer = await getRawBody(req);
      const text = buffer.toString('utf8');
      console.log("Raw body:", text);
      
      let id;
      try {
        const body = JSON.parse(text);
        id = body.id;
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        return res.status(400).json({ error: "Invalid JSON in request body" });
      }

      if (!id) {
        return res.status(400).json({ error: "Missing 'id' in request body" });
      }

      console.log("ID recibido:", id);
      
      const anuncio = await prisma.anuncios.findUnique({ where: { id: parseInt(id) } });
      if (anuncio) {
        if (anuncio.picture) {
          await deleteFromCloudinary(anuncio.picture);
        }
        await prisma.anuncios.delete({
          where: { id: parseInt(id) },
        });
        res.status(204).end();
      } else {
        res.status(404).json({ error: "Anuncio no encontrado" });
      }
    } catch (error) {
      console.error('Error in DELETE:', error);
      res.status(500).json({ error: "Error al eliminar el anuncio" });
    }
  } else {
    console.log("Método no permitido");
    res.status(405).json({ error: "Método no permitido" });
  }
}
