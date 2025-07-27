import { DataTypes } from 'sequelize';

const FotoRestauranteModel = (sequelize) => {
  const FotoRestaurante = sequelize.define('FotoRestaurante', {
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
    tableName: 'fotorestaurante',
    timestamps: false,
  });

  return FotoRestaurante;
};

export default FotoRestauranteModel; 