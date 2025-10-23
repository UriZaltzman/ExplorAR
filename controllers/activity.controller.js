import { 
  ActividadTuristica, 
  Categoria, 
  FechasDisponiblesActividad, 
  Resena, 
  FavoritoActividad, 
  FotoActividad,
  User 
} from '../models/index.js';
import { Op } from 'sequelize';

// Obtener todas las actividades con filtros
export const getActivities = async (req, res) => {
  try {
    const {
      search,
      categoria,
      precio_min,
      precio_max,
      duracion_min,
      duracion_max,
      page = 1,
      limit = 10,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { is_active: true };

    // Filtro de búsqueda por nombre
    if (search) {
      whereClause.nombre = {
        [Op.iLike]: `%${search}%`
      };
    }

    // Filtro por categoría
    if (categoria) {
      whereClause.categoria_id = categoria;
    }

    // Filtro por precio
    if (precio_min || precio_max) {
      whereClause.precio = {};
      if (precio_min) whereClause.precio[Op.gte] = parseFloat(precio_min);
      if (precio_max) whereClause.precio[Op.lte] = parseFloat(precio_max);
    }

    // Filtro por duración
    if (duracion_min || duracion_max) {
      whereClause.duracion = {};
      if (duracion_min) whereClause.duracion[Op.gte] = parseInt(duracion_min);
      if (duracion_max) whereClause.duracion[Op.lte] = parseInt(duracion_max);
    }

    const activities = await ActividadTuristica.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id', 'nombre', 'tipo']
        },
        {
          model: User,
          as: 'creador',
          attributes: ['id', 'nombre', 'apellido']
        },
        {
          model: FotoActividad,
          as: 'fotos',
          attributes: ['id', 'url', 'orden'],
          order: [['orden', 'ASC']],
          limit: 1 // Solo la primera foto para la lista
        }
      ],
      order: [[sort_by, sort_order.toUpperCase()]],
      limit: parseInt(limit),
      offset: offset,
      distinct: true
    });

    // Calcular rating promedio para cada actividad
    const activitiesWithRating = await Promise.all(
      activities.rows.map(async (activity) => {
        const resenas = await Resena.findAll({
          where: { actividadturistica_id: activity.id },
          attributes: ['rating']
    });

        const ratings = resenas.map(r => parseFloat(r.rating)).filter(r => !isNaN(r));
        const averageRating = ratings.length > 0 
          ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
          : null;

        return {
          ...activity.toJSON(),
          average_rating: averageRating,
          total_reviews: ratings.length
        };
      })
    );

    res.json({
      activities: activitiesWithRating,
      total: activities.count,
      total_pages: Math.ceil(activities.count / limit),
      current_page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Error getting activities:', error);
    res.status(500).json({ message: 'Error al obtener actividades', error: error.message });
  }
};

// Obtener una actividad específica con todos sus detalles
export const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await ActividadTuristica.findByPk(id, {
      include: [
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id', 'nombre', 'tipo']
        },
        {
          model: User,
          as: 'creador',
          attributes: ['id', 'nombre', 'apellido']
        },
        {
          model: FotoActividad,
          as: 'fotos',
          attributes: ['id', 'url', 'orden'],
          order: [['orden', 'ASC']]
        },
        {
          model: FechasDisponiblesActividad,
          as: 'fechasDisponibles',
          attributes: ['id', 'fecha', 'hora_inicio', 'hora_fin', 'capacidad_disponible'],
          where: {
            fecha: {
              [Op.gte]: new Date()
            }
          },
          order: [['fecha', 'ASC'], ['hora_inicio', 'ASC']]
        }
      ]
    });

    if (!activity) {
      return res.status(404).json({ message: 'Actividad no encontrada' });
    }

    // Obtener reseñas con información del usuario
    const resenas = await Resena.findAll({
      where: { actividadturistica_id: id },
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['id', 'nombre', 'apellido']
        }
      ],
      order: [['fecha', 'DESC']],
      limit: 10
    });

    // Calcular rating promedio
    const ratings = resenas.map(r => parseFloat(r.rating)).filter(r => !isNaN(r));
    const averageRating = ratings.length > 0 
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : null;

    // Verificar si el usuario actual tiene esta actividad en favoritos
    let isFavorite = false;
    if (req.user) {
      const favorito = await FavoritoActividad.findOne({
        where: {
          user_id: req.user.userId,
          actividadturistica_id: id
        }
      });
      isFavorite = !!favorito;
    }

    res.json({
      ...activity.toJSON(),
      average_rating: averageRating,
      total_reviews: ratings.length,
      resenas,
      is_favorite: isFavorite
    });
  } catch (error) {
    console.error('Error getting activity by id:', error);
    res.status(500).json({ message: 'Error al obtener actividad', error: error.message });
  }
};

// Crear una nueva actividad (solo admin)
export const createActivity = async (req, res) => {
  try {
    // Verificar que el usuario sea admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Solo los administradores pueden crear actividades' });
    }

    const {
      nombre,
      descripcion,
      duracion,
      direccion,
      contacto,
      // coordenadas_lat,
      // coordenadas_lng,
      google_maps_link,
      precio,
      categoria_id,
      max_capacity,
      fotos = []
    } = req.body;

    // Crear la actividad
    const activity = await ActividadTuristica.create({
      nombre,
      descripcion,
      duracion,
      direccion,
      contacto,
      // coordenadas_lat,
      // coordenadas_lng,
      google_maps_link,
      precio,
      categoria_id,
      user_id: req.user.userId,
      max_capacity
    });

    // Crear las fotos si se proporcionaron
    if (fotos.length > 0) {
      const fotosData = fotos.map((url, index) => ({
        actividadturistica_id: activity.id,
        url,
        orden: index
      }));
      await FotoActividad.bulkCreate(fotosData);
    }

    res.status(201).json({
      message: 'Actividad creada exitosamente',
      activity: {
        id: activity.id,
        nombre: activity.nombre
      }
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ message: 'Error al crear actividad', error: error.message });
  }
};

// Actualizar una actividad (solo admin)
export const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario sea admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Solo los administradores pueden actualizar actividades' });
  }

    const activity = await ActividadTuristica.findByPk(id);
    if (!activity) {
      return res.status(404).json({ message: 'Actividad no encontrada' });
    }

    // Verificar que el admin sea el creador de la actividad
    if (activity.user_id !== req.user.userId) {
      return res.status(403).json({ message: 'Solo puedes actualizar tus propias actividades' });
    }

    const updateData = req.body;
    delete updateData.id; // No permitir cambiar el ID

    await activity.update(updateData);

    res.json({
      message: 'Actividad actualizada exitosamente',
      activity: {
        id: activity.id,
        nombre: activity.nombre
      }
    });
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({ message: 'Error al actualizar actividad', error: error.message });
  }
};

// Eliminar una actividad (solo admin)
export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario sea admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Solo los administradores pueden eliminar actividades' });
    }

    const activity = await ActividadTuristica.findByPk(id);
    if (!activity) {
      return res.status(404).json({ message: 'Actividad no encontrada' });
    }

    // Verificar que el admin sea el creador de la actividad
    if (activity.user_id !== req.user.userId) {
      return res.status(403).json({ message: 'Solo puedes eliminar tus propias actividades' });
    }

    // Marcar como inactiva en lugar de eliminar
    await activity.update({ is_active: false });

    res.json({ message: 'Actividad eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ message: 'Error al eliminar actividad', error: error.message });
  }
};

// Obtener categorías
export const getCategories = async (req, res) => {
  try {
    const { tipo } = req.query;
    const whereClause = tipo ? { tipo } : {};

    const categories = await Categoria.findAll({
      where: whereClause,
      order: [['nombre', 'ASC']]
    });

    res.json(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ message: 'Error al obtener categorías', error: error.message });
  }
};
