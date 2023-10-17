import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';

import { AppDataSource } from './data-source';
import { User } from './entity/User';
import { Bike } from './entity/Bike';
import { BikesUsers } from './entity/BikesUsers';
//ts-ignore
import routes from '../api/routes';
import bikeRoutes from '../api/bikeRoutes';
import userRoutes from '../api/userRoutes';
import auth from '../api/middleware';

const express = require('express');

export const app = express();
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use('/', routes, auth, bikeRoutes, userRoutes);

app.listen(8080);
console.log('app listening on port 8080');

const seedBikes = [
  {
    model: 'Cruiser',
    color: 'pink',
    location: 'Los Angeles',
    ratings: [4, 5, 5, 5, 4, 5, 5],
    isAvailable: true,
  },
  {
    model: 'Cruiser',
    color: 'white',
    location: 'Los Angeles',
    ratings: [4, 5, 5, 3, 4, 5, 5],
    isAvailable: true,
  },
  {
    model: 'Mountain Bike',
    color: 'black',
    location: 'Los Angeles',
    ratings: [2, 4, 3, 3, 4, 5, 3],
    isAvailable: true,
  },
  {
    model: 'Road Bike',
    color: 'black',
    location: 'Los Angeles',
    ratings: [4, 5, 5, 5, 4, 5, 1],
    isAvailable: true,
  },
  {
    model: 'Cruiser',
    color: 'yellow',
    location: 'Los Angeles',
    ratings: [4, 5, 3, 3, 4, 5, 1],
    isAvailable: true,
  },
  {
    model: 'Road Bike',
    color: 'white',
    location: 'Los Angeles',
    ratings: [4, 5, 5, 3, 4, 5, 5],
    isAvailable: true,
  },
];

AppDataSource.initialize()
  .then(async () => {
    const usersExist = await AppDataSource.manager.find(User);

    if (!usersExist || !usersExist.length) {
      const password = 'password';
      const encryptedPassword = await bcrypt.hash(password, 10);

      console.log('Inserting a new user into the database...');
      const manager = new User();
      manager.fullName = 'Jimmy John';
      manager.role = 'manager';
      manager.username = 'manager';
      manager.password = encryptedPassword;
      await AppDataSource.manager.save(manager);

      const customer = new User();
      customer.fullName = 'Mister Bob';
      customer.role = 'customer';
      customer.username = 'customer';

      customer.password = encryptedPassword;
      await AppDataSource.manager.save(customer);

      console.log('Inserting new bikes into the database...');

      const bikePromises = seedBikes.map((b) => {
        const bike = new Bike();
        bike.model = b.model;
        bike.color = b.color;
        bike.location = b.location;
        bike.ratings = b.ratings;
        bike.isAvailable = b.isAvailable;
        return AppDataSource.manager.save(bike);
      });
      await Promise.all(bikePromises);

      const userRepo = AppDataSource.getRepository(User);
      const customers = await userRepo.find({ where: { role: 'customer' } });
      const fakeCustomer = customers[0];
      const bikes = await AppDataSource.manager.find(Bike);

      console.log('Inserting bikesUsers into the database...');

      const date = new Date();
      bikes.forEach((b) => {
        const bikesUsers = new BikesUsers();
        bikesUsers.bikeId = b.id;
        bikesUsers.userId = fakeCustomer.id;
        bikesUsers.date = date.toDateString();
        AppDataSource.manager.save(bikesUsers);

        const twoDaysLater = date.getDate() + 2;
        date.setDate(twoDaysLater);
      });
    }

    // Here you can setup and run express / fastify / any other framework
  })
  .catch((error) => console.log(error));
