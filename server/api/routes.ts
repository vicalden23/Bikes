var express = require('express');
var router = express.Router();

import { AppDataSource } from '../src/data-source';
import { User } from '../src/entity/User';
import {
  getAllBikes,
  getUsersReservations,
  getBikesReservations,
} from './helpers';

const userRepo = AppDataSource.getRepository(User);

router.get('/manager-page', async (req, res) => {
  const bikes = await getAllBikes();
  const managers = await userRepo.find({ where: { role: 'manager' } });
  const customers = await userRepo.find({ where: { role: 'customer' } });
  const userReservations = await getUsersReservations();
  const bikeReservations = await getBikesReservations();

  res.send({ bikes, managers, customers, userReservations, bikeReservations });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await userRepo.findOne({
    where: {
      username,
      password,
    },
  });

  res.send({ user });
});

export default router;
