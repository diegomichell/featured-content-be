import { Sequelize } from 'sequelize';

export const getConnection = () => {
  return new Sequelize(
    `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:5432/featured_content_db`,
  );
};
