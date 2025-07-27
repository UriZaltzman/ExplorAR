import { DataTypes } from 'sequelize';

const VerificacionEmailModel = (sequelize) => {
  const VerificacionEmail = sequelize.define('VerificacionEmail', {
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
    codigo: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    fecha_expiracion: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    usado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'verificacionemail',
    timestamps: false,
  });

  return VerificacionEmail;
};

export default VerificacionEmailModel; 