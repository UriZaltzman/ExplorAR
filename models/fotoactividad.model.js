import { DataTypes } from 'sequelize';

const FotoActividadModel = (sequelize) => {
  const FotoActividad = sequelize.define('FotoActividad', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    actividadturistica_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'actividadturistica',
        key: 'id',
      },
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    orden: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'fotoactividad',
    timestamps: false,
  });

  return FotoActividad;
};

export default FotoActividadModel; 