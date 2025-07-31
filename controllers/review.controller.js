import { Resena, ActividadTuristica, Restaurante, User } from '../models/index.js';

// Crear reseña para actividad
export const createActivityReview = async (req, res) => {
  try {
    const { actividadturistica_id, rating, comment } = req.body;
    const user_id = req.user.userId;

    if (!actividadturistica_id || !rating) {
      return res.status(400).json({ 
        message: 'ID de actividad y calificación son obligatorios' 
      });
    }

    // Validar rating
    if (rating < 0.5 || rating > 5) {
      return res.status(400).json({ 
        message: 'La calificación debe estar entre 0.5 y 5' 
      });
    }

    // Verificar que la actividad existe
    const actividad = await ActividadTuristica.findByPk(actividadturistica_id);
    if (!actividad) {
      return res.status(404).json({ message: 'Actividad no encontrada' });
    }

    // Verificar si el usuario ya hizo una reseña para esta actividad
    const existingReview = await Resena.findOne({
      where: { 
        user_id, 
        actividadturistica_id,
        restaurante_id: null // Solo reseñas de actividades
      }
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'Ya has hecho una reseña para esta actividad' 
      });
    }

    // Crear la reseña
    const review = await Resena.create({
      user_id,
      actividadturistica_id,
      rating,
      comment: comment || null
    });

    // Obtener la reseña con información del usuario
    const reviewWithUser = await Resena.findByPk(review.id, {
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['id', 'nombre', 'apellido']
        }
      ]
    });

    res.status(201).json({
      message: 'Reseña creada exitosamente',
      review: reviewWithUser
    });
  } catch (error) {
    console.error('Error creating activity review:', error);
    res.status(500).json({ 
      message: 'Error al crear la reseña', 
      error: error.message 
    });
  }
};

// Crear reseña para restaurante
export const createRestaurantReview = async (req, res) => {
  try {
    const { restaurante_id, rating, comment } = req.body;
    const user_id = req.user.userId;

    if (!restaurante_id || !rating) {
      return res.status(400).json({ 
        message: 'ID de restaurante y calificación son obligatorios' 
      });
    }

    // Validar rating
    if (rating < 0.5 || rating > 5) {
      return res.status(400).json({ 
        message: 'La calificación debe estar entre 0.5 y 5' 
      });
    }

    // Verificar que el restaurante existe
    const restaurante = await Restaurante.findByPk(restaurante_id);
    if (!restaurante) {
      return res.status(404).json({ message: 'Restaurante no encontrado' });
    }

    // Verificar si el usuario ya hizo una reseña para este restaurante
    const existingReview = await Resena.findOne({
      where: { 
        user_id, 
        restaurante_id,
        actividadturistica_id: null // Solo reseñas de restaurantes
      }
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'Ya has hecho una reseña para este restaurante' 
      });
    }

    // Crear la reseña
    const review = await Resena.create({
      user_id,
      restaurante_id,
      rating,
      comment: comment || null
    });

    // Obtener la reseña con información del usuario
    const reviewWithUser = await Resena.findByPk(review.id, {
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['id', 'nombre', 'apellido']
        }
      ]
    });

    res.status(201).json({
      message: 'Reseña creada exitosamente',
      review: reviewWithUser
    });
  } catch (error) {
    console.error('Error creating restaurant review:', error);
    res.status(500).json({ 
      message: 'Error al crear la reseña', 
      error: error.message 
    });
  }
};

// Obtener reseñas de una actividad
export const getActivityReviews = async (req, res) => {
  try {
    const { actividadturistica_id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    // Verificar que la actividad existe
    const actividad = await ActividadTuristica.findByPk(actividadturistica_id);
    if (!actividad) {
      return res.status(404).json({ message: 'Actividad no encontrada' });
    }

    // Obtener reseñas con paginación
    const reviews = await Resena.findAndCountAll({
      where: { 
        actividadturistica_id,
        restaurante_id: null
      },
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['id', 'nombre', 'apellido']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    // Calcular estadísticas
    const totalReviews = reviews.count;
    const averageRating = totalReviews > 0 
      ? (reviews.rows.reduce((sum, review) => sum + parseFloat(review.rating), 0) / totalReviews).toFixed(1)
      : 0;

    // Contar calificaciones por estrella
    const ratingCounts = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };

    reviews.rows.forEach(review => {
      const rating = Math.floor(parseFloat(review.rating));
      if (ratingCounts[rating] !== undefined) {
        ratingCounts[rating]++;
      }
    });

    res.json({
      reviews: reviews.rows,
      pagination: {
        total: totalReviews,
        total_pages: Math.ceil(totalReviews / limit),
        current_page: parseInt(page),
        limit: parseInt(limit)
      },
      statistics: {
        average_rating: parseFloat(averageRating),
        total_reviews: totalReviews,
        rating_distribution: ratingCounts
      }
    });
  } catch (error) {
    console.error('Error getting activity reviews:', error);
    res.status(500).json({ 
      message: 'Error al obtener reseñas', 
      error: error.message 
    });
  }
};

// Obtener reseñas de un restaurante
export const getRestaurantReviews = async (req, res) => {
  try {
    const { restaurante_id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    // Verificar que el restaurante existe
    const restaurante = await Restaurante.findByPk(restaurante_id);
    if (!restaurante) {
      return res.status(404).json({ message: 'Restaurante no encontrado' });
    }

    // Obtener reseñas con paginación
    const reviews = await Resena.findAndCountAll({
      where: { 
        restaurante_id,
        actividadturistica_id: null
      },
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['id', 'nombre', 'apellido']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    // Calcular estadísticas
    const totalReviews = reviews.count;
    const averageRating = totalReviews > 0 
      ? (reviews.rows.reduce((sum, review) => sum + parseFloat(review.rating), 0) / totalReviews).toFixed(1)
      : 0;

    // Contar calificaciones por estrella
    const ratingCounts = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };

    reviews.rows.forEach(review => {
      const rating = Math.floor(parseFloat(review.rating));
      if (ratingCounts[rating] !== undefined) {
        ratingCounts[rating]++;
      }
    });

    res.json({
      reviews: reviews.rows,
      pagination: {
        total: totalReviews,
        total_pages: Math.ceil(totalReviews / limit),
        current_page: parseInt(page),
        limit: parseInt(limit)
      },
      statistics: {
        average_rating: parseFloat(averageRating),
        total_reviews: totalReviews,
        rating_distribution: ratingCounts
      }
    });
  } catch (error) {
    console.error('Error getting restaurant reviews:', error);
    res.status(500).json({ 
      message: 'Error al obtener reseñas', 
      error: error.message 
    });
  }
};

// Actualizar reseña
export const updateReview = async (req, res) => {
  try {
    const { review_id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.userId;

    if (!rating) {
      return res.status(400).json({ 
        message: 'La calificación es obligatoria' 
      });
    }

    // Validar rating
    if (rating < 0.5 || rating > 5) {
      return res.status(400).json({ 
        message: 'La calificación debe estar entre 0.5 y 5' 
      });
    }

    // Buscar la reseña
    const review = await Resena.findOne({
      where: { 
        id: review_id,
        user_id // Solo el usuario que la creó puede editarla
      }
    });

    if (!review) {
      return res.status(404).json({ 
        message: 'Reseña no encontrada o no tienes permisos para editarla' 
      });
    }

    // Actualizar la reseña
    await review.update({
      rating,
      comment: comment || null
    });

    // Obtener la reseña actualizada con información del usuario
    const updatedReview = await Resena.findByPk(review_id, {
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['id', 'nombre', 'apellido']
        }
      ]
    });

    res.json({
      message: 'Reseña actualizada exitosamente',
      review: updatedReview
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ 
      message: 'Error al actualizar la reseña', 
      error: error.message 
    });
  }
};

// Eliminar reseña
export const deleteReview = async (req, res) => {
  try {
    const { review_id } = req.params;
    const user_id = req.user.userId;

    // Buscar la reseña
    const review = await Resena.findOne({
      where: { 
        id: review_id,
        user_id // Solo el usuario que la creó puede eliminarla
      }
    });

    if (!review) {
      return res.status(404).json({ 
        message: 'Reseña no encontrada o no tienes permisos para eliminarla' 
      });
    }

    // Eliminar la reseña
    await review.destroy();

    res.json({ message: 'Reseña eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ 
      message: 'Error al eliminar la reseña', 
      error: error.message 
    });
  }
};

// Obtener reseñas del usuario
export const getUserReviews = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    // Obtener reseñas del usuario
    const reviews = await Resena.findAndCountAll({
      where: { user_id },
      include: [
        {
          model: ActividadTuristica,
          as: 'actividad',
          attributes: ['id', 'nombre', 'fotos']
        },
        {
          model: Restaurante,
          as: 'restaurante',
          attributes: ['id', 'nombre', 'fotos']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      reviews: reviews.rows,
      pagination: {
        total: reviews.count,
        total_pages: Math.ceil(reviews.count / limit),
        current_page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error getting user reviews:', error);
    res.status(500).json({ 
      message: 'Error al obtener reseñas del usuario', 
      error: error.message 
    });
  }
}; 