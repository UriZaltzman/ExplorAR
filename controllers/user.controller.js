import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { User } from '../models/index.js';

// Crear usuario (admin)
export const createUser = async (req, res) => {
  try {
    const { nombre, apellido, email, password, dni, role } = req.body;

    if (!nombre || !apellido || !email || !password || !dni) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const existing = await User.findOne({ where: { [Op.or]: [{ email }, { dni }] } });
    if (existing) {
      return res.status(400).json({ message: 'Email o DNI ya registrados' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      nombre,
      apellido,
      email,
      password: hashed,
      dni,
      role: role || 'user',
      is_email_verified: false,
    });

    const { password: _, ...userWithoutPassword } = user.get({ plain: true });
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error in createUser:', error);
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
};

// Listar usuarios (admin) con paginación básica
export const listUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      offset,
      limit,
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']],
    });

    res.json({
      data: rows,
      pagination: { page, limit, total: count, pages: Math.ceil(count / limit) },
    });
  } catch (error) {
    console.error('Error in listUsers:', error);
    res.status(500).json({ message: 'Error al listar usuarios', error: error.message });
  }
};

// Obtener usuario por ID (admin)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    console.error('Error in getUserById:', error);
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
};

// Actualizar usuario (admin)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, password, dni, role, is_email_verified, profile_image_url } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Validar email/dni únicos si vienen en la actualización
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) return res.status(400).json({ message: 'Email ya registrado' });
    }
    if (dni && dni !== user.dni) {
      const dniExists = await User.findOne({ where: { dni } });
      if (dniExists) return res.status(400).json({ message: 'DNI ya registrado' });
    }

    const updateData = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    if (apellido !== undefined) updateData.apellido = apellido;
    if (email !== undefined) updateData.email = email;
    if (dni !== undefined) updateData.dni = dni;
    if (role !== undefined) updateData.role = role;
    if (profile_image_url !== undefined) updateData.profile_image_url = profile_image_url;
    if (typeof is_email_verified === 'boolean') updateData.is_email_verified = is_email_verified;

    if (password !== undefined && password !== '') {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updateData);

    const { password: __, ...userWithoutPassword } = user.get({ plain: true });
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error in updateUser:', error);
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
};

// Eliminar usuario (admin)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    await user.destroy();
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};


