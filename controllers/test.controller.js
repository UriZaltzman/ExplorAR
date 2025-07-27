import { User } from '../models/index.js';
import bcrypt from 'bcryptjs';

// Endpoint de prueba simple
const testConnection = async (req, res) => {
  try {
    console.log('Testing database connection in HTTP request...');
    
    // Probar una consulta simple
    const userCount = await User.count();
    console.log('User count:', userCount);
    
    res.json({ 
      message: 'Database connection working', 
      userCount: userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
};

// Endpoint de prueba para crear usuario
const testCreateUser = async (req, res) => {
  try {
    console.log('Testing user creation in HTTP request...');
    
    const { nombre, apellido, email, password, dni } = req.body;
    
    // Validaciones básicas
    if (!nombre || !apellido || !email || !password || !dni) {
      return res.status(400).json({ 
        message: 'Todos los campos son obligatorios',
        error: 'Missing required fields'
      });
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'El email ya está registrado',
        error: 'Email already exists'
      });
    }
    
    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const testUser = await User.create({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      dni,
      role: 'user',
      is_email_verified: true // Para pruebas
    });
    
    console.log('User created successfully:', testUser.id);
    
    // Limpiar el usuario de prueba
    await testUser.destroy();
    console.log('Test user deleted');
    
    res.json({ 
      message: 'User creation working', 
      userId: testUser.id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('User creation failed:', error);
    res.status(500).json({ 
      message: 'User creation failed', 
      error: error.message 
    });
  }
};

export { testConnection, testCreateUser }; 