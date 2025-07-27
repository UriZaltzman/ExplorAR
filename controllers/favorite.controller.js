import { FavoritoActividad, FavoritoRestaurante, ActividadTuristica, Restaurante } from '../models/index.js';

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

    const [favoritosActividades, favoritosRestaurantes] = await Promise.all([
      FavoritoActividad.findAll({
        where: { user_id },
        include: [
          {
            model: ActividadTuristica,
            as: 'actividad',
            include: ['categoria', 'fotos']
          }
        ]
      }),
      FavoritoRestaurante.findAll({
        where: { user_id },
        include: [
          {
            model: Restaurante,
            as: 'restaurante',
            include: ['categoria', 'fotos']
          }
        ]
      })
    ]);

    res.json({
      actividades: favoritosActividades.map(f => f.actividad),
      restaurantes: favoritosRestaurantes.map(f => f.restaurante)
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