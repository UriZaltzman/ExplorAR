import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import UserModel from './user.model.js';
import CategoriaModel from './categoria.model.js';
import ActividadTuristicaModel from './actividadturistica.model.js';
import RestauranteModel from './restaurante.model.js';
import FechasDisponiblesActividadModel from './fechasdisponiblesactividad.model.js';
import FechasDisponiblesRestauranteModel from './fechasdisponiblesrestaurante.model.js';
import ResenaModel from './resena.model.js';
import FavoritoActividadModel from './favoritoactividad.model.js';
import FavoritoRestauranteModel from './favoritorestaurante.model.js';
import FotoActividadModel from './fotoactividad.model.js';
import FotoRestauranteModel from './fotorestaurante.model.js';
import VerificacionEmailModel from './verificacionemail.model.js';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// Definir modelos
const User = UserModel(sequelize);
const Categoria = CategoriaModel(sequelize);
const ActividadTuristica = ActividadTuristicaModel(sequelize);
const Restaurante = RestauranteModel(sequelize);
const FechasDisponiblesActividad = FechasDisponiblesActividadModel(sequelize);
const FechasDisponiblesRestaurante = FechasDisponiblesRestauranteModel(sequelize);
const Resena = ResenaModel(sequelize);
const FavoritoActividad = FavoritoActividadModel(sequelize);
const FavoritoRestaurante = FavoritoRestauranteModel(sequelize);
const FotoActividad = FotoActividadModel(sequelize);
const FotoRestaurante = FotoRestauranteModel(sequelize);
const VerificacionEmail = VerificacionEmailModel(sequelize);

// Definir asociaciones
// Usuario - ActividadTuristica (admin que crea la actividad)
User.hasMany(ActividadTuristica, { foreignKey: 'user_id', as: 'actividadesCreadas' });
ActividadTuristica.belongsTo(User, { foreignKey: 'user_id', as: 'creador' });

// Usuario - Restaurante (admin que crea el restaurante)
User.hasMany(Restaurante, { foreignKey: 'user_id', as: 'restaurantesCreados' });
Restaurante.belongsTo(User, { foreignKey: 'user_id', as: 'creador' });

// Categoria - ActividadTuristica
Categoria.hasMany(ActividadTuristica, { foreignKey: 'categoria_id', as: 'actividades' });
ActividadTuristica.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'categoria' });

// Categoria - Restaurante
Categoria.hasMany(Restaurante, { foreignKey: 'categoria_id', as: 'restaurantes' });
Restaurante.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'categoria' });

// ActividadTuristica - FechasDisponiblesActividad
ActividadTuristica.hasMany(FechasDisponiblesActividad, { foreignKey: 'actividadturistica_id', as: 'fechasDisponibles' });
FechasDisponiblesActividad.belongsTo(ActividadTuristica, { foreignKey: 'actividadturistica_id', as: 'actividad' });

// Restaurante - FechasDisponiblesRestaurante
Restaurante.hasMany(FechasDisponiblesRestaurante, { foreignKey: 'restaurante_id', as: 'fechasDisponibles' });
FechasDisponiblesRestaurante.belongsTo(Restaurante, { foreignKey: 'restaurante_id', as: 'restaurante' });

// Usuario - Resena
User.hasMany(Resena, { foreignKey: 'user_id', as: 'resenas' });
Resena.belongsTo(User, { foreignKey: 'user_id', as: 'usuario' });

// ActividadTuristica - Resena
ActividadTuristica.hasMany(Resena, { foreignKey: 'actividadturistica_id', as: 'resenas' });
Resena.belongsTo(ActividadTuristica, { foreignKey: 'actividadturistica_id', as: 'actividad' });

// Restaurante - Resena
Restaurante.hasMany(Resena, { foreignKey: 'restaurante_id', as: 'resenas' });
Resena.belongsTo(Restaurante, { foreignKey: 'restaurante_id', as: 'restaurante' });

// Usuario - FavoritoActividad
User.hasMany(FavoritoActividad, { foreignKey: 'user_id', as: 'favoritosActividades' });
FavoritoActividad.belongsTo(User, { foreignKey: 'user_id', as: 'usuario' });
ActividadTuristica.hasMany(FavoritoActividad, { foreignKey: 'actividadturistica_id', as: 'favoritos' });
FavoritoActividad.belongsTo(ActividadTuristica, { foreignKey: 'actividadturistica_id', as: 'actividad' });

// Usuario - FavoritoRestaurante
User.hasMany(FavoritoRestaurante, { foreignKey: 'user_id', as: 'favoritosRestaurantes' });
FavoritoRestaurante.belongsTo(User, { foreignKey: 'user_id', as: 'usuario' });
Restaurante.hasMany(FavoritoRestaurante, { foreignKey: 'restaurante_id', as: 'favoritos' });
FavoritoRestaurante.belongsTo(Restaurante, { foreignKey: 'restaurante_id', as: 'restaurante' });

// ActividadTuristica - FotoActividad
ActividadTuristica.hasMany(FotoActividad, { foreignKey: 'actividadturistica_id', as: 'fotos' });
FotoActividad.belongsTo(ActividadTuristica, { foreignKey: 'actividadturistica_id', as: 'actividad' });

// Restaurante - FotoRestaurante
Restaurante.hasMany(FotoRestaurante, { foreignKey: 'restaurante_id', as: 'fotos' });
FotoRestaurante.belongsTo(Restaurante, { foreignKey: 'restaurante_id', as: 'restaurante' });

// Usuario - VerificacionEmail
User.hasMany(VerificacionEmail, { foreignKey: 'user_id', as: 'verificacionesEmail' });
VerificacionEmail.belongsTo(User, { foreignKey: 'user_id', as: 'usuario' });

export {
  sequelize,
  User,
  Categoria,
  ActividadTuristica,
  Restaurante,
  FechasDisponiblesActividad,
  FechasDisponiblesRestaurante,
  Resena,
  FavoritoActividad,
  FavoritoRestaurante,
  FotoActividad,
  FotoRestaurante,
  VerificacionEmail,
};
