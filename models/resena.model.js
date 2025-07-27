import { DataTypes } from 'sequelize';

const ResenaModel = (sequelize) => {
  const Resena = sequelize.define('Resena', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
    actividadturistica_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'actividadturistica',
        key: 'id',
      },
    },
    restaurante_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'restaurante',
        key: 'id',
      },
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true,
      validate: {
        min: 0.5,
        max: 5.0,
        isDecimal: true,
      },
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'resena',
    timestamps: false,
  });

  return Resena;
};

export default ResenaModel; 