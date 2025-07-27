import sequelize from './db-config.js';
import UserModel from './models/user.model.js';

const User = UserModel(sequelize);

const testConnection = async () => {
  try {
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('Database connection successful');
    
    console.log('Syncing database...');
    await sequelize.sync({ force: true }); // Forzar recreación de tablas
    console.log('Database synced');
    
    console.log('Testing user creation...');
    const testUser = await User.create({
      nombre: 'Test',
      apellido: 'User',
      email: 'test@example.com',
      password: 'hashedpassword',
      dni: '12345678',
      role: 'user'
    });
    
    console.log('User created successfully:', testUser.id);
    
    console.log('Testing user retrieval...');
    const foundUser = await User.findOne({ where: { email: 'test@example.com' } });
    console.log('User found:', foundUser ? foundUser.id : 'Not found');
    
    console.log('Cleaning up...');
    await testUser.destroy();
    console.log('Test user deleted');
    
    console.log('All tests passed!');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

testConnection(); 