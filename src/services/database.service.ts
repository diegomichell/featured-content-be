import { Injectable, OnModuleInit } from '@nestjs/common';
import { getConnection } from '../db/database';
import { Sequelize } from 'sequelize';
import getModel from '../models/request-log';
import { isTestEnv } from '../utils';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private sequelize: Sequelize;

  onModuleInit() {
    this.sequelize = getConnection();
  }

  getLoggerModel() {
    return getModel(this.sequelize);
  }

  async syncDb() {
    if (isTestEnv()) {
      return;
    }

    await this.getLoggerModel().sync();
  }
}
