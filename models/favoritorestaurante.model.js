import { DataTypes } from 'sequelize';

const FavoritoRestauranteModel = (sequelize) => {
  const FavoritoRestaurante = sequelize.define('FavoritoRestaurante', {
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
    restaurante_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'restaurante',
        key: 'id',
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'favoritorestaurante',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'restaurante_id'],
      },
    ],
  });

  return FavoritoRestaurante;
};

export default FavoritoRestauranteModel; 