import { DataTypes } from 'sequelize';

const FavoritoActividadModel = (sequelize) => {
  const FavoritoActividad = sequelize.define('FavoritoActividad', {
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
      allowNull: false,
      references: {
        model: 'actividadturistica',
        key: 'id',
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'favoritoactividad',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'actividadturistica_id'],
      },
    ],
  });

  return FavoritoActividad;
};

export default FavoritoActividadModel; 