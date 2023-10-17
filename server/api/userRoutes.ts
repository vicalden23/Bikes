var express = require('express');
var router = express.Router();
import { AppDataSource } from '../src/data-source';
import { BikesUsers } from '../src/entity/BikesUsers';
import { User } from '../src/entity/User';
import {
  getUserReservations,
  getAllBikes,
  getUsersReservations,
  getBikesReservations,
} from './helpers';

const userRepo = AppDataSource.getRepository(User);
const bikesUsers = AppDataSource.getRepository(BikesUsers);

router.get('/users', async (req, res) => {
  const users = await userRepo.find();

  res.send({ users });
});

router.get('/manager-page', async (req, res) => {
  const bikes = await getAllBikes();
  const managers = await userRepo.find({ where: { role: 'manager' } });
  const customers = await userRepo.find({ where: { role: 'customer' } });
  const userReservations = await getUsersReservations();
  const bikeReservations = await getBikesReservations();

  res.send({ bikes, managers, customers, userReservations, bikeReservations });
});

router.put('/users', async (req, res) => {
  const { id, remove, fullName, role, username, password } = req.body;

  if (remove) {
    await userRepo.delete({ id });
  } else {
    await userRepo.update({ id }, { fullName, role, username, password });
  }

  const managers = await userRepo.find({ where: { role: 'manager' } });
  const customers = await userRepo.find({ where: { role: 'customer' } });

  res.send({ managers, customers });
});

router.delete('/users/reservations', async (req, res) => {
  const { reservationId, userId } = req.body;

  await bikesUsers.delete({ id: reservationId });
  const reservations = await getUserReservations(userId);
  const bikes = await getAllBikes();

  res.send({ reservations, bikes });
});

router.get('/users/:id', async (req, res) => {
  const reservations = await getUserReservations(req.params.id);
  res.send({ reservations });
});

export default router;
