import { FavoritoActividad, FavoritoRestaurante, ActividadTuristica, Restaurante, Categoria, FotoActividad, FotoRestaurante } from '../models/index.js';

// Agregar actividad a favoritos
export const addActivityToFavorites = async (req, res) => {
  try {
    const { actividadturistica_id } = req.body;
    const user_id = req.user.userId;

    if (!actividadturistica_id) {
      return res.status(400).json({ message: 'ID de actividad es obligatorio' });
    }

    // Verificar que la actividad existe
    const actividad = await ActividadTuristica.findByPk(actividadturistica_id);
    if (!actividad) {
      return res.status(404).json({ message: 'Actividad no encontrada' });
    }

    // Verificar si ya está en favoritos
    const existingFavorite = await FavoritoActividad.findOne({
      where: { user_id, actividadturistica_id }
    });

    if (existingFavorite) {
      return res.status(400).json({ message: 'La actividad ya está en tus favoritos' });
    }

    // Agregar a favoritos
    await FavoritoActividad.create({
      user_id,
      actividadturistica_id
    });

    res.status(201).json({ message: 'Actividad agregada a favoritos' });
  } catch (error) {
    console.error('Error adding activity to favorites:', error);
    res.status(500).json({ message: 'Error al agregar a favoritos', error: error.message });
  }
};

// Remover actividad de favoritos
export const removeActivityFromFavorites = async (req, res) => {
  try {
    const { actividadturistica_id } = req.params;
    const user_id = req.user.userId;

    const favorite = await FavoritoActividad.findOne({
      where: { user_id, actividadturistica_id }
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Actividad no encontrada en favoritos' });
    }

    await favorite.destroy();

    res.json({ message: 'Actividad removida de favoritos' });
  } catch (error) {
    console.error('Error removing activity from favorites:', error);
    res.status(500).json({ message: 'Error al remover de favoritos', error: error.message });
  }
};

// Obtener favoritos del usuario
export const getUserFavorites = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { type, page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    let favoritosActividades = [];
    let favoritosRestaurantes = [];

    // Si no se especifica tipo o es 'activities', obtener actividades favoritas
    if (!type || type === 'activities') {
      favoritosActividades = await FavoritoActividad.findAndCountAll({
        where: { user_id },
        include: [
          {
            model: ActividadTuristica,
            as: 'actividad',
            include: [
              {
                model: Categoria,
                as: 'categoria',
                attributes: ['id', 'nombre', 'tipo']
              },
              {
                model: FotoActividad,
                as: 'fotos',
                attributes: ['id', 'url', 'orden'],
                order: [['orden', 'ASC']],
                limit: 1
              }
            ]
          }
        ],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: offset
      });
    }

    // Si no se especifica tipo o es 'restaurants', obtener restaurantes favoritos
    if (!type || type === 'restaurants') {
      favoritosRestaurantes = await FavoritoRestaurante.findAndCountAll({
        where: { user_id },
        include: [
          {
            model: Restaurante,
            as: 'restaurante',
            include: [
              {
                model: Categoria,
                as: 'categoria',
                attributes: ['id', 'nombre', 'tipo']
              },
              {
                model: FotoRestaurante,
                as: 'fotos',
                attributes: ['id', 'url', 'orden'],
                order: [['orden', 'ASC']],
                limit: 1
              }
            ]
          }
        ],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: offset
      });
    }

    res.json({
      actividades: {
        items: favoritosActividades.rows?.map(f => f.actividad) || [],
        pagination: {
          total: favoritosActividades.count || 0,
          total_pages: Math.ceil((favoritosActividades.count || 0) / limit),
          current_page: parseInt(page),
          limit: parseInt(limit)
        }
      },
      restaurantes: {
        items: favoritosRestaurantes.rows?.map(f => f.restaurante) || [],
        pagination: {
          total: favoritosRestaurantes.count || 0,
          total_pages: Math.ceil((favoritosRestaurantes.count || 0) / limit),
          current_page: parseInt(page),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting user favorites:', error);
    res.status(500).json({ message: 'Error al obtener favoritos', error: error.message });
  }
};

// Agregar restaurante a favoritos
export const addRestaurantToFavorites = async (req, res) => {
  try {
    const { restaurante_id } = req.body;
    const user_id = req.user.userId;

    if (!restaurante_id) {
      return res.status(400).json({ message: 'ID de restaurante es obligatorio' });
    }

    // Verificar que el restaurante existe
    const restaurante = await Restaurante.findByPk(restaurante_id);
    if (!restaurante) {
      return res.status(404).json({ message: 'Restaurante no encontrado' });
    }

    // Verificar si ya está en favoritos
    const existingFavorite = await FavoritoRestaurante.findOne({
      where: { user_id, restaurante_id }
    });

    if (existingFavorite) {
      return res.status(400).json({ message: 'El restaurante ya está en tus favoritos' });
    }

    // Agregar a favoritos
    await FavoritoRestaurante.create({
      user_id,
      restaurante_id
    });

    res.status(201).json({ message: 'Restaurante agregado a favoritos' });
  } catch (error) {
    console.error('Error adding restaurant to favorites:', error);
    res.status(500).json({ message: 'Error al agregar a favoritos', error: error.message });
  }
};

// Remover restaurante de favoritos
export const removeRestaurantFromFavorites = async (req, res) => {
  try {
    const { restaurante_id } = req.params;
    const user_id = req.user.userId;

    const favorite = await FavoritoRestaurante.findOne({
      where: { user_id, restaurante_id }
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Restaurante no encontrado en favoritos' });
    }

    await favorite.destroy();

    res.json({ message: 'Restaurante removido de favoritos' });
  } catch (error) {
    console.error('Error removing restaurant from favorites:', error);
    res.status(500).json({ message: 'Error al remover de favoritos', error: error.message });
  }
};

// Verificar si una actividad está en favoritos del usuario
export const checkActivityFavorite = async (req, res) => {
  try {
    const { actividadturistica_id } = req.params;
    const user_id = req.user.userId;

    const favorite = await FavoritoActividad.findOne({
      where: { user_id, actividadturistica_id }
    });

    res.json({
      is_favorite: !!favorite,
      favorite_id: favorite?.id || null
    });
  } catch (error) {
    console.error('Error checking activity favorite:', error);
    res.status(500).json({ 
      message: 'Error al verificar favorito', 
      error: error.message 
    });
  }
};

// Verificar si un restaurante está en favoritos del usuario
export const checkRestaurantFavorite = async (req, res) => {
  try {
    const { restaurante_id } = req.params;
    const user_id = req.user.userId;

    const favorite = await FavoritoRestaurante.findOne({
      where: { user_id, restaurante_id }
    });

    res.json({
      is_favorite: !!favorite,
      favorite_id: favorite?.id || null
    });
  } catch (error) {
    console.error('Error checking restaurant favorite:', error);
    res.status(500).json({ 
      message: 'Error al verificar favorito', 
      error: error.message 
    });
  }
}; 