import { DataTypes } from 'sequelize';

const FechasDisponiblesRestauranteModel = (sequelize) => {
  const FechasDisponiblesRestaurante = sequelize.define('FechasDisponiblesRestaurante', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    restaurante_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'restaurante',
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
    tableName: 'fechasdisponiblesrestaurante',
    timestamps: false,
  });

  return FechasDisponiblesRestaurante;
};

export default FechasDisponiblesRestauranteModel; 