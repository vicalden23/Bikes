import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Bike } from './entity/Bike';
import { BikesUsers } from './entity/BikesUsers';

export const AppDataSource = new DataSource({
  type: 'postgres',
  username: '',
  password: '',
  database: '',
  synchronize: true,
  logging: false,
  entities: [User, Bike, BikesUsers],
  migrations: [],
  subscribers: [],
});
