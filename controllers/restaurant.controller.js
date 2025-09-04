import {
  Restaurante,
  Categoria,
  FechasDisponiblesRestaurante,
  Resena,
  FavoritoRestaurante,
  FotoRestaurante,
  User,
} from '../models/index.js';
import { Op } from 'sequelize';

// Obtener todos los restaurantes con filtros
export const getRestaurants = async (req, res) => {
  try {
    const {
      search,
      categoria,
      precio_min,
      precio_max,
      page = 1,
      limit = 10,
      sort_by = 'created_at',
      sort_order = 'DESC',
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { is_active: true };

    if (search) {
      whereClause.nombre = { [Op.iLike]: `%${search}%` };
    }

    if (categoria) {
      whereClause.categoria_id = categoria;
    }

    if (precio_min || precio_max) {
      whereClause.precio = {};
      if (precio_min) whereClause.precio[Op.gte] = parseFloat(precio_min);
      if (precio_max) whereClause.precio[Op.lte] = parseFloat(precio_max);
    }

    const restaurants = await Restaurante.findAndCountAll({
      where: whereClause,
      include: [
        { model: Categoria, as: 'categoria', attributes: ['id', 'nombre', 'tipo'] },
        { model: User, as: 'creador', attributes: ['id', 'nombre', 'apellido'] },
        {
          model: FotoRestaurante,
          as: 'fotos',
          attributes: ['id', 'url', 'orden'],
          order: [['orden', 'ASC']],
          limit: 1,
        },
      ],
      order: [[sort_by, sort_order.toUpperCase()]],
      limit: parseInt(limit),
      offset,
      distinct: true,
    });

    // Calcular rating promedio
    const restaurantsWithRating = await Promise.all(
      restaurants.rows.map(async (restaurant) => {
        const resenas = await Resena.findAll({
          where: { restaurante_id: restaurant.id },
          attributes: ['rating'],
        });
        const ratings = resenas.map((r) => parseFloat(r.rating)).filter((r) => !isNaN(r));
        const averageRating = ratings.length > 0
          ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
          : null;
        return {
          ...restaurant.toJSON(),
          average_rating: averageRating,
          total_reviews: ratings.length,
        };
      })
    );

    res.json({
      restaurants: restaurantsWithRating,
      total: restaurants.count,
      total_pages: Math.ceil(restaurants.count / limit),
      current_page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error('Error getting restaurants:', error);
    res.status(500).json({ message: 'Error al obtener restaurantes', error: error.message });
  }
};

// Obtener un restaurante por ID con detalles
export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurante.findByPk(id, {
      include: [
        { model: Categoria, as: 'categoria', attributes: ['id', 'nombre', 'tipo'] },
        { model: User, as: 'creador', attributes: ['id', 'nombre', 'apellido'] },
        { model: FotoRestaurante, as: 'fotos', attributes: ['id', 'url', 'orden'], order: [['orden', 'ASC']] },
        {
          model: FechasDisponiblesRestaurante,
          as: 'fechasDisponibles',
          attributes: ['id', 'fecha', 'hora_inicio', 'hora_fin', 'capacidad_disponible'],
          where: { fecha: { [Op.gte]: new Date() } },
          order: [['fecha', 'ASC'], ['hora_inicio', 'ASC']],
          required: false,
        },
      ],
    });

    if (!restaurant) return res.status(404).json({ message: 'Restaurante no encontrado' });

    const resenas = await Resena.findAll({
      where: { restaurante_id: id },
      include: [{ model: User, as: 'usuario', attributes: ['id', 'nombre', 'apellido'] }],
      order: [['fecha', 'DESC']],
      limit: 10,
    });

    const ratings = resenas.map((r) => parseFloat(r.rating)).filter((r) => !isNaN(r));
    const averageRating = ratings.length > 0
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : null;

    let isFavorite = false;
    if (req.user) {
      const favorito = await FavoritoRestaurante.findOne({
        where: { user_id: req.user.userId, restaurante_id: id },
      });
      isFavorite = !!favorito;
    }

    res.json({
      ...restaurant.toJSON(),
      average_rating: averageRating,
      total_reviews: ratings.length,
      resenas,
      is_favorite: isFavorite,
    });
  } catch (error) {
    console.error('Error getting restaurant by id:', error);
    res.status(500).json({ message: 'Error al obtener restaurante', error: error.message });
  }
};

// Crear restaurante (solo admin)
export const createRestaurant = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Solo los administradores pueden crear restaurantes' });
    }

    const {
      nombre,
      descripcion,
      direccion,
      contacto,
      coordenadas_lat,
      coordenadas_lng,
      precio,
      seña,
      categoria_id,
      max_capacity,
      fotos = [],
    } = req.body;

    const restaurant = await Restaurante.create({
      nombre,
      descripcion,
      direccion,
      contacto,
      coordenadas_lat,
      coordenadas_lng,
      precio,
      seña,
      categoria_id,
      user_id: req.user.userId,
      max_capacity,
    });

    if (fotos.length > 0) {
      const fotosData = fotos.map((url, index) => ({ restaurante_id: restaurant.id, url, orden: index }));
      await FotoRestaurante.bulkCreate(fotosData);
    }

    res.status(201).json({ message: 'Restaurante creado exitosamente', restaurant: { id: restaurant.id, nombre: restaurant.nombre } });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ message: 'Error al crear restaurante', error: error.message });
  }
};

// Actualizar restaurante (solo admin y creador)
export const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Solo los administradores pueden actualizar restaurantes' });
    }

    const restaurant = await Restaurante.findByPk(id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurante no encontrado' });
    if (restaurant.user_id !== req.user.userId) {
      return res.status(403).json({ message: 'Solo puedes actualizar tus propios restaurantes' });
    }

    const updateData = { ...req.body };
    delete updateData.id;
    await restaurant.update(updateData);

    res.json({ message: 'Restaurante actualizado exitosamente', restaurant: { id: restaurant.id, nombre: restaurant.nombre } });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ message: 'Error al actualizar restaurante', error: error.message });
  }
};

// Eliminar restaurante (marcar inactivo)
export const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Solo los administradores pueden eliminar restaurantes' });
    }

    const restaurant = await Restaurante.findByPk(id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurante no encontrado' });
    if (restaurant.user_id !== req.user.userId) {
      return res.status(403).json({ message: 'Solo puedes eliminar tus propios restaurantes' });
    }

    await restaurant.update({ is_active: false });
    res.json({ message: 'Restaurante eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ message: 'Error al eliminar restaurante', error: error.message });
  }
};

// Obtener categorías (opcionalmente por tipo)
export const getRestaurantCategories = async (req, res) => {
  try {
    const { tipo } = req.query;
    const whereClause = tipo ? { tipo } : {};
    const categories = await Categoria.findAll({ where: whereClause, order: [['nombre', 'ASC']] });
    res.json(categories);
  } catch (error) {
    console.error('Error getting restaurant categories:', error);
    res.status(500).json({ message: 'Error al obtener categorías', error: error.message });
  }
};


