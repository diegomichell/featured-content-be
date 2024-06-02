import { DataTypes, Sequelize } from 'sequelize';

const getModel = (sequelize: Sequelize) => {
  const RequestLog = sequelize.define('RequestLog', {
    // Model attributes are defined here
    method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    headers: {
      type: DataTypes.JSON,
    },
    resStatusCode: {
      type: DataTypes.INTEGER,
    },
  });

  return RequestLog;
};

export default getModel;
