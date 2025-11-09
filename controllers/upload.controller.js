import multer from 'multer';
import path from 'path';

// Configurar multer para almacenar archivos en memoria
const storage = multer.memoryStorage();

// Filtrar solo archivos de imagen
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter: fileFilter,
});

// Middleware para subir una imagen
export const uploadSingle = upload.single('image');

// Middleware para subir múltiples imágenes
export const uploadMultiple = upload.array('images', 10); // máximo 10 imágenes

// Convertir imagen a data URL (base64)
const convertToDataURL = (buffer, mimetype) => {
  const base64 = buffer.toString('base64');
  return `data:${mimetype};base64,${base64}`;
};

// Subir una imagen y devolver la URL
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se proporcionó ninguna imagen' });
    }

    const { buffer, mimetype, originalname } = req.file;
    
    // Convertir a data URL (base64)
    const imageUrl = convertToDataURL(buffer, mimetype);

    res.json({
      message: 'Imagen subida exitosamente',
      url: imageUrl,
      originalName: originalname,
      size: buffer.length,
      mimetype: mimetype
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error al subir la imagen', error: error.message });
  }
};

// Subir múltiples imágenes y devolver las URLs
export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron imágenes' });
    }

    const images = req.files.map(file => {
      const imageUrl = convertToDataURL(file.buffer, file.mimetype);
      return {
        url: imageUrl,
        originalName: file.originalname,
        size: file.buffer.length,
        mimetype: file.mimetype
      };
    });

    res.json({
      message: 'Imágenes subidas exitosamente',
      images: images,
      count: images.length
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ message: 'Error al subir las imágenes', error: error.message });
  }
};

