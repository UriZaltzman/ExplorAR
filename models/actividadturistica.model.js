import { DataTypes } from 'sequelize';

const ActividadTuristicaModel = (sequelize) => {
  const ActividadTuristica = sequelize.define('ActividadTuristica', {
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
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'duración en minutos',
    },
    direccion: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    contacto: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    // coordenadas_lat: {
    //   type: DataTypes.DECIMAL(10, 8),
    //   allowNull: true,
    // },
    // coordenadas_lng: {
    //   type: DataTypes.DECIMAL(11, 8),
    //   allowNull: true,
    // },
    google_maps_link: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    precio: {
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
    tableName: 'actividadturistica',
    timestamps: false,
  });

  return ActividadTuristica;
};

export default ActividadTuristicaModel; 