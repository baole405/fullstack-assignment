import { Sequelize } from "sequelize";
import config from "../../config";

export class BaseRepository {
  public sequelizeClient: Sequelize;

  constructor() {
    this.sequelizeClient = new Sequelize(
      config.db.database,
      config.db.user,
      config.db.password,
      {
        host: config.db.host,
        port: config.db.port,
        dialect: "postgres",
        logging: false,
      },
    );
  }
}
