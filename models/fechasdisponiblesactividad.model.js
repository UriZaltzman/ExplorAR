import { DataTypes } from 'sequelize';

const FechasDisponiblesActividadModel = (sequelize) => {
  const FechasDisponiblesActividad = sequelize.define('FechasDisponiblesActividad', {
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
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    hora_fin: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    capacidad_disponible: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'fechasdisponiblesactividad',
    timestamps: false,
  });

  return FechasDisponiblesActividad;
};

export default FechasDisponiblesActividadModel; 