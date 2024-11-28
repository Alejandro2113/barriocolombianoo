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
        folder: "negocios",
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

      let businesses;
      if (id) {
        businesses = await prisma.negocios.findUnique({
          where: { id: parseInt(id) },
        });
      } else if (name) {
        businesses = await prisma.negocios.findMany({
          where: { name: { contains: name, mode: "insensitive" } },
        });
      } else {
        businesses = await prisma.negocios.findMany();
      }

      res.status(200).json(businesses);
    } catch (error) {
      console.error('Error in GET:', error);
      res.status(500).json({ error: "Error al obtener los negocios" });
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

      const businessData = {
        name: fields.name[0],
        picture: pictureUrl || undefined,
        description: fields.description[0],
       
        whatsappNumber: fields.whatsappNumber[0],
        website: fields.website[0],
        facebook: fields.facebook[0],
        instagram: fields.instagram[0],
        
        category: fields.category[0],
        
        googleMapsLink: fields.googleMapsLink[0],
        featured: fields.featured ? fields.featured[0] === 'true' : false, // Asume que se envía como "true" o "false"
        
      };

      console.log("Datos del negocio a guardar:", businessData);

      let business;
      if (req.method === "POST") {
        console.log("Creando nuevo negocio");
        business = await prisma.negocios.create({ data: businessData });
      } else {
        console.log("Actualizando negocio existente");
        const id = parseInt(fields.id[0]);
        const oldBusiness = await prisma.negocios.findUnique({ where: { id } });
        if (oldBusiness && pictureUrl) {
          await deleteFromCloudinary(oldBusiness.picture);
        }
        business = await prisma.negocios.update({
          where: { id },
          data: businessData,
        });
      }

      console.log("Negocio guardado exitosamente:", business);
      res.status(req.method === "POST" ? 201 : 200).json(business);
    } catch (error) {
      console.error('Error en POST/PUT:', error);
      if (error.name === 'TimeoutError') {
        res.status(504).json({ error: "La carga de la imagen ha excedido el tiempo de espera. Por favor, intenta con una imagen más pequeña o verifica tu conexión a Internet." });
      } else {
        res.status(500).json({ error: `Error al ${req.method === "POST" ? "crear" : "actualizar"} el negocio: ${error.message}` });
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
      
      const business = await prisma.negocios.findUnique({ where: { id: parseInt(id) } });
      if (business) {
        if (business.picture) {
          await deleteFromCloudinary(business.picture);
        }
        await prisma.negocios.delete({
          where: { id: parseInt(id) },
        });
        res.status(204).end();
      } else {
        res.status(404).json({ error: "Business not found" });
      }
    } catch (error) {
      console.error('Error in DELETE:', error);
      res.status(500).json({ error: "Error al eliminar el negocio" });
    }
  } else {
    console.log("Método no permitido");
    res.status(405).json({ error: "Método no permitido" });
  }
}