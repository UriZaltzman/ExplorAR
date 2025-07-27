import { DataTypes } from 'sequelize';

const RestauranteModel = (sequelize) => {
  const Restaurante = sequelize.define('Restaurante', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    direccion: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    contacto: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    coordenadas_lat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    coordenadas_lng: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    seña: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categoria',
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    max_capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    current_bookings: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'restaurante',
    timestamps: false,
  });

  return Restaurante;
};

export default RestauranteModel; 